from flask import Blueprint, jsonify, request, Response
import csv
from app.extensions import db
from app.models import StudentTeam, Students, Teachers, Teams, Assessments, StudentEval
from flask_jwt_extended import jwt_required, get_jwt_identity, decode_token, get_jwt

team_bp = Blueprint('team_bp', __name__)

@team_bp.route('/teams', methods=['GET'])
@jwt_required()
def get_teams():
    user_identity = int(get_jwt_identity())
    user_claims = get_jwt()
    if user_claims.get("user_type") != "teacher":
        return jsonify({"Response": "INVALID", "Reason": "Only teachers can access this route"}), 403
    teams = Teams.query.all()
    team_list = [team.to_dict() for team in teams]
    return jsonify(team_list), 200

@team_bp.route('/teams/<int:id>', methods=['GET'])
@jwt_required()
def get_team(id):
    user_identity = int(get_jwt_identity())
    user_claims = get_jwt()
    #if user_claims.get("user_type") != "teacher":
    #    return jsonify({"Response": "INVALID", "Reason": "Only teachers can access this route"}), 403
    
    students_in_team = StudentTeam.query.filter_by(team_id=id).all()
    students = [Students.query.get(student.student_id).to_dict() for student in students_in_team]
    return jsonify(students), 200


#Returns teammates in a team i.e. all team members except student himself
@team_bp.route('/teams/<int:id>/teammates', methods=['GET'])
@jwt_required()
def get_teammates(id):
    user_identity = int(get_jwt_identity())
    user_claims = get_jwt()
    if user_claims.get("user_type") != "student":
        return jsonify({"Response": "INVALID", "Reason": "Only student can access this route"}), 403
    
    user_id = user_identity
    
    students_in_team = StudentTeam.query.filter_by(team_id=id).all()

    # List of student IDs in the current team, excluding the current student
    student_ids_in_team = [student.student_id for student in students_in_team if student.student_id != user_id]

    # Query StudentEval to find out if any evaluations have been made and filter them accordingly
    students = []
    for student_id in student_ids_in_team:
        # Check if the student is in the StudentEval table with has_reviewed=False
        eval = StudentEval.query.filter_by(sender_id=user_id, receiver_id=student_id).first()
        
        if eval is None or eval.has_reviewed == False:
            student = Students.query.get(student_id)
            if student:
                students.append(student.to_dict())
                
    return jsonify(students), 200



@team_bp.route('/teams', methods=['POST'])
@jwt_required()
def create_team():
    team_name = request.json['name']
    students_emails = request.json['student_emails']
    
    user_identity = int(get_jwt_identity())
    user_claims = get_jwt()
    if user_claims.get("user_type") != "teacher":
        return jsonify({"Response": "INVALID", "Reason": "Only teacher can access this route"}), 403

    existing_team = Teams.query.filter_by(name=team_name).first()
    if existing_team:
        return jsonify({"Response": "INVALID", "Reason": "Team name already exists"}), 400

    new_team = Teams(name=team_name)
    db.session.add(new_team)

    for email in students_emails:
        student = Students.query.filter_by(email=email).first()
        if student:
            if student.is_available:
                new_student_team = StudentTeam(student_id=student.id, team_id=new_team.id)
                db.session.add(new_student_team)
                student.is_available = False
            else:
                db.session.rollback()
                return jsonify({"Response": "INVALID", "Reason": f"Student {email} is not available"}), 400
        else:
            db.session.rollback()
            return jsonify({"Response": "INVALID", "Reason": f"Student {email} not found"}), 400

    db.session.commit()
    return jsonify({"Response": "VALID"}), 201

@team_bp.route('/teams/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_team(id):
    user_identity = int(get_jwt_identity())
    user_claims = get_jwt()
    if user_claims.get("user_type") != "teacher":
        return jsonify({"Response": "INVALID", "Reason": "Only teacher can access this route"}), 403

    team = Teams.query.get(id)
    if not team:
        return jsonify({"Response": "INVALID", "Reason": "Team not found"}), 404

    student_teams = StudentTeam.query.filter_by(team_id=id).all()
    for student_team in student_teams:
        student = Students.query.get(student_team.student_id)
        if student:
            student.is_available = True

        Assessments.query.filter_by(sender_id = student_team.student_id).delete()
        StudentEval.query.filter_by(sender_id = student_team.student_id).delete()

    StudentTeam.query.filter_by(team_id=id).delete()
    db.session.delete(team)
    db.session.commit()

    return jsonify({"Response": "VALID", "Reason": "Team deleted successfully"}), 200

@team_bp.route('/teams/<int:id>', methods=['PUT'])
@jwt_required()
def update_team(id):
    user_identity = int(get_jwt_identity())
    user_claims = get_jwt()
    if user_claims.get("user_type") != "teacher":
        return jsonify({"Response": "INVALID", "Reason": "Only teacher can access this route"}), 403

    team = Teams.query.get(id)
    if not team:
        return jsonify({"Response": "INVALID", "Reason": "Team not found"}), 404

    team_name = request.json.get('name')
    if team_name:
        existing_team = Teams.query.filter_by(name=team_name).first()
        if existing_team and existing_team.id != id:
            return jsonify({"Response": "INVALID", "Reason": "Team name already exists"}), 400
        team.name = team_name

    students_emails = request.json.get('student_emails')
    if students_emails is not None:
        current_student_teams = StudentTeam.query.filter_by(team_id=id).all()
        for student_team in current_student_teams:
            student = Students.query.get(student_team.student_id)
            if student:
                student.is_available = True

        StudentTeam.query.filter_by(team_id=id).delete()

        for email in students_emails:
            student = Students.query.filter_by(email=email).first()
            if student:
                new_student_team = StudentTeam(student_id=student.id, team_id=team.id)
                db.session.add(new_student_team)
                student.is_available = False
            else:
                db.session.rollback()
                return jsonify({"Response": "INVALID", "Reason": f"Student {email} not found"}), 400

    db.session.commit()
    return jsonify({"Response": "VALID", "Reason": "Team updated successfully"}), 200

@team_bp.route('/teams/<int:id>/students', methods=['GET'])
@jwt_required()
def get_students_from_team(id):
    user_identity = int(get_jwt_identity())
    user_claims = get_jwt()
    if user_claims.get("user_type") != "teacher":
        return jsonify({"Response": "INVALID", "Reason": "Only teacher can access this route"}), 403
    
    student_teams = StudentTeam.query.filter_by(team_id=id).all()
    student_ids = [student_team.student_id for student_team in student_teams]
    students = Students.query.filter(Students.id.in_(student_ids)).all()

    student_list = [student.to_dict() for student in students]
    return jsonify(student_list), 200

@team_bp.route('/teams/export', methods=['GET'])
@jwt_required()
def export_teams_to_csv():
    user_identity = int(get_jwt_identity())
    user_claims = get_jwt()

    # Ensure only teachers can access this route
    if user_claims.get("user_type") != "teacher":
        return jsonify({"Response": "INVALID", "Reason": "Only teachers can access this route"}), 403

    # Fetch all teams and related data
    teams = Teams.query.all()
    if not teams:
        return jsonify({"Response": "INVALID", "Reason": "No teams available to export"}), 404

    # Prepare CSV data
    csv_data = []
    csv_data.append(["Team ID", "Team Name", "Student ID", "Student Name", "Student Email"])

    for team in teams:
        team_students = StudentTeam.query.filter_by(team_id=team.id).all()
        for student_team in team_students:
            student = Students.query.get(student_team.student_id)
            csv_data.append([
                team.id,
                team.name,
                student.id if student else "N/A",
                student.name if student else "N/A",
                student.email if student else "N/A"
            ])

    # Generate the CSV response
    def generate_csv():
        for row in csv_data:
            yield ",".join(map(str, row)) + "\n"

    response = Response(generate_csv(), mimetype='text/csv')
    response.headers['Content-Disposition'] = 'attachment; filename=teams.csv'
    return response