import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
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

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "jobseeker",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/users/register", form);
      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "User registered! Please login.",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/login");
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: "Something went wrong. Please try again.",
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
                Create Account
              </Typography>
              <Typography 
                variant="body1" 
                align="center" 
                color="textSecondary" 
                className="mb-6"
              >
                Join us to start your journey
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter your email"
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter your password"
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
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    label="Role"
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "#fff",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    }}
                  >
                    <MenuItem value="jobseeker">Job Seeker</MenuItem>
                    <MenuItem value="employer">Employer</MenuItem>
                    <MenuItem value="trainer">Trainer</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
                <StyledButton
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  Register
                </StyledButton>
              </form>
              <StyledLink to="/login">
                Already have an account? Sign in here
              </StyledLink>
            </CardContent>
          </StyledCard>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;