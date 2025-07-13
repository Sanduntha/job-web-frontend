import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import BookIcon from "@mui/icons-material/Book";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MenuIcon from "@mui/icons-material/Menu";
import Swal from "sweetalert2";

const StyledSidebar = styled(Box)(({ theme }) => ({
  width: 250,
  background: "linear-gradient(180deg, #1565c0, #64b5f6)",
  color: "#fff",
  height: "100vh",
  position: "fixed",
  top: 0,
  left: 0,
  paddingTop: theme.spacing(3),
  boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)",
  fontFamily: "'Roboto', sans-serif",
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const StyledContent = styled(Box)(({ theme }) => ({
  marginLeft: 250,
  padding: theme.spacing(4),
  backgroundColor: "#f0f4f8",
  minHeight: "100vh",
  fontFamily: "'Roboto', sans-serif",
  [theme.breakpoints.down("md")]: {
    marginLeft: 0,
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  borderRadius: theme.shape.borderRadius * 2,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.grey[50],
  },
  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.1)",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: "#fff",
  fontFamily: "'Roboto', sans-serif",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    transform: "scale(1.05) translateX(5px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  "&.Mui-selected": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: "scale(1.02)",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.4)",
      transform: "scale(1.05) translateX(5px)",
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(211, 47, 47, 0.1)",
    transform: "scale(1.1)",
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

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [employers, setEmployers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [companyFilter, setCompanyFilter] = useState("");
  const [trainerFilter, setTrainerFilter] = useState("");
  const [jobSeekerFilter, setJobSeekerFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [enrollmentFilter, setEnrollmentFilter] = useState("");
  const [applicationFilter, setApplicationFilter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState({ type: null, isEdit: false, data: {} });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const formatErrorMessage = (error) => {
    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        return error.response.data;
      } else if (error.response.data.message) {
        return error.response.data.message;
      } else {
        return JSON.stringify(error.response.data);
      }
    }
    return error.message || "An unexpected error occurred";
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    axios.get("http://localhost:8080/api/employers").then((res) => setEmployers(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
    axios.get("http://localhost:8080/api/trainers").then((res) => setTrainers(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
    axios.get("http://localhost:8080/api/jobseekers").then((res) => setJobSeekers(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
    axios.get("http://localhost:8080/api/courses").then((res) => setCourses(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
    axios.get("http://localhost:8080/api/enrollments").then((res) => setEnrollments(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
    axios.get("http://localhost:8080/api/jobs").then((res) => setJobs(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
    axios.get("http://localhost:8080/api/applications").then((res) => setApplications(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
  };

  const handleOpenDialog = (type, isEdit = false, data = {}) => {
    setOpenDialog({ type, isEdit, data });
  };

  const handleCloseDialog = () => {
    setOpenDialog({ type: null, isEdit: false, data: {} });
  };

  const handleSubmit = (e, type, isEdit) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const submitData = () => {
      const payload = { ...data };
      if (type === "enrollment") {
        payload.jobSeekerId = parseInt(data.jobSeekerId);
        payload.courseId = parseInt(data.courseId);
        payload.amount = parseFloat(data.amount);
        payload.date = data.date;
      } else if (type === "job") {
        payload.employerId = parseInt(data.employerId);
        payload.salary = parseFloat(data.salary);
      } else if (type === "course") {
        payload.fee = parseFloat(data.fee);
      } else if (type === "application") {
        payload.jobId = parseInt(data.jobId);
        payload.jobSeekerId = parseInt(data.jobSeekerId);
        payload.applicationDate = data.applicationDate;
      } else {
        if (data.userId) payload.userId = parseInt(data.userId);
      }

      const url = isEdit ? 
        (type === "employer" ? `/api/employers/${data.id}` :
         type === "trainer" ? `/api/trainers/${data.id}` :
         type === "jobSeeker" ? `/api/jobseekers/${data.id}` :
         type === "job" ? `/api/jobs/update/${data.id}` :
         type === "course" ? `/api/courses/${data.id}` :
         type === "enrollment" ? `/api/enrollments?jobSeekerId=${data.jobSeekerId}&courseId=${data.courseId}` :
         `/api/applications/${data.id}`) :
        (type === "employer" ? "/api/employers" :
         type === "trainer" ? "/api/trainers" :
         type === "jobSeeker" ? "/api/jobseekers" :
         type === "job" ? "/api/jobs/add" :
         type === "course" ? "/api/courses" :
         type === "enrollment" ? "/api/enrollments" :
         "/api/applications");

      const method = isEdit ? "put" : "post";

      axios[method](`http://localhost:8080${url}`, payload)
        .then((res) => {
          Swal.fire("Success", isEdit ? `${type} updated` : `${type} added`, "success");
          fetchAllData();
          handleCloseDialog();
        })
        .catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
    };

    Swal.fire({
      title: `Are you sure you want to ${isEdit ? "update" : "add"} this ${type}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) submitData();
    });
  };

  const deleteEmployer = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this employer and their jobs?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/employers/employers/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Employer and their jobs have been deleted.", "success");
            setEmployers((prev) => prev.filter((e) => e.id !== id));
            fetchJobs();
            fetchApplications();
          })
          .catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
      }
    });
  };

  const deleteTrainer = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this trainer and their courses?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/trainers/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Trainer and their courses have been deleted.", "success");
            setTrainers((prev) => prev.filter((t) => t.id !== id));
            fetchCourses();
            fetchEnrollments();
          })
          .catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
      }
    });
  };

  const deleteJobSeeker = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this job seeker, their enrollments, and applications?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/jobseekers/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Job seeker, their enrollments, and applications have been deleted.", "success");
            setJobSeekers((prev) => prev.filter((j) => j.id !== id));
            fetchEnrollments();
            fetchApplications();
          })
          .catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
      }
    });
  };

  const deleteJob = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this job?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/jobs/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Job and its applications have been deleted.", "success");
            setJobs((prev) => prev.filter((j) => j.id !== id));
            fetchApplications();
          })
          .catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
      }
    });
  };

  const deleteCourse = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this course?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/courses/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Course and its enrollments have been deleted.", "success");
            setCourses((prev) => prev.filter((c) => c.id !== id));
            fetchEnrollments();
          })
          .catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
      }
    });
  };

  const deleteEnrollment = (jobSeekerId, courseId) => {
    Swal.fire({
      title: "Are you sure you want to delete this enrollment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/enrollments`, { params: { jobSeekerId, courseId } })
          .then(() => {
            Swal.fire("Deleted!", "Enrollment has been deleted.", "success");
            setEnrollments((prev) => prev.filter((e) => e.jobSeekerId !== jobSeekerId || e.courseId !== courseId));
          })
          .catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
      }
    });
  };

  const deleteApplication = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete this application?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/api/applications/${id}`)
          .then(() => {
            Swal.fire("Deleted!", "Application has been deleted.", "success");
            setApplications((prev) => prev.filter((a) => a.id !== id));
          })
          .catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
      }
    });
  };

  const fetchEmployers = () => axios.get("http://localhost:8080/api/employers").then((res) => setEmployers(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
  const fetchTrainers = () => axios.get("http://localhost:8080/api/trainers").then((res) => setTrainers(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
  const fetchJobSeekers = () => axios.get("http://localhost:8080/api/jobseekers").then((res) => setJobSeekers(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
  const fetchCourses = () => axios.get("http://localhost:8080/api/courses").then((res) => setCourses(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
  const fetchEnrollments = () => axios.get("http://localhost:8080/api/enrollments").then((res) => setEnrollments(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
  const fetchJobs = () => axios.get("http://localhost:8080/api/jobs").then((res) => setJobs(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));
  const fetchApplications = () => axios.get("http://localhost:8080/api/applications").then((res) => setApplications(res.data)).catch((err) => Swal.fire("Error", formatErrorMessage(err), "error"));

  const handleTabChange = (newVal) => {
    setTab(newVal);
    if (isMobile) setDrawerOpen(false);
  };

  const analytics = [
    { label: "Employers", count: employers.length, icon: <BusinessIcon fontSize="large" sx={{ color: "#1976d2" }} /> },
    { label: "Trainers", count: trainers.length, icon: <SchoolIcon fontSize="large" sx={{ color: "#ab47bc" }} /> },
    { label: "Job Seekers", count: jobSeekers.length, icon: <PeopleIcon fontSize="large" sx={{ color: "#4caf50" }} /> },
    { label: "Jobs", count: jobs.length, icon: <WorkIcon fontSize="large" sx={{ color: "#0288d1" }} /> },
    { label: "Courses", count: courses.length, icon: <BookIcon fontSize="large" sx={{ color: "#f57c00" }} /> },
    { label: "Enrollments", count: enrollments.length, icon: <AssignmentTurnedInIcon fontSize="large" sx={{ color: "#d32f2f" }} /> },
    { label: "Applications", count: applications.length, icon: <AssignmentIcon fontSize="large" sx={{ color: "#388e3c" }} /> },
  ];

  const navItems = [
    { label: "Employers", icon: <BusinessIcon /> },
    { label: "Trainers", icon: <SchoolIcon /> },
    { label: "Job Seekers", icon: <PeopleIcon /> },
    { label: "Jobs", icon: <WorkIcon /> },
    { label: "Courses", icon: <BookIcon /> },
    { label: "Enrollments", icon: <AssignmentTurnedInIcon /> },
    { label: "Applications", icon: <AssignmentIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ width: 250, bgcolor: "linear-gradient(180deg, #1565c0, #64b5f6)" }}>
      <List>
        <StyledListItem>
          <Typography variant="h6" className="font-bold" sx={{ fontFamily: "'Roboto', sans-serif" }}>
            Admin Dashboard
          </Typography>
        </StyledListItem>
        {navItems.map((item, index) => (
          <StyledListItem key={item.label} button selected={tab === index} onClick={() => handleTabChange(index)}>
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} sx={{ "& .MuiListItemText-primary": { fontFamily: "'Roboto', sans-serif" } }} />
          </StyledListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {!isMobile && (
        <StyledSidebar>
          <Typography variant="h5" sx={{ p: 2, fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }} className="text-center">
            Admin Dashboard
          </Typography>
          <List>
            {navItems.map((item, index) => (
              <StyledListItem key={item.label} button selected={tab === index} onClick={() => handleTabChange(index)}>
                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} sx={{ "& .MuiListItemText-primary": { fontFamily: "'Roboto', sans-serif" } }} />
              </StyledListItem>
            ))}
          </List>
        </StyledSidebar>
      )}

      <StyledContent>
        {isMobile && (
          <StyledIconButton onClick={() => setDrawerOpen(true)} sx={{ mb: 2, color: "#1976d2" }}>
            <MenuIcon />
          </StyledIconButton>
        )}
        <Typography variant="h4" className="font-extrabold text-gray-800" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif" }}>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} mb={4}>
          {analytics.map(({ label, count, icon }) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={label}>
              <StyledCard>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ mr: 2 }}>{icon}</Box>
                  <Box>
                    <Typography variant="h6" className="text-gray-700" sx={{ fontFamily: "'Roboto', sans-serif" }}>
                      {label}
                    </Typography>
                    <Typography variant="h4" className="font-bold text-gray-800" sx={{ fontFamily: "'Roboto', sans-serif" }}>
                      {count}
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {tab === 0 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <StyledTextField
                label="Filter by Company"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                sx={{ width: "70%" }}
                variant="outlined"
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("employer")}>
                Add Employer
              </Button>
            </Box>
            <StyledPaper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Company Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Address</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employers
                    .filter((emp) => emp.companyName?.toLowerCase().includes(companyFilter.toLowerCase()))
                    .map((emp) => (
                      <StyledTableRow key={emp.id}>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{emp.companyName}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{emp.contactNumber}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{emp.address}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <StyledIconButton onClick={() => handleOpenDialog("employer", true, emp)}>
                              <EditIcon />
                            </StyledIconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <StyledIconButton color="error" onClick={() => deleteEmployer(emp.id)}>
                              <DeleteIcon />
                            </StyledIconButton>
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </StyledPaper>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <StyledTextField
                label="Filter by Trainer Name"
                value={trainerFilter}
                onChange={(e) => setTrainerFilter(e.target.value)}
                sx={{ width: "70%" }}
                variant="outlined"
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("trainer")}>
                Add Trainer
              </Button>
            </Box>
            <StyledPaper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Qualification</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Experience</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trainers
                    .filter((t) => t.name?.toLowerCase().includes(trainerFilter.toLowerCase()))
                    .map((t) => (
                      <StyledTableRow key={t.id}>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{t.name}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{t.courseCategory}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{t.qualification}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{t.experience}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <StyledIconButton onClick={() => handleOpenDialog("trainer", true, t)}>
                              <EditIcon />
                            </StyledIconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <StyledIconButton color="error" onClick={() => deleteTrainer(t.id)}>
                              <DeleteIcon />
                            </StyledIconButton>
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </StyledPaper>
          </Box>
        )}

        {tab === 2 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <StyledTextField
                label="Filter by Job Seeker Name"
                value={jobSeekerFilter}
                onChange={(e) => setJobSeekerFilter(e.target.value)}
                sx={{ width: "70%" }}
                variant="outlined"
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("jobSeeker")}>
                Add Job Seeker
              </Button>
            </Box>
            <StyledPaper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Job Category</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Skill</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobSeekers
                    .filter((j) => j.name?.toLowerCase().includes(jobSeekerFilter.toLowerCase()))
                    .map((j) => (
                      <StyledTableRow key={j.id}>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{j.name}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{j.jobCategory}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{j.skill}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{j.contactNumber}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <StyledIconButton onClick={() => handleOpenDialog("jobSeeker", true, j)}>
                              <EditIcon />
                            </StyledIconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <StyledIconButton color="error" onClick={() => deleteJobSeeker(j.id)}>
                              <DeleteIcon />
                            </StyledIconButton>
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </StyledPaper>
          </Box>
        )}

        {tab === 3 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <StyledTextField
                label="Filter by Job Title"
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                sx={{ width: "70%" }}
                variant="outlined"
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("job")}>
                Add Job
              </Button>
            </Box>
            <StyledPaper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Salary</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs
                    .filter((j) => j.title?.toLowerCase().includes(jobFilter.toLowerCase()))
                    .map((j) => (
                      <StyledTableRow key={j.id}>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{j.title}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{j.description}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{j.location}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{j.salary}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <StyledIconButton onClick={() => handleOpenDialog("job", true, j)}>
                              <EditIcon />
                            </StyledIconButton>
                          </Tooltip>
                          <TableCell align="center">
                            <Tooltip title="Delete">
                              <StyledIconButton color="error" onClick={() => deleteJob(j.id)}>
                                <DeleteIcon />
                              </StyledIconButton>
                            </Tooltip>
                          </TableCell>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </StyledPaper>
          </Box>
        )}

        {tab === 4 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <StyledTextField
                label="Filter by Course Title"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                sx={{ width: "70%" }}
                variant="outlined"
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("course")}>
                Add Course
              </Button>
            </Box>
            <StyledPaper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Duration</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Fee</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {courses
                    .filter((c) => c.title?.toLowerCase().includes(courseFilter.toLowerCase()))
                    .map((c) => (
                      <StyledTableRow key={c.id}>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{c.title}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{c.duration}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>LKR {c.fee}</TableCell>
                        <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{c.description}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <StyledIconButton onClick={() => handleOpenDialog("course", true, c)}>
                              <EditIcon />
                            </StyledIconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <StyledIconButton color="error" onClick={() => deleteCourse(c.id)}>
                              <DeleteIcon />
                            </StyledIconButton>
                          </Tooltip>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </StyledPaper>
          </Box>
        )}

        {tab === 5 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <StyledTextField
                label="Filter by Job Seeker or Course"
                value={enrollmentFilter}
                onChange={(e) => setEnrollmentFilter(e.target.value)}
                sx={{ width: "70%" }}
                variant="outlined"
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("enrollment")}>
                Add Enrollment
              </Button>
            </Box>
            <StyledPaper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Job Seeker</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Course</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enrollments
                    .filter((e) => {
                      const jobSeeker = jobSeekers.find((js) => js.id === e.jobSeekerId);
                      const course = courses.find((c) => c.id === e.courseId);
                      const jobSeekerName = jobSeeker ? jobSeeker.name : e.jobSeekerId;
                      const courseTitle = course ? course.title : e.courseId;
                      return (
                        jobSeekerName?.toLowerCase().includes(enrollmentFilter.toLowerCase()) ||
                        courseTitle?.toLowerCase().includes(enrollmentFilter.toLowerCase())
                      );
                    })
                    .map((e, i) => {
                      const jobSeeker = jobSeekers.find((js) => js.id === e.jobSeekerId);
                      const course = courses.find((c) => c.id === e.courseId);
                      return (
                        <StyledTableRow key={i}>
                          <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{jobSeeker ? jobSeeker.name : e.jobSeekerId}</TableCell>
                          <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{course ? course.title : e.courseId}</TableCell>
                          <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>LKR {e.amount}</TableCell>
                          <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{e.date}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit">
                              <StyledIconButton onClick={() => handleOpenDialog("enrollment", true, e)}>
                                <EditIcon />
                              </StyledIconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <StyledIconButton color="error" onClick={() => deleteEnrollment(e.jobSeekerId, e.courseId)}>
                                <DeleteIcon />
                              </StyledIconButton>
                            </Tooltip>
                          </TableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </StyledPaper>
          </Box>
        )}

        {tab === 6 && (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <StyledTextField
                label="Filter by Job Seeker or Job"
                value={applicationFilter}
                onChange={(e) => setApplicationFilter(e.target.value)}
                sx={{ width: "70%" }}
                variant="outlined"
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog("application")}>
                Add Application
              </Button>
            </Box>
            <StyledPaper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Job Seeker</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Job</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>Application Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications
                    .filter((a) => {
                      const jobSeeker = jobSeekers.find((js) => js.id === a.jobSeekerId);
                      const job = jobs.find((j) => j.id === a.jobId);
                      const jobSeekerName = jobSeeker ? jobSeeker.name : a.jobSeekerId;
                      const jobTitle = job ? job.title : a.jobId;
                      return (
                        jobSeekerName?.toLowerCase().includes(applicationFilter.toLowerCase()) ||
                        jobTitle?.toLowerCase().includes(applicationFilter.toLowerCase())
                      );
                    })
                    .map((a, i) => {
                      const jobSeeker = jobSeekers.find((js) => js.id === a.jobSeekerId);
                      const job = jobs.find((j) => j.id === a.jobId);
                      return (
                        <StyledTableRow key={i}>
                          <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{jobSeeker ? jobSeeker.name : a.jobSeekerId}</TableCell>
                          <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{job ? job.title : a.jobId}</TableCell>
                          <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{a.applicationDate}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit">
                              <StyledIconButton onClick={() => handleOpenDialog("application", true, a)}>
                                <EditIcon />
                              </StyledIconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <StyledIconButton color="error" onClick={() => deleteApplication(a.id)}>
                                <DeleteIcon />
                              </StyledIconButton>
                            </Tooltip>
                          </TableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </StyledPaper>
          </Box>
        )}

        <Dialog open={openDialog.type !== null} onClose={handleCloseDialog}>
          <DialogTitle>{openDialog.isEdit ? `Edit ${openDialog.type}` : `Add ${openDialog.type}`}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={(e) => handleSubmit(e, openDialog.type, openDialog.isEdit)} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              {openDialog.type === "employer" && (
                <>
                  {openDialog.isEdit && <StyledTextField name="id" label="ID" defaultValue={openDialog.data.id || ""} InputProps={{ readOnly: true }} />}
                  <StyledTextField name="name" label="Name" defaultValue={openDialog.data.name || ""} required />
                  <StyledTextField name="companyName" label="Company Name" defaultValue={openDialog.data.companyName || ""} required />
                  <StyledTextField name="contactNumber" label="Contact Number" defaultValue={openDialog.data.contactNumber || ""} />
                  <StyledTextField name="address" label="Address" defaultValue={openDialog.data.address || ""} />
                  <StyledTextField name="userId" label="User ID" defaultValue={openDialog.data.userId || ""} type="number" />
                </>
              )}
              {openDialog.type === "trainer" && (
                <>
                  {openDialog.isEdit && <StyledTextField name="id" label="ID" defaultValue={openDialog.data.id || ""} InputProps={{ readOnly: true }} />}
                  <StyledTextField name="name" label="Name" defaultValue={openDialog.data.name || ""} required />
                  <StyledTextField name="courseCategory" label="Course Category" defaultValue={openDialog.data.courseCategory || ""} />
                  <StyledTextField name="qualification" label="Qualification" defaultValue={openDialog.data.qualification || ""} />
                  <StyledTextField name="experience" label="Experience" defaultValue={openDialog.data.experience || ""} />
                  <StyledTextField name="userId" label="User ID" defaultValue={openDialog.data.userId || ""} type="number" />
                </>
              )}
              {openDialog.type === "jobSeeker" && (
                <>
                  {openDialog.isEdit && <StyledTextField name="id" label="ID" defaultValue={openDialog.data.id || ""} InputProps={{ readOnly: true }} />}
                  <StyledTextField name="name" label="Name" defaultValue={openDialog.data.name || ""} required />
                  <StyledTextField name="jobCategory" label="Job Category" defaultValue={openDialog.data.jobCategory || ""} />
                  <StyledTextField name="skill" label="Skill" defaultValue={openDialog.data.skill || ""} />
                  <StyledTextField name="contactNumber" label="Contact Number" defaultValue={openDialog.data.contactNumber || ""} />
                  <StyledTextField name="userId" label="User ID" defaultValue={openDialog.data.userId || ""} type="number" />
                </>
              )}
              {openDialog.type === "job" && (
                <>
                  {openDialog.isEdit && <StyledTextField name="id" label="ID" defaultValue={openDialog.data.id || ""} InputProps={{ readOnly: true }} />}
                  <StyledTextField name="title" label="Title" defaultValue={openDialog.data.title || ""} required />
                  <StyledTextField name="description" label="Description" defaultValue={openDialog.data.description || ""} />
                  <StyledTextField name="location" label="Location" defaultValue={openDialog.data.location || ""} />
                  <StyledTextField name="salary" label="Salary" defaultValue={openDialog.data.salary || ""} type="number" />
                  <StyledTextField name="employerId" label="Employer ID" defaultValue={openDialog.data.employerId || ""} type="number" required />
                  <StyledTextField name="companyName" label="Company Name" defaultValue={openDialog.data.companyName || ""} />
                </>
              )}
              {openDialog.type === "course" && (
                <>
                  {openDialog.isEdit && <StyledTextField name="id" label="ID" defaultValue={openDialog.data.id || ""} InputProps={{ readOnly: true }} />}
                  <StyledTextField name="title" label="Title" defaultValue={openDialog.data.title || ""} required />
                  <StyledTextField name="duration" label="Duration" defaultValue={openDialog.data.duration || ""} />
                  <StyledTextField name="fee" label="Fee" defaultValue={openDialog.data.fee || ""} type="number" />
                  <StyledTextField name="description" label="Description" defaultValue={openDialog.data.description || ""} />
                </>
              )}
              {openDialog.type === "enrollment" && (
                <>
                  <StyledTextField name="jobSeekerId" label="Job Seeker ID" defaultValue={openDialog.data.jobSeekerId || ""} type="number" InputProps={{ readOnly: openDialog.isEdit }} required />
                  <StyledTextField name="courseId" label="Course ID" defaultValue={openDialog.data.courseId || ""} type="number" InputProps={{ readOnly: openDialog.isEdit }} required />
                  <StyledTextField name="amount" label="Amount" defaultValue={openDialog.data.amount || ""} type="number" required />
                  <StyledTextField name="date" label="Date" defaultValue={openDialog.data.date || ""} type="date" InputLabelProps={{ shrink: true }} required />
                </>
              )}
              {openDialog.type === "application" && (
                <>
                  {openDialog.isEdit && <StyledTextField name="id" label="ID" defaultValue={openDialog.data.id || ""} InputProps={{ readOnly: true }} />}
                  <StyledTextField name="jobId" label="Job ID" defaultValue={openDialog.data.jobId || ""} type="number" required />
                  <StyledTextField name="jobSeekerId" label="Job Seeker ID" defaultValue={openDialog.data.jobSeekerId || ""} type="number" required />
                  <StyledTextField name="cvFilePath" label="CV File Path" defaultValue={openDialog.data.cvFilePath || ""} />
                  <StyledTextField name="introduction" label="Introduction" defaultValue={openDialog.data.introduction || ""} />
                  <StyledTextField name="applicationDate" label="Application Date" defaultValue={openDialog.data.applicationDate || ""} type="date" InputLabelProps={{ shrink: true }} required />
                </>
              )}
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button type="submit" variant="contained">{openDialog.isEdit ? "Update" : "Add"}</Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>

        <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)} sx={{ display: { xs: "block", md: "none" } }}>
          {drawerContent}
        </Drawer>
      </StyledContent>
    </Box>
  );
};

export default AdminDashboard;