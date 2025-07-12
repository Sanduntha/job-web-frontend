import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#f0f4f8",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Roboto', sans-serif",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(5),
  background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    fontFamily: "'Roboto', sans-serif",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1976d2",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1565c0",
      borderWidth: "2px",
    },
  },
  "& .MuiInputLabel-root": {
    fontFamily: "'Roboto', sans-serif",
    color: "#555",
    "&.Mui-focused": {
      color: "#1565c0",
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #1565c0, #64b5f6)",
  color: "#fff",
  textTransform: "none",
  fontWeight: 600,
  fontFamily: "'Roboto', sans-serif",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 3),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(90deg, #104c91, #4a8fe7)",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
}));

const JobSeekerRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    jobCategory: "",
    skill: "",
    contactNumber: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      Swal.fire("Error", "You must login first", "error");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8081/api/jobseekers", {
        ...form,
        userId: user.id,
      });

      const jobSeeker = res.data;
      localStorage.setItem("jobSeekerId", jobSeeker.id);

      Swal.fire("Success", "Profile created successfully!", "success").then(() =>
        navigate("/jobseeker/dashboard")
      );
    } catch (err) {
      Swal.fire("Error", err?.response?.data || "Profile creation failed", "error");
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: "bold", color: "#1565c0" }}
          className="text-center"
        >
          Job Seeker Profile Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <StyledTextField
            fullWidth
            label="Job Category"
            name="jobCategory"
            value={form.jobCategory}
            onChange={handleChange}
            margin="normal"
            required
          />
          <StyledTextField
            fullWidth
            label="Skill"
            name="skill"
            value={form.skill}
            onChange={handleChange}
            margin="normal"
            required
          />
          <StyledTextField
            fullWidth
            label="Contact Number"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box mt={2}>
            <StyledButton variant="contained" type="submit" fullWidth>
              Submit Profile
            </StyledButton>
          </Box>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default JobSeekerRegister;