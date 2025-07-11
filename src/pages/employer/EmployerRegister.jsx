import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { Button, TextField, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";

const StyledBox = styled(Box)(({ theme }) => ({
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing(5),
    padding: theme.spacing(4),
    background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
    fontFamily: "'Roboto', sans-serif",
    transition: "transform 0.3s ease",
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

const StyledLogoutButton = styled(Button)(({ theme }) => ({
    borderColor: "#d32f2f",
    color: "#d32f2f",
    textTransform: "none",
    fontWeight: 600,
    fontFamily: "'Roboto', sans-serif",
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(1.5, 3),
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
        borderColor: "#b71c1c",
        color: "#b71c1c",
        transform: "scale(1.05)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    },
}));

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
                userId: user.id,
            });

            const employer = res.data;

            localStorage.setItem("employerId", employer.id);

            Swal.fire("Success", "Employer profile created", "success").then(() =>
                navigate("/employer/dashboard")
            );
        } catch (error) {
            Swal.fire("Error", error.response?.data || "Failed to create profile", "error");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <StyledBox>
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: "bold", color: "#1565c0" }}
                className="text-center"
            >
                Register Employer Profile
            </Typography>
            <form onSubmit={handleRegister}>
                <StyledTextField
                    label="Name"
                    name="name"
                    fullWidth
                    margin="normal"
                    required
                    value={form.name}
                    onChange={handleChange}
                />
                <StyledTextField
                    label="Address"
                    name="address"
                    fullWidth
                    margin="normal"
                    required
                    value={form.address}
                    onChange={handleChange}
                />
                <StyledTextField
                    label="Contact Number"
                    name="contactNumber"
                    fullWidth
                    margin="normal"
                    required
                    value={form.contactNumber}
                    onChange={handleChange}
                />
                <StyledTextField
                    label="Company Name"
                    name="companyName"
                    fullWidth
                    margin="normal"
                    required
                    value={form.companyName}
                    onChange={handleChange}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                    <StyledButton variant="contained" type="submit">
                        Submit Profile
                    </StyledButton>
                    <StyledLogoutButton variant="outlined" onClick={handleLogout}>
                        Logout
                    </StyledLogoutButton>
                </Box>
            </form>
        </StyledBox>
    );
};

export default EmployerRegister;