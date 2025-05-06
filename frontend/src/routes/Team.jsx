import "../css/main-student.css";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

import { fetchProtectedAPI } from "../functions/apiinterface";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MyTeam() {
  const [team, setTeam] = useState(undefined);
  const [students, setStudents] = useState([]);

  const fetchTeam = async () => {
    const token = localStorage.getItem("token");
    const user_info = jwtDecode(token);

    await fetchProtectedAPI(`/students/${user_info.sub}/team`, token).then(
      async (response) => {
        if (response.data.Response === "VALID") {
          setTeam(response.data.Team);

          await fetchProtectedAPI(
            `/teams/${response.data.Team.id}`,
            token
          ).then((response) => {
            setStudents(response.data);
          });
        }
      }
    );
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <main className="main-student">
      <h2> Your Team</h2>
      {team ? <Team team={team} students={students} /> : <NoTeam />}
    </main>
  );
}

const handleCopyClick = (email) => {
  navigator.clipboard.writeText(email)
};

function Team({ team, students }) {
  const navigate = useNavigate();
  const select = () => navigate("/student/select-teammate");

  return (
    <div className="team-info" data-testid={team.name}>
      <ul>
        <h3>{team.name}</h3>
        {students.map((student, index) => (
          <li key={student.id}>
            <span className="list-number">{index + 1}.</span>
            <span className="student-name">{student.name}</span>
            <span className="student-email">✉️ {student.email}</span>
          </li>
        ))}
        <div className="button-wrapper">
          <button className="evaluate" onClick={select}>
            Evaluate a Team Member
          </button>
        </div>
      </ul>
    </div>
  );
}

function NoTeam() {
  return <h1>You have not been assigned a team.</h1>;
}

// Add PropTypes validation
Team.propTypes = {
  team: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};
