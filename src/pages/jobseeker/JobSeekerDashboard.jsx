// imports
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
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// styled components
const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#eef5f9",
  minHeight: "100vh",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  minHeight: 180,
  width: 300,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "#1565c0",
  color: "#fff",
  fontWeight: 600,
  borderRadius: 24,
  padding: theme.spacing(1.2, 3),
  textTransform: "none",
  '&:hover': { background: "#104c91" },
}));

const StyledFileInput = styled("input")({ display: "none" });

const StyledFileLabel = styled("label")(({ theme }) => ({
  display: "inline-block",
  marginTop: theme.spacing(2),
  background: "#1565c0",
  color: "#fff",
  padding: theme.spacing(1, 2),
  borderRadius: "24px",
  cursor: "pointer",
}));

// main component
const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [intro, setIntro] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [cvError, setCvError] = useState("");
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobSeekerProfileId, setJobSeekerProfileId] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [passRate, setPassRate] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/jobs").then((res) => setJobs(res.data));
    axios.get("http://localhost:8080/api/courses").then((res) => setCourses(res.data));
  }, []);

  useEffect(() => {
    if (user?.id) {
      axios.get(`http://localhost:8080/api/jobseekers/user/${user.id}`)
        .then((res) => {
          setJobSeekerProfileId(res.data.id);
          axios.get(`http://localhost:8080/api/applications/jobseeker/${res.data.id}`)
            .then((appRes) => {
              const ids = appRes.data.map((app) => app.jobId);
              setAppliedJobIds(ids);
            });

          axios.get(`http://localhost:8080/api/enrollments/jobseeker/${res.data.id}`)
            .then((res) => {
              const enrolledIds = res.data.map(enrollment => enrollment.courseId);
              setEnrolledCourseIds(enrolledIds);
            });
        })
        .catch(() => Swal.fire("Error", "Please complete your profile first.", "error"));
    }
  }, [user?.id]);

  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetailsOpen = (job) => {
    setSelectedJob(job);
    setOpenDetailsDialog(true);
  };

  const handleDetailsClose = () => {
    setSelectedJob(null);
    setOpenDetailsDialog(false);
  };

  const handleApplyOpen = () => {
    setPassRate(null);
    setIntro("");
    setCvFile(null);
    setCvError("");
    setOpenApplyDialog(true);
  };

  const handleApplyClose = () => {
    setIntro("");
    setCvFile(null);
    setPassRate(null);
    setCvError("");
    setOpenApplyDialog(false);
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
    formData.append("application", new Blob([JSON.stringify(application)], { type: "application/json" }));
    formData.append("cvFile", cvFile);

    try {
      const res = await axios.post("http://localhost:8080/api/applications/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const passRate = res.data.passRate;
      Swal.fire({
        title: "✅ Application Submitted!",
        html: `<b>Resume Match Rate:</b> ${passRate}%`,
        icon: "success",
      });

      handleApplyClose();
      setAppliedJobIds([...appliedJobIds, selectedJob.id]);
      handleDetailsClose();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        Swal.fire("❌ Application Rejected", err.response.data, "error");
      } else {
        Swal.fire("Error", err.response?.data || "Application failed", "error");
      }
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    setCvFile(file);
    setPassRate(null);
    setCvError("");

    if (!selectedJob) {
      setCvError("Please select a job before uploading a CV.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setCvError("Invalid file type. Please upload PDF or Word document.");
      return;
    }

    const formData = new FormData();
    formData.append("cvFile", file);
    formData.append("jobDescription", selectedJob.description);

    try {
      const res = await axios.post("http://localhost:8080/api/applications/resume-match", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const rate = parseFloat(res.data).toFixed(2);
      setPassRate(rate);

      if (rate < 50) {
        setCvError("Match rate too low. Please update your CV.");
      }
    } catch (err) {
      setCvError("Error processing CV. Please try again.");
    }
  };

  const handleEnroll = async (courseId) => {
    if (!jobSeekerProfileId) {
      Swal.fire("Error", "Please complete your profile first.", "error");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const course = courses.find((c) => c.id === courseId);

    if (!course) {
      Swal.fire("Error", "Course not found.", "error");
      return;
    }

    const result = await Swal.fire({
      title: `Enroll in ${course.title}?`,
      text: `This course costs LKR ${course.fee}. Continue?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Enroll",
    });

    if (result.isConfirmed) {
      try {
        await axios.post("http://localhost:8080/api/enrollments", {
          jobSeekerId: jobSeekerProfileId,
          courseId: courseId,
          amount: Number(course.fee),
          date: today,
        });
        Swal.fire("Success", `Enrolled in "${course.title}"!`, "success");
        setEnrolledCourseIds((prev) => [...prev, courseId]);
      } catch (err) {
        if (
          err.response?.data?.toLowerCase().includes("already enrolled")
        ) {
          Swal.fire("Info", "You are already enrolled in this course.", "info");
          setEnrolledCourseIds((prev) => [...prev, courseId]);
        } else {
          Swal.fire("Error", err.response?.data || "Enrollment failed", "error");
        }
      }
    }
  };

  return (
    <StyledBox>
      <Typography variant="h4" gutterBottom sx={{ color: "#1565c0", fontWeight: "bold" }}>
        🎯 Job Seeker Dashboard
      </Typography>

      <StyledTextField
        label="🔍 Search Jobs or Courses"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Jobs */}
      <Typography variant="h5" sx={{ mt: 4 }}>💼 Available Jobs</Typography>
      <Grid container spacing={2}>
        {filteredJobs.map((job) => (
          <Grid item xs={12} md={6} key={job.id}>
            <StyledCard>
              <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>{job.title}</Typography>
                <Typography variant="body2" color="textSecondary">📍 Location: {job.location || "N/A"}</Typography>
                <Typography variant="body2" color="textSecondary">🏢 Company: {job.companyName || "Unknown"}</Typography>
                <Typography variant="body2" color="textSecondary">💰 Salary: {job.salary || "Not specified"} LKR</Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ textAlign: "right" }}>
                  {appliedJobIds.includes(job.id) ? (
                    <Chip label="✅ Already Applied" color="success" />
                  ) : (
                    <Button size="small" onClick={() => handleDetailsOpen(job)}>More</Button>
                  )}
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Courses */}
      <Divider sx={{ my: 5 }} />
      <Typography variant="h5">📚 Available Courses</Typography>
      <Grid container spacing={3}>
        {filteredCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card      sx={{
          borderRadius: 3,
          boxShadow: 4,
          height: 300, // fixed height for all cards
          width:400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          
          p: 2
        }}>
              <CardContent>
                {enrolledCourseIds.includes(course.id) && (
                  <Chip label="✅ Enrolled" color="success" size="small" sx={{ mb: 1 }} />
                )}
                <Typography variant="h6" gutterBottom>{course.title}</Typography>
                <Typography variant="body2" color="text.secondary">⏱️ Duration: {course.duration}</Typography>
                <Typography variant="body2">💸 Fee: LKR {course.fee}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{course.description}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEnroll(course.id)}
                  sx={{ mt: 2 }}
                  disabled={enrolledCourseIds.includes(course.id)}
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Job Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={handleDetailsClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#1565c0" }}>{selectedJob?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1"><strong>Company:</strong> {selectedJob?.companyName}</Typography>
          <Typography variant="subtitle1"><strong>Location:</strong> {selectedJob?.location}</Typography>
          <Typography variant="subtitle1"><strong>Salary:</strong> {selectedJob?.salary}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>{selectedJob?.description}</Typography>
        </DialogContent>
        <DialogActions>
          {appliedJobIds.includes(selectedJob?.id) ? (
            <Chip label="✅ Already Applied" color="success" sx={{ mr: 2 }} />
          ) : (
            <StyledButton onClick={handleApplyOpen}>Apply</StyledButton>
          )}
          <Button onClick={handleDetailsClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Apply Dialog */}
      <Dialog open={openApplyDialog} onClose={handleApplyClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "#1565c0" }}>✍️ Apply for {selectedJob?.title}</DialogTitle>
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
            {cvFile ? cvFile.name : "📄 Upload CV (PDF/DOC)"}
          </StyledFileLabel>
          <StyledFileInput
            id="cv-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCVUpload}
          />
          {cvError && <Typography sx={{ mt: 1, color: "error.main" }}>{cvError}</Typography>}
          {passRate !== null && (
            <Typography sx={{ mt: 2, color: passRate < 50 ? "red" : "green" }}>
              🔍 Match Rate: <strong>{passRate}%</strong>
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleApplyClose}>Cancel</Button>
          <StyledButton
            onClick={handleApplySubmit}
            disabled={passRate === null || passRate < 50 || cvError !== ""}
          >
            Submit
          </StyledButton>
        </DialogActions>
      </Dialog>
    </StyledBox>
  );
};

export default JobSeekerDashboard;
