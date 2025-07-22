import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Fade, 
  Container 
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  margin: "auto",
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.shape.borderRadius * 3,
  background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  fontWeight: "bold",
  textTransform: "none",
  borderRadius: theme.shape.borderRadius * 2,
  background: "linear-gradient(90deg, #1976d2, #42a5f5)",
  color: "#fff",
  "&:hover": {
    background: "linear-gradient(90deg, #1565c0, #2196f3)",
    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  display: "block",
  textAlign: "center",
  marginTop: theme.spacing(2),
  color: theme.palette.primary.main,
  textDecoration: "none",
  fontWeight: 500,
  "&:hover": {
    textDecoration: "underline",
    color: theme.palette.primary.dark,
  },
}));

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/users/login", { email, password });
      
      const userData = res.data; // expects full user object including id and token
      login(userData);

      if (userData.role === "admin") navigate("/admin/dashboard");
      else if (userData.role === "jobseeker") {
        try {
          const res = await axios.get(`http://localhost:8080/api/jobseekers/user/${userData.id}`);
          const jobSeeker = res.data;

          if (jobSeeker?.id) {
            localStorage.setItem("jobSeekerId", jobSeeker.id);
            navigate("/jobseeker/dashboard");
          } else {
            navigate("/jobseeker/register");
          }
        } catch (err) {
          navigate("/jobseeker/register");
        }
      }
      else if (userData.role === "employer") navigate("/employer/dashboard");
      else if (userData.role === "trainer") navigate("/trainer/dashboard");
      else navigate("/login");
    } catch (err) {
      const errorMessage = err.response?.data || "Login failed";
      setError(errorMessage);
      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <StyledCard>
            <CardContent>
              <Typography 
                variant="h3" 
                align="center" 
                gutterBottom 
                className="text-gray-800 font-extrabold tracking-tight"
                sx={{ fontSize: { xs: "2rem", sm: "2.5rem" } }}
              >
                Welcome Back
              </Typography>
              <Typography 
                variant="body1" 
                align="center" 
                color="textSecondary" 
                className="mb-6"
              >
                Sign in to continue your journey
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                  className="mb-4"
                  InputProps={{
                    sx: {
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  margin="normal"
                  variant="outlined"
                  className="mb-4"
                  InputProps={{
                    sx: {
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Sign In
                </StyledButton>
              </form>
              <StyledLink to="/register">
                Don't have an account? Register here
              </StyledLink>
            </CardContent>
          </StyledCard>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;