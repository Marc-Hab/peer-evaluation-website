import { storeAPI } from "../functions/apiinterface.jsx";
import "../css/main-signup.css";
import { useNavigate } from "react-router-dom";

export default function MainSignup() {
  const navigate = useNavigate();

  const loginNav = () => {
    navigate("../login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd);

    const confirmPasswordInput = e.target["confirm-password"];
    const emailInput = e.target["email"];

    // Clear email validity on input change
    confirmPasswordInput.oninput = () =>
      confirmPasswordInput.setCustomValidity("");
    emailInput.oninput = () => emailInput.setCustomValidity("");

    if (payload.password !== payload["confirm-password"]) {
      confirmPasswordInput.setCustomValidity("Passwords do not match!");
      confirmPasswordInput.reportValidity("");
      return;
    }

    const finalPayload = {
      email: payload.email,
      password: payload.password,
      type: payload.type,
      name: `${payload["first-name"]} ${payload["last-name"]}`,
    };

    try {
      // Call the API and await the response
      const response = await storeAPI("/signup", finalPayload);

      if (response.data.Response === "VALID") {
        navigate("/login");
      } else {
        // Set custom validation message if email already exists
        emailInput.setCustomValidity("Email already exists!");
        emailInput.reportValidity();
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <main className="main-signup">
        <h2>Account details</h2>
        <form onSubmit={handleSubmit}>
          <div className="fields">
            <label>User Type</label>
            <div className="radio-button">
              <label>
                <input type="radio" name="type" value="student" required />
                Student
              </label>

              <label>
                <input type="radio" name="type" value="teacher" required />
                Teacher
              </label>
            </div>

            <div className="name">
              <label>First Name</label>
              <label>Last Name</label>
              <input
                type="text"
                id="first-name"
                placeholder="Jane"
                name="first-name"
                minLength="2"
                maxLength="30"
                pattern="^[a-zA-Z]+$"
                required
              />
              <input
                type="text"
                id="last-name"
                placeholder="Doe"
                name="last-name"
                minLength="2"
                maxLength="50"
                pattern="^[a-zA-Z]+$"
                required
              />
            </div>
            <label>Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="example@gmail.com"
              name="email"
              maxLength="254"
              required
            />

            <label>Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              minLength="8"
              maxLength="32"
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
              name="confirm-password"
              minLength="8"
              maxLength="32"
              required
              onInput={(e) => e.target.setCustomValidity("")}
            />
          </div>

          <input type="submit" value="Create Account" />

          <span
            onClick={loginNav}
            className="already-account-option"
            title="Click here to log in"
          >
            Already have an account?
          </span>
        </form>
      </main>
    </>
  );
}
