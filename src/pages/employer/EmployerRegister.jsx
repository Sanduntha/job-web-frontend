import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { Button, TextField, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";

const EmployerRegister = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    contactNumber: "",
    companyName: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
      Swal.fire("Error", "You must login first", "error");
      return;
    }

   try {
  const res = await axiosInstance.post("/employers", {
    ...form,
    userId: user.id, // ✅ Send userId to backend
  });

  const employer = res.data; // ✅ Capture response

  // ✅ Save employerId in localStorage
  localStorage.setItem("employerId", employer.id);

  Swal.fire("Success", "Employer profile created", "success").then(() =>
    navigate("/employer/dashboard")
  );
} catch (error) {
  Swal.fire("Error", error.response?.data || "Failed to create profile", "error");
}
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, p: 3, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        Register Employer Profile
      </Typography>
      <form onSubmit={handleRegister}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          required
          value={form.name}
          onChange={handleChange}
        />
        <TextField
          label="Address"
          name="address"
          fullWidth
          margin="normal"
          required
          value={form.address}
          onChange={handleChange}
        />
        <TextField
          label="Contact Number"
          name="contactNumber"
          fullWidth
          margin="normal"
          required
          value={form.contactNumber}
          onChange={handleChange}
        />
        <TextField
          label="Company Name"
          name="companyName"
          fullWidth
          margin="normal"
          required
          value={form.companyName}
          onChange={handleChange}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button variant="contained" color="primary" type="submit">
            Submit Profile
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EmployerRegister;
