import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:8081/api/users/login", { email, password });
    
    const userData = res.data; // expects full user object including id and token
    login(userData);

    // Navigate based on role
    if (userData.role === "admin") navigate("/admin/dashboard");
else if (userData.role === "jobseeker") {
  try {
    const res = await axios.get(`http://localhost:8081/api/jobseekers/user/${userData.id}`);
    const jobSeeker = res.data;

    // ✅ Save jobSeekerId to localStorage if found
    if (jobSeeker?.id) {
      localStorage.setItem("jobSeekerId", jobSeeker.id);
      navigate("/jobseeker/dashboard");
    } else {
      navigate("/jobseeker/register");
    }
  } catch (err) {
    // 🤖 If job seeker not found, navigate to register
    navigate("/jobseeker/register");
  }
}
    else if (userData.role === "employer") navigate("/employer/dashboard");
    else if (userData.role === "trainer") navigate("/trainer/dashboard");
    else navigate("/login");
  } catch (err) {
    setError(err.response?.data || "Login failed");
  }
};


  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label><br />
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label><br />
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" style={{ marginTop: "1rem" }}>Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
