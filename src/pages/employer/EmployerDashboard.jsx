import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Divider,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import Swal from "sweetalert2";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#f0f4f8",
  minHeight: "100vh",
  fontFamily: "'Roboto', sans-serif",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
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

const StyledOutlineButton = styled(Button)(({ theme }) => ({
  borderColor: "#1565c0",
  color: "#1565c0",
  textTransform: "none",
  fontWeight: 600,
  fontFamily: "'Roboto', sans-serif",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 2),
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#104c91",
    color: "#104c91",
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius * 2,
    background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.1)",
    transform: "translateX(4px)",
  },
}));

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    companyName: "",
    description: "",
  });
  const [applicants, setApplicants] = useState([]);
  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [applicationCounts, setApplicationCounts] = useState({});


  const fetchJobs = async () => {
  try {
    const employerId = localStorage.getItem("employerId");
    if (!employerId) {
      console.warn("No employer ID in localStorage");
      return;
    }
    const res = await axiosInstance.get(`/jobs/employer/${employerId}`);
    setJobs(res.data);

    // Fetch application counts for each job
    const counts = {};
    await Promise.all(
      res.data.map(async (job) => {
        try {
          const countRes = await axiosInstance.get(`/applications/count/job/${job.id}`);
          counts[job.id] = countRes.data.count;
        } catch {
          counts[job.id] = 0;
        }
      })
    );
    setApplicationCounts(counts);
  } catch (err) {
    console.error("Failed to load jobs", err);
  }
};

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const employerId = localStorage.getItem("employerId");
    if (!employerId) {
      Swal.fire("Error", "Employer ID not found. Please register your profile first.", "error");
      return;
    }

    try {
      await axiosInstance.post("/jobs/add", {
        ...form,
        employerId,
      });

      Swal.fire("Success", "Job posted successfully", "success");
      setForm({
        title: "",
        location: "",
        salary: "",
        companyName: "",
        description: "",
      });
      setOpen(false);
      fetchJobs();
    } catch (err) {
      Swal.fire("Error", err.response?.data || "Failed to post job", "error");
      console.error(err);
    }
  };

  const viewApplicants = async (jobId, jobTitle) => {
    try {
      const res = await axiosInstance.get(`/applications/job/${jobId}`);
      setApplicants(res.data);
      setSelectedJobTitle(jobTitle);
      setApplicantDialogOpen(true);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch applicants", "error");
    }
  };

  useEffect(() => {
    const loadEmployerProfile = async () => {
      const res = await axiosInstance.get(`/employers/user/${user.id}`);
      localStorage.setItem("employerId", res.data.id);
    };

    if (user?.id) {
      loadEmployerProfile();
      fetchJobs();
    }
  }, [user]);

  return (
    <StyledBox>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: "bold", color: "#1565c0" }}
      >
        Employer Dashboard
      </Typography>

      <StyledButton variant="contained" onClick={() => setOpen(true)}>
        Post New Job
      </StyledButton>

    <Box mt={3}>
  {jobs.map((job) => (
    <StyledCard key={job.id}>
      <CardContent>
        <Typography variant="h6" sx={{ color: "#1565c0" }}>
          {job.title}
        </Typography>
        <Typography sx={{ color: "#555" }}>{job.description}</Typography>
        <Typography><strong>Location:</strong> {job.location}</Typography>
        <Typography><strong>Salary:</strong> ${job.salary || "Not specified"}</Typography>
        <Typography><strong>Company:</strong> {job.companyName}</Typography>
        <Typography><strong>Applicants:</strong> {applicationCounts[job.id] || 0}</Typography>
        <StyledOutlineButton
          onClick={() => viewApplicants(job.id, job.title)}
          variant="outlined"
          sx={{ mt: 1 }}
        >
          View Applicants
        </StyledOutlineButton>
      </CardContent>
    </StyledCard>
  ))}
</Box>


      {/* Dialog: Post Job */}
      <StyledDialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ color: "#1565c0" }}>
          Post a New Job
        </DialogTitle>
        <DialogContent>
          <StyledTextField
            label="Title"
            name="title"
            fullWidth
            value={form.title}
            onChange={handleChange}
          />
          <StyledTextField
            label="Location"
            name="location"
            fullWidth
            value={form.location}
            onChange={handleChange}
          />
          <StyledTextField
            label="Salary"
            name="salary"
            type="number"
            fullWidth
            value={form.salary}
            onChange={handleChange}
          />
          <StyledTextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
          <StyledTextField
            label="Company Name"
            name="companyName"
            fullWidth
            value={form.companyName}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={handleSubmit} variant="contained">
            Submit
          </StyledButton>
          <StyledOutlineButton onClick={() => setOpen(false)}>
            Cancel
          </StyledOutlineButton>
        </DialogActions>
      </StyledDialog>

      {/* Dialog: View Applicants */}
      <StyledDialog
        open={applicantDialogOpen}
        onClose={() => setApplicantDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: "#1565c0" }}>
          Applicants for: {selectedJobTitle}
        </DialogTitle>
        <DialogContent dividers>
          {applicants.length === 0 ? (
            <Typography>No applicants found.</Typography>
          ) : (
            <List>
              {applicants.map((a) => (
                <React.Fragment key={a.id}>
                  <StyledListItem alignItems="flex-start">
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography><strong>Name:</strong> {a.jobSeekerName}</Typography>
                        <Typography><strong>Intro:</strong> {a.introduction}</Typography>
                        <Typography><strong>Category:</strong> {a.jobCategory}</Typography>
                        <Typography><strong>Skill:</strong> {a.skill}</Typography>
                        <Typography><strong>Contact:</strong> {a.contactNumber}</Typography>
                        <StyledOutlineButton
                          onClick={() =>
                            window.open(
                              `http://localhost:8080/api/applications/download-cv/${a.id}`,
                              "_blank"
                            )
                          }
                        >
                          Download CV
                        </StyledOutlineButton>
                      </Grid>
                    </Grid>
                  </StyledListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <StyledOutlineButton onClick={() => setApplicantDialogOpen(false)}>
            Close
          </StyledOutlineButton>
        </DialogActions>
      </StyledDialog>
    </StyledBox>
  );
};

export default EmployerDashboard;
