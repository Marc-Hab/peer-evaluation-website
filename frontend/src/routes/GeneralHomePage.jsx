import "../css/general-home.css";
import studentImage from "../assets/student.jpg";
export default function GeneralHomePage() {
  return (
    <main className="home-page">
      <h1>Welcome to our Peer Assessment Tool!</h1>
      
      <div className="contents">
        <div className="image-wrapper">
          <img className="student-image" src={studentImage} alt="Student" />
        </div>
        
        <div className="context">
          <h2>About us</h2>
          <p>
          Peerly is a peer assessment platform designed to make group work accountability effortless. <br/> <br/>
          Founded with a focus on clarity and fairness, Peerly helps students 
          and teams give and receive structured, meaningful feedback. <br/><br/>
          We work closely with educators and institutions who value transparency and want to foster a culture of constructive collaboration.
          </p>
        </div>
      </div>
    </main>
  );
}
