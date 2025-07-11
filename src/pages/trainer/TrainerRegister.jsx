// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Stack,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import axiosInstance from "../../api/axiosInstance";
// import Swal from "sweetalert2";

// const TrainerRegister = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     courseCategory: "",
//     contactNumber: "",
//     experience: "",
//     qualification: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user?.id) {
//       Swal.fire("Error", "You must be logged in", "error");
//       return;
//     }

//     try {
//       await axiosInstance.post("/trainers", {
//         userId: user.id,
//         ...form,
//       });

//       Swal.fire("Success", "Trainer profile created", "success").then(() =>
//         navigate("/trainer/dashboard")
//       );
//     } catch (err) {
//       Swal.fire(
//         "Error",
//         err.response?.data || "Failed to create profile",
//         "error"
//       );
//     }
//   };

//   return (
//     <Box
//       sx={{
//         maxWidth: 600,
//         mx: "auto",
//         mt: 6,
//         p: 3,
//       }}
//     >
//       <Paper sx={{ p: 4 }}>
//         <Typography variant="h5" mb={3}>
//           Trainer Profile Registration
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <Stack spacing={2}>
//             <TextField
//               label="Name"
//               name="name"
//               value={form.name}
//               onChange={handleChange}
//               required
//               fullWidth
//             />
//             <TextField
//               label="Course Category"
//               name="courseCategory"
//               value={form.courseCategory}
//               onChange={handleChange}
//               required
//               fullWidth
//             />
//             <TextField
//               label="Contact Number"
//               name="contactNumber"
//               value={form.contactNumber}
//               onChange={handleChange}
//               required
//               fullWidth
//             />
//             <TextField
//               label="Experience"
//               name="experience"
//               value={form.experience}
//               onChange={handleChange}
//               required
//               fullWidth
//             />
//             <TextField
//               label="Qualification"
//               name="qualification"
//               value={form.qualification}
//               onChange={handleChange}
//               required
//               fullWidth
//             />

//             <Button variant="contained" type="submit" fullWidth>
//               Submit Profile
//             </Button>
//           </Stack>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default TrainerRegister;


import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

const TrainerRegister = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    courseCategory: "",
    contactNumber: "",
    experience: "",
    qualification: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/trainers", {
        ...form,
        userId: user.id,
      });

      localStorage.setItem("trainerId", res.data.id); // ✅ Save trainerId
      Swal.fire("Success", "Trainer profile created!", "success").then(() => {
        navigate("/trainer/dashboard");
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data || "Failed to create trainer profile",
        "error"
      );
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Card sx={{ width: 500, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Trainer Profile Registration
          </Typography>
          <form onSubmit={handleSubmit}>
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
              label="Course Category"
              name="courseCategory"
              fullWidth
              margin="normal"
              required
              value={form.courseCategory}
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
              label="Experience"
              name="experience"
              fullWidth
              margin="normal"
              required
              value={form.experience}
              onChange={handleChange}
            />
            <TextField
              label="Qualification"
              name="qualification"
              fullWidth
              margin="normal"
              required
              value={form.qualification}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TrainerRegister;
