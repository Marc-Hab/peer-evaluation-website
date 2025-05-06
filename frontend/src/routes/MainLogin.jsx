import "../css/main-login.css";
import "../css/general.css";
import { storeAPI } from "../functions/apiinterface.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../config/useAuth.jsx";

export default function MainLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const signupNav = () => {
    navigate("../signup");
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);

    const emailInput = e.target["email"];
    const passInput = e.target["password"];
    emailInput.oninput = () => emailInput.setCustomValidity("");
    passInput.oninput = () => emailInput.setCustomValidity("");

    storeAPI("/login", payload).then((data) => {
      if (data.data.Response == "VALID") {
        login(data.data.token, data.data.type);

        data.data.type == "student"
          ? navigate("/student/home")
          : navigate("/teacher/home");
      } else {
        emailInput.setCustomValidity("Email/Password combination does not exist");
        emailInput.reportValidity();
      }
    });
  };

  return (
    <>
      <main className="main-login">
        <h2>Login Credentials</h2>

        <form onSubmit={submitHandler} method="post">
          <div className="fields">
          <label>User Type</label>
            <div className="usertype">
              <label>
                <input type="radio" name="type" value="student" required />
                Student
              </label>

              <label>
                <input type="radio" name="type" value="teacher" required />
                Teacher
              </label>
            </div>

            <label>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              maxLength="254"
              required
            />

            <label>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              maxLength="32"
              required
            />
          </div>

          <span onClick={signupNav} title="Click here to sign up">
            Don&#39;t have an account?
          </span>

          <input type="submit" value="Log In" />
        </form>
      </main>
    </>
  );
}
