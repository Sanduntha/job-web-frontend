import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from "@mui/material";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

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

  // Load jobs and courses on mount
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/jobs")
      .then((res) => setJobs(res.data))
      .catch(() => Swal.fire("Error", "Failed to load jobs", "error"));

    axios
      .get("http://localhost:8081/api/courses")
      .then((res) => setCourses(res.data))
      .catch(() => Swal.fire("Error", "Failed to load courses", "error"));
  }, []);

  // Get Job Seeker profile id using logged in user id
  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:8081/api/jobseekers/user/${user.id}`)
        .then((res) => setJobSeekerProfileId(res.data.id))
        .catch(() => Swal.fire("Error", "Please complete your profile first.", "error"));
    }
  }, [user?.id]);

  // Filter jobs by search term
  const filteredJobs = jobs.filter((job) =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open dialog to apply for job
  const handleApplyOpen = (job) => {
    setSelectedJob(job);
    setOpenDialog(true);
  };

  // Submit job application with introduction and CV
  const handleApplySubmit = async () => {
    if (!intro || !cvFile || !selectedJob || !jobSeekerProfileId) {
      Swal.fire("Warning", "Please complete all fields and profile.", "warning");
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

  // Enroll in a course with course fee and current date
  const handleEnroll = async (course) => {
  if (!jobSeekerProfileId) {
    Swal.fire("Error", "Please complete your profile first.", "error");
    return;
  }

  const today = new Date().toISOString().split("T")[0]; // yyyy-MM-dd

  // Show confirmation dialog
  const result = await Swal.fire({
    title: `Enroll in ${course.title}?`,
    text: `This course costs LKR ${course.fee}. Do you want to continue?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Enroll",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    try {
      await axios.post("http://localhost:8081/api/enrollments", {
        jobSeekerId: jobSeekerProfileId,
        courseId: course.id,
        amount: Number(course.fee),
        date: today,
      });

      Swal.fire("Success", `You are enrolled in "${course.title}"!`, "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data || "Enrollment failed", "error");
    }
  }
};

  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>
        Job Seeker Dashboard
      </Typography>

      {/* Search input */}
      <TextField
        label="Search Jobs"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* Jobs Section */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        Available Jobs
      </Typography>
      <Grid container spacing={2}>
        {filteredJobs.length === 0 ? (
          <Typography variant="body1" sx={{ m: 2 }}>
            No jobs found.
          </Typography>
        ) : (
          filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography>{job.description}</Typography>
                  <Typography>
                    {job.company_name || "Unknown Company"} - {job.location}
                  </Typography>
                  <Typography>Salary: {job.salary || "Not specified"}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1 }}
                    onClick={() => handleApplyOpen(job)}
                  >
                    Apply
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Courses Section */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" sx={{ mb: 2 }}>
        Available Courses
      </Typography>
      <Grid container spacing={2}>
        {courses.length === 0 ? (
          <Typography variant="body1" sx={{ m: 2 }}>
            No courses available.
          </Typography>
        ) : (
          courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography>Duration: {course.duration}</Typography>
                  <Typography>Fee: LKR {course.fee}</Typography>
                  <Typography>{course.description}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 1 }}
                    onClick={() => handleEnroll(course)}
                  >
                    Enroll
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))

        )}
      </Grid>

      {/* Application Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
        <DialogContent>
          <TextField
            label="Introduction"
            multiline
            rows={4}
            fullWidth
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            sx={{ mb: 2 }}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCvFile(e.target.files[0])}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApplySubmit}>
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default JobSeekerDashboard;
