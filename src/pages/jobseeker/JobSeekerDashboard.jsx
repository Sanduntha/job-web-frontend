import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Divider,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#f0f4f8",
  minHeight: "100vh",
  fontFamily: "'Roboto', sans-serif",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #1565c0, #64b5f6)",
  color: "#fff",
  textTransform: "none",
  fontWeight: 600,
  fontFamily: "'Roboto', sans-serif",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 2),
  marginTop: theme.spacing(1),
  "&:hover": {
    background: "linear-gradient(90deg, #104c91, #4a8fe7)",
    transform: "scale(1.05)",
  },
}));

const StyledSecondaryButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(90deg, #ab47bc, #ce93d8)",
  color: "#fff",
  textTransform: "none",
  fontWeight: 600,
  fontFamily: "'Roboto', sans-serif",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 2),
  marginTop: theme.spacing(1),
  "&:hover": {
    background: "linear-gradient(90deg, #8e24aa, #b388ff)",
    transform: "scale(1.05)",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(2),
  },
}));

const StyledFileInput = styled("input")({
  display: "none",
});

const StyledFileLabel = styled("label")(({ theme }) => ({
  display: "inline-block",
  marginTop: theme.spacing(2),
  background: "linear-gradient(90deg, #1565c0, #64b5f6)",
  color: "#fff",
  padding: theme.spacing(1, 2),
  borderRadius: "24px",
  cursor: "pointer",
}));

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [intro, setIntro] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobSeekerProfileId, setJobSeekerProfileId] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8081/api/jobs").then((res) => setJobs(res.data));
    axios.get("http://localhost:8081/api/courses").then((res) => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:8081/api/jobseekers/user/${user.id}`)
        .then((res) => setJobSeekerProfileId(res.data.id))
        .catch(() => Swal.fire("Error", "Please complete your profile first.", "error"));
    }
  }, [user?.id]);

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApplyOpen = (job) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  const handleApplySubmit = async () => {
    if (!intro || !cvFile || !selectedJob || !jobSeekerProfileId) {
      Swal.fire("Warning", "Please complete all fields.", "warning");
      return;
    }

    const application = {
      jobId: Number(selectedJob.id),
      jobSeekerId: Number(jobSeekerProfileId),
      introduction: intro.trim(),
    };

    const formData = new FormData();
    formData.append(
      "application",
      new Blob([JSON.stringify(application)], { type: "application/json" })
    );
    formData.append("cvFile", cvFile);

    try {
      await axios.post("http://localhost:8081/api/applications/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire("Success", "Application submitted!", "success");
      setOpenDialog(false);
      setIntro("");
      setCvFile(null);
    } catch (err) {
      Swal.fire("Error", err.response?.data || "Failed to apply", "error");
    }
  };

  const handleEnroll = async (course) => {
    if (!jobSeekerProfileId) {
      Swal.fire("Error", "Please complete your profile first.", "error");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const result = await Swal.fire({
      title: `Enroll in ${course.title}?`,
      text: `This course costs LKR ${course.fee}. Continue?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Enroll",
    });

    if (result.isConfirmed) {
      try {
        await axios.post("http://localhost:8081/api/enrollments", {
          jobSeekerId: jobSeekerProfileId,
          courseId: course.id,
          amount: Number(course.fee),
          date: today,
        });
        Swal.fire("Success", `Enrolled in "${course.title}"!`, "success");
      } catch (err) {
        Swal.fire("Error", err.response?.data || "Enrollment failed", "error");
      }
    }
  };

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom sx={{ color: "#1565c0", fontWeight: "bold" }}>
        Job Seeker Dashboard
      </Typography>

      <StyledTextField
        label="Search Jobs"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "#1565c0" }}>
        Available Jobs
      </Typography>
      <Grid container spacing={2}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography>{job.description}</Typography>
                <Typography color="textSecondary">
                  {job.companyName || "Unknown Company"} - {job.location}
                </Typography>
                <Typography>
                  <strong>Salary:</strong> {job.salary || "Not specified"}
                </Typography>
                <StyledButton onClick={() => handleApplyOpen(job)}>Apply</StyledButton>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h5" sx={{ mb: 2, color: "#1565c0" }}>
        Available Courses
      </Typography>
      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6">{course.title}</Typography>
                <Typography><strong>Duration:</strong> {course.duration}</Typography>
                <Typography><strong>Fee:</strong> LKR {course.fee}</Typography>
                <Typography>{course.description}</Typography>
                <StyledSecondaryButton onClick={() => handleEnroll(course)}>
                  Enroll
                </StyledSecondaryButton>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      <StyledDialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#1565c0" }}>
          Apply for {selectedJob?.title}
        </DialogTitle>
        <DialogContent>
          <StyledTextField
            label="Introduction"
            multiline
            rows={4}
            fullWidth
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
          />
          <StyledFileLabel htmlFor="cv-upload">
            {cvFile ? cvFile.name : "Upload CV (PDF/DOC)"}
          </StyledFileLabel>
          <StyledFileInput
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCvFile(e.target.files[0])}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <StyledButton onClick={handleApplySubmit}>
            Submit Application
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </StyledBox>
  );
};

export default JobSeekerDashboard;
