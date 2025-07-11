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
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import Swal from "sweetalert2";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
  });

  const [applicants, setApplicants] = useState([]);
  const [applicantDialogOpen, setApplicantDialogOpen] = useState(false);
  const [selectedJobTitle, setSelectedJobTitle] = useState("");

  const fetchJobs = async () => {
    try {
      const employerId = localStorage.getItem("employerId");
      if (!employerId) {
        console.warn("No employer ID in localStorage");
        return;
      }
      const res = await axiosInstance.get(`/jobs/employer/${employerId}`);
      setJobs(res.data);
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
      setForm({ title: "", location: "", salary: "", description: "" });
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Employer Dashboard
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        Post New Job
      </Button>

      <Box mt={3}>
        {jobs.map((job) => (
          <Card key={job.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{job.title}</Typography>
              <Typography>{job.description}</Typography>
              <Typography>
                <strong>Location:</strong> {job.location}
              </Typography>
              <Typography>
                <strong>Salary:</strong> ${job.salary}
              </Typography>
              <Button
                onClick={() => viewApplicants(job.id, job.title)}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                View Applicants
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog: Post Job */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Post a New Job</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={form.title}
            onChange={handleChange}
          />
          <TextField
            label="Location"
            name="location"
            fullWidth
            margin="normal"
            value={form.location}
            onChange={handleChange}
          />
          <TextField
            label="Salary"
            name="salary"
            type="number"
            fullWidth
            margin="normal"
            value={form.salary}
            onChange={handleChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={form.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: View Applicants */}
      <Dialog
        open={applicantDialogOpen}
        onClose={() => setApplicantDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Applicants for: {selectedJobTitle}</DialogTitle>
        <DialogContent dividers>
          {applicants.length === 0 ? (
            <Typography>No applicants found.</Typography>
          ) : (
            <List>
              {applicants.map((a) => (
                <React.Fragment key={a.id}>
                  <ListItem alignItems="flex-start">
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography><strong>Name:</strong> {a.jobSeekerName}</Typography>
                        <Typography><strong>Intro:</strong> {a.introduction}</Typography>
                        <Typography><strong>Category:</strong> {a.jobCategory}</Typography>
                        <Typography><strong>Skill:</strong> {a.skill}</Typography>
                        <Typography><strong>Contact:</strong> {a.contactNumber}</Typography>
                        <Button
  onClick={() =>
    window.open(`http://localhost:8081/api/applications/download-cv/${a.id}`, '_blank')
  }
>
  Download CV
</Button>

                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicantDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployerDashboard;
