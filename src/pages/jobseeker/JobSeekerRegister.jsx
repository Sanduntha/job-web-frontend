// src/pages/jobseeker/JobSeekerRegister.jsx
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

    // ✅ Save ID and go to dashboard
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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Job Seeker Profile Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Job Category"
            name="jobCategory"
            value={form.jobCategory}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Skill"
            name="skill"
            value={form.skill}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Contact Number"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit Profile
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default JobSeekerRegister;
