import PropTypes from "prop-types";
import "../css/dashboard.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { fetchProtectedAPI } from "../functions/apiinterface";

function StarScore({ average }) {
  return (
    <div className="star-row">
      <span>{average >= 1 ? "★" : "☆"}</span>
      <span>{average >= 2 ? "★" : "☆"}</span>
      <span>{average >= 3 ? "★" : "☆"}</span>
      <span>{average >= 4 ? "★" : "☆"}</span>
      <span>{average >= 5 ? "★" : "☆"}</span>
    </div>
  );
}

StarScore.propTypes = {
  average: PropTypes.number.isRequired
}

function StarTable({ team_members }) {
  return (
    <table className="star-table">
      <tbody>
        {team_members.map((student) => (
          <tr key={student.id}>
            <th>{student.name}</th>
            <td>
              <StarScore average={student.average} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

StarTable.propTypes = {
  team_members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      average: PropTypes.number.isRequired,
    })
  ).isRequired
}

function sum_score(assessment) {
  return (
    assessment.cooperation_score +
    assessment.conceptual_contribution_score +
    assessment.practical_contribution_score +
    assessment.work_ethic_score
  );
}

function average(assessment) {
  const avg = sum_score(assessment) / 4;
  return avg.toFixed(1);
}

function total_avg(assessments) {
  let tot = 0;

  for (const assessment of assessments) {
    tot += sum_score(assessment) / 4;
  }

  if (tot > 0) {
    tot = tot / assessments.length;
  }

  return Math.ceil(tot);
}

function StudentTable({ assessments }) {
  return (
    <table className="student-table">
      <thead>
        <tr>
          <th></th>
          <th>Cooperation</th>
          <th>Conceptual Contribution</th>
          <th>Practical Contribution</th>
          <th>Work Ethic</th>
          <th>Average</th>
        </tr>
      </thead>
      <tbody>
        {assessments.map((assessment, index) => {
          return (
            <tr key={assessment.id} className={index % 2 == 0 ? "even" : "odd"}>
              <td>Feedback #{index + 1}</td>
              <td>{assessment.cooperation_score}</td>
              <td>{assessment.conceptual_contribution_score}</td>
              <td>{assessment.practical_contribution_score}</td>
              <td>{assessment.work_ethic_score}</td>
              <td>{average(assessment)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

StudentTable.propTypes = {
  assessments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      cooperation_score: PropTypes.number.isRequired,
      conceptual_contribution_score: PropTypes.number.isRequired,
      practical_contribution_score: PropTypes.number.isRequired,
      work_ethic_score: PropTypes.number.isRequired
    })
  ).isRequired
}

function StudentComments({ assessments }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = textarea.scrollHeight + "px"; // Set to content height
    }
  }, [assessments]); // Trigger when assessments change


  return (
    <textarea
      ref={textareaRef}
      id="comments"
      name="comments"
      maxLength="500"
      cols="100"
      value={assessments
        .map((assessment) => `> ${assessment.comments}`)
        .join("\n")}
      readOnly
      tabIndex="-1"
      style={{ overflow: "hidden", resize: "none" }}
    ></textarea>
  );
}

StudentComments.propTypes = {
  assessments: PropTypes.arrayOf(
    PropTypes.shape({
      comments: PropTypes.string
    })
  ).isRequired
}

function StudentDash({ student }) {
  return (
    <>
      <h4>{student.name} - Feedback Overview</h4>
      <div className="student-feedback">
        <StudentTable assessments={student.assessments} />
        <h4>Comments Received</h4>
        <StudentComments assessments={student.assessments} />
      </div>
    </>
  );
}

StudentDash.propTypes = {
  student: PropTypes.shape({
    name: PropTypes.string.isRequired, 
    assessments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        cooperation_score: PropTypes.number.isRequired,
        conceptual_contribution_score: PropTypes.number.isRequired,
        practical_contribution_score: PropTypes.number.isRequired,
        work_ethic_score: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired,
}

function StudentsDash({ students }) {
  return (
    <>
      {students.map((student) => (
        <StudentDash key={student.id} student={student} />
      ))}
    </>
  );
}

// Define prop types for StudentsDash component
StudentsDash.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
}

export default function Dashboard() {
  const location = useLocation(); // Retrieve the state passed via navigate
  const navigate = useNavigate();
  const { team, students } = location.state; // Extract the team data
  const [team_members, setTeamMembers] = useState(students);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = async () => {
    const token = localStorage.getItem("token");

    try {
      const newStudents = [...team_members]; // Create a copy of the students array

      // Fetch data for each student
      for (let i = 0; i < newStudents.length; i++) {
        const response = await fetchProtectedAPI(
          `/assessments/student/${newStudents[i].id}`,
          token
        );
        const ass = response.data.Assessments;

        // Calculate and update student average and assessments
        newStudents[i] = {
          ...newStudents[i],
          average: total_avg(ass),
          assessments: ass,
        };
      }

      // Update the state with the new students data
      setTeamMembers(newStudents);
      setLoading(false); // Set loading to false once the data is fetched
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  useEffect(() => {
    fetchAssessments(); // Call fetchAssessments when component mounts
  }, []); // Empty dependency array to run only once on mount

  if (loading) {
    return <div></div>; // Show a loading message or spinner while data is being fetched
  }

  return (
    <main className="dashboard">
      <h2>{team.name} - Feedback Overview</h2>
      <h4>Overall Score</h4>
      <StarTable team_members={team_members} />
      <StudentsDash students={team_members} />
    </main>
  );
}

