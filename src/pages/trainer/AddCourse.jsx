import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
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

const AddCourse = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    duration: "",
    description: "",
    fee: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      Swal.fire("Error", "You must be logged in as Trainer", "error");
      return;
    }

    try {
      await axiosInstance.post("/courses", {
        title: form.title,
        duration: form.duration,
        description: form.description,
        fee: Number(form.fee),
        trainerId: user.id,
      });

      Swal.fire("Success", "Course added successfully", "success");
      setForm({ title: "", duration: "", description: "", fee: "" });
    } catch (error) {
      Swal.fire("Error", error.response?.data || "Failed to add course", "error");
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
          Add New Course
        </Typography>
        <form onSubmit={handleSubmit}>
          <StyledTextField
            fullWidth
            label="Course Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <StyledTextField
            fullWidth
            label="Duration"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            margin="normal"
            required
          />
          <StyledTextField
            fullWidth
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            margin="normal"
            required
          />
          <StyledTextField
            fullWidth
            label="Fee"
            name="fee"
            type="number"
            value={form.fee}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Box mt={2}>
            <StyledButton variant="contained" type="submit" fullWidth>
              Add Course
            </StyledButton>
          </Box>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default AddCourse;