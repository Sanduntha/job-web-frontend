import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#f0f4f8",
  minHeight: "100vh",
  fontFamily: "'Roboto', sans-serif",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
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

const StyledSecondaryButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #ab47bc, #ce93d8)",
  color: "#fff",
  textTransform: "none",
  fontWeight: 600,
  fontFamily: "'Roboto', sans-serif",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1.5, 3),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(90deg, #8e24aa, #b388ff)",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius * 2,
    background: "linear-gradient(145deg, #ffffff, #e3f2fd)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
    border: "1px solid #e3f2fd",
    transition: "all 0.3s ease",
    "&:hover": {
      borderColor: "#90caf9",
    },
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #e8f0fe, #ffffff)",
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1.5),
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(1),
  "&:last-child": {
    paddingBottom: theme.spacing(1),
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  color: "#1565c0",
  fontWeight: 500,
  fontSize: "0.9rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textAlign: "center",
  padding: theme.spacing(0.5),
  borderRight: `1px solid ${theme.palette.grey[200]}`,
  "&:last-child": {
    borderRight: "none",
  },
}));

const StyledHeaderTypography = styled(Typography)(({ theme }) => ({
  fontFamily: "'Roboto', sans-serif",
  color: "#555",
  fontWeight: "bold",
  fontSize: "0.9rem",
  textAlign: "center",
  padding: theme.spacing(0.5),
  borderRight: `1px solid ${theme.palette.grey[200]}`,
  "&:last-child": {
    borderRight: "none",
  },
}));

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    duration: "",
    description: "",
    fee: "",
  });
  const [trainerId, setTrainerId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Enrollment dialog states
  const [enrollmentOpen, setEnrollmentOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [enrollments, setEnrollments] = useState([]);

  // Edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    title: "",
    duration: "",
    description: "",
    fee: "",
  });

  useEffect(() => {
    const loadTrainerProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/trainers/user/${user.id}`);
        localStorage.setItem("trainerId", res.data.id);
        setTrainerId(res.data.id);
      } catch (err) {
        Swal.fire("Error", "Trainer profile not found. Please register first.", "error");
      }
    };

    const fetchCoursesWithEarnings = async (trainerId) => {
      try {
        const res = await axios.get(`http://localhost:8080/api/courses/trainer/${trainerId}/earnings`);
        setCourses(res.data);
      } catch (err) {
        Swal.fire("Error", "Failed to load courses or earnings", "error");
      }
    };

    if (user?.id) {
      loadTrainerProfile().then(() => {
        const id = localStorage.getItem("trainerId");
        if (id) fetchCoursesWithEarnings(id);
      });
    }
  }, [user?.id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!trainerId) {
      Swal.fire("Error", "Trainer ID not found. Please refresh or re-login.", "error");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/courses", {
        trainerId,
        title: form.title,
        duration: form.duration,
        description: form.description,
        fee: parseFloat(form.fee),
      });

      Swal.fire("Success", "Course added!", "success");
      setForm({ title: "", duration: "", description: "", fee: "" });
      setOpenDialog(false);

      const res = await axios.get(`http://localhost:8080/api/courses/trainer/${trainerId}/earnings`);
      setCourses(res.data);
    } catch (err) {
      Swal.fire("Error", err.response?.data || "Failed to add course", "error");
      console.error(err.response?.data || err.message);
    }
  };

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm({ title: "", duration: "", description: "", fee: "" });
  };

  // Enrollment dialog handlers
  const handleViewEnrollments = async (courseId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/enrollments/course/${courseId}`); 
      setEnrollments(res.data);
      setSelectedCourseId(courseId);
      setEnrollmentOpen(true);
    } catch (err) {
      Swal.fire("Error", "Failed to load enrollments", "error");
    }
  };

  const handleCloseEnrollments = () => {
    setEnrollmentOpen(false);
    setEnrollments([]);
    setSelectedCourseId(null);
  };

  // Edit dialog handlers
  const handleOpenEditDialog = (course) => {
    setEditForm({
      id: course.id,
      title: course.title,
      duration: course.duration,
      description: course.description,
      fee: course.fee,
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditForm({ id: null, title: "", duration: "", description: "", fee: "" });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/courses/${editForm.id}`, {
        title: editForm.title,
        duration: editForm.duration,
        description: editForm.description,
        fee: parseFloat(editForm.fee),
      });

      Swal.fire("Success", "Course updated!", "success");
      setEditDialogOpen(false);

      if (trainerId) {
        const res = await axios.get(`http://localhost:8080/api/courses/trainer/${trainerId}/earnings`);
        setCourses(res.data);
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data || "Failed to update course", "error");
    }
  };

  return (
    <StyledContainer maxWidth="lg">
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: "bold", color: "#1565c0" }}
        className="text-center"
      >
        Trainer Dashboard
      </Typography>

      {/* Add Course Button */}
      <Box mb={3} display="flex" justifyContent="end">
        <StyledButton onClick={handleOpenDialog}>Add New Course</StyledButton>
      </Box>

      {/* Add Course Dialog */}
      <StyledDialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Roboto', sans-serif", color: "#1565c0" }}>
          Add a New Course
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddCourse}>
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
              multiline
              rows={4}
              value={form.description}
              onChange={handleChange}
              margin="normal"
              required
            />
            <StyledTextField
              fullWidth
              label="Course Fee"
              name="fee"
              type="number"
              value={form.fee}
              onChange={handleChange}
              margin="normal"
              required
            />
            <DialogActions>
              <StyledSecondaryButton onClick={handleCloseDialog}>Cancel</StyledSecondaryButton>
              <StyledButton type="submit">Add Course</StyledButton>
            </DialogActions>
          </form>
        </DialogContent>
      </StyledDialog>

      {/* Edit Course Dialog */}
      <StyledDialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Roboto', sans-serif", color: "#1565c0" }}>
          Edit Course
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleUpdateCourse}>
            <StyledTextField
              fullWidth
              label="Course Title"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              margin="normal"
              required
            />
            <StyledTextField
              fullWidth
              label="Duration"
              name="duration"
              value={editForm.duration}
              onChange={handleEditChange}
              margin="normal"
              required
            />
            <StyledTextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={editForm.description}
              onChange={handleEditChange}
              margin="normal"
              required
            />
            <StyledTextField
              fullWidth
              label="Course Fee"
              name="fee"
              type="number"
              value={editForm.fee}
              onChange={handleEditChange}
              margin="normal"
              required
            />
            <DialogActions>
              <StyledSecondaryButton onClick={handleCloseEditDialog}>Cancel</StyledSecondaryButton>
              <StyledButton type="submit">Update Course</StyledButton>
            </DialogActions>
          </form>
        </DialogContent>
      </StyledDialog>

      {/* Courses and Earnings Section */}
      <StyledPaper>
        <Typography variant="h5" sx={{ fontFamily: "'Roboto', sans-serif", color: "#1565c0", mb: 2 }}>
          Your Courses and Earnings
        </Typography>
        {courses.length === 0 ? (
          <Typography sx={{ fontFamily: "'Roboto', sans-serif", color: "#555" }}>
            No courses available.
          </Typography>
        ) : (
          <Box>
            <Grid
              container
              spacing={1}
              sx={{ mb: 2, backgroundColor: "#f5f5f5", p: 1, borderRadius: 1 }}
            >
              <Grid item xs={2} sx={{ minWidth: "150px", maxWidth: "150px" }}>
                <StyledHeaderTypography>Course</StyledHeaderTypography>
              </Grid>
              <Grid item xs={2} sx={{ minWidth: "100px", maxWidth: "100px" }}>
                <StyledHeaderTypography>Duration</StyledHeaderTypography>
              </Grid>
              <Grid item xs={3} sx={{ minWidth: "300px", maxWidth: "200px" }}>
                <StyledHeaderTypography>Description</StyledHeaderTypography>
              </Grid>
              <Grid item xs={2} sx={{ minWidth: "100px", maxWidth: "100px" }}>
                <StyledHeaderTypography>Fee</StyledHeaderTypography>
              </Grid>
              <Grid item xs={1} sx={{ minWidth: "100px", maxWidth: "100px" }}>
                <StyledHeaderTypography>Enrollments</StyledHeaderTypography>
              </Grid>
              <Grid item xs={1.5} sx={{ minWidth: "100px", maxWidth: "100px" }}>
                <StyledHeaderTypography>Revenue</StyledHeaderTypography>
              </Grid>
              <Grid item xs={2} sx={{ minWidth: "150px", maxWidth: "150px", display: "flex", gap: 1 }}>
                <StyledHeaderTypography>Actions</StyledHeaderTypography>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 2 }} />
            {courses.map((course) => (
              <StyledCard key={course.id}>
                <StyledCardContent>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2} sx={{ minWidth: "150px", maxWidth: "150px" }}>
                      <StyledTypography>{course.title || "N/A"}</StyledTypography>
                    </Grid>
                    <Grid item xs={2} sx={{ minWidth: "100px", maxWidth: "100px" }}>
                      <StyledTypography>{course.duration || "N/A"}</StyledTypography>
                    </Grid>
                    <Grid item xs={3} sx={{ minWidth: "300px", maxWidth: "200px" }}>
                      <StyledTypography>{course.description || "No description available"}</StyledTypography>
                    </Grid>
                    <Grid item xs={2} sx={{ minWidth: "100px", maxWidth: "100px" }}>
                      <StyledTypography>LKR {course.fee || "N/A"}</StyledTypography>
                    </Grid>
                    <Grid item xs={1} sx={{ minWidth: "100px", maxWidth: "100px" }}>
                      <StyledTypography>{course.enrollmentCount || 0}</StyledTypography>
                    </Grid>
                    <Grid item xs={1.5} sx={{ minWidth: "100px", maxWidth: "100px" }}>
                      <StyledTypography>LKR {course.totalAmount || 0}</StyledTypography>
                    </Grid>
                    <Grid item xs={2} sx={{ minWidth: "150px", maxWidth: "150px", display: "flex", gap: 1 }}>
                      <StyledButton size="small" onClick={() => handleViewEnrollments(course.id)}>
                        View
                      </StyledButton>
                      <StyledSecondaryButton size="small" onClick={() => handleOpenEditDialog(course)}>
                        Edit
                      </StyledSecondaryButton>
                    </Grid>
                  </Grid>
                </StyledCardContent>
              </StyledCard>
            ))}
          </Box>
        )}
      </StyledPaper>

      {/* Enrollment Dialog */}
      <StyledDialog open={enrollmentOpen} onClose={handleCloseEnrollments} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Roboto', sans-serif", color: "#1565c0" }}>
          Enrolled Job Seekers
        </DialogTitle>
        <DialogContent dividers>
          {enrollments.length === 0 ? (
            <Typography>No enrollments found.</Typography>
          ) : (
            <List>
              {enrollments.map((enrollment) => (
                <ListItem key={`${enrollment.courseId}-${enrollment.jobSeekerId}`} divider>
                  <ListItemText
                    primary={enrollment.jobSeeker?.name || "Unnamed"}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="textPrimary">
                          Contact: {enrollment.jobSeeker?.contactNumber || "N/A"}
                        </Typography>
                        <br />
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <StyledSecondaryButton onClick={handleCloseEnrollments}>Close</StyledSecondaryButton>
        </DialogActions>
      </StyledDialog>
    </StyledContainer>
  );
};

export default TrainerDashboard;
