import "../css/about-us.css"; // Optional for styling
import dara from "../assets/dara.jpg"
import oren from "../assets/oren.jpg"
import mathieu from "../assets/mathieu.jpg";
import brandon from "../assets/brandon.jpg";
import daniel from "../assets/daniel.jpg";
import marc from "../assets/marc.jpg";

export default function AboutUs() {
  return (
    <div className="about-us-container">
      <div className="about-us-header">
        <h1>About Us</h1>
        <p className="subtitle">Empowering teams with efficient peer assessment.</p>
      </div>

      <section className="about-us-section">
        <h2>Our Mission</h2>
        <p>
          Our goal is simple: To provide a tool that makes peer assessment smooth,
          transparent, and effective. We believe in building stronger teams through
          clear, actionable feedback.
        </p>

        <h2>What We Do</h2>
        <p>
          Peer Assessment Tool allows you to easily track contributions, collaboration,
          and overall performance. Whether you’re in a classroom or at the office,
          our platform makes assessments efficient and insightful.
        </p>

        <h2>Meet the Team</h2>
        <div className="team-members">
          <div className="team-member">
              <h3>Dara Dadgar</h3>
              <p className="title">Scrum Master</p>
              <div className="img-desc">
                <img src={dara} alt="Team Member" />
                <p className="desc">Dara excels at fostering collaboration and ensuring the team adheres to Agile principles.
                  With strong organizational skills, he guides projects to success by resolving roadblocks 
                  and keeping everyone aligned with the project goals.</p>
              </div>
          </div>
          <div className="team-member">
            <h3>Marchelino Habchi</h3>
            <p className="title">Full Stack Developer</p>
            <div className="img-desc">
              <img src={marc} alt="Team Member" />
              <p className="desc">Marchelino is a versatile full stack developer who brings ideas to life from mockups to deployment.
                With a keen eye for design and a strong command of code, he bridges frontend creativity with 
                backend functionality to deliver polished, user-friendly experiences.</p>
            </div>
          </div>
          <div className="team-member">
            <h3>Mathieu Phan</h3>
            <p className="title">Quality Assurance Manager</p>
            <div className="img-desc">
              <img src={mathieu} alt="Team Member" />
              <p className="desc">Mathieu is dedicated to delivering flawless products by leading rigorous testing procedures.
                His attention to detail and commitment to excellence ensure a top-tier user experience.</p>
            </div>
          </div>
          <div className="team-member">
            <h3>Daniel Secelean</h3>
            <p className="title">Cloud Engineer</p>
            <div className="img-desc">
              <img src={daniel} alt="Team Member" />
              <p className="desc">Daniel is a skilled architect of scalable, reliable cloud solutions.
                He designs and implements robust infrastructure to support the team’s applications and ensure seamless operations.</p>
            </div>
          </div>
          <div className="team-member">
            <h3>Oren Argot</h3>
            <p className="title">Software Process Specialist</p>
            <div className="img-desc">
              <img src={oren} alt="Team Member" />
              <p className="desc">Oren is an expert in optimizing workflows and refining software development methodologies.
                His analytical approach ensures that the team&#39; s processes are efficient, effective, and scalable.</p>
            </div>
          </div>
          <div className="team-member">
            <h3>Brandon Phelps</h3>
            <p className="title">Malicious Software Developer</p>
            <div className="img-desc">
              <img src={brandon} alt="Team Member" />
              <p className="desc">Brandon specializes in understanding and simulating cybersecurity threats.
                His work helps the team identify vulnerabilities and strengthen system defenses against potential attacks.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="about-us-footer">
        <p>Contact us at <a href="mailto:info@peerassessment.com">info@peerassessment.com</a></p>
      </footer>
    </div>
  );
};
