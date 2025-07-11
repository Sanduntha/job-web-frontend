import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
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
  Stack,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import BookIcon from "@mui/icons-material/Book";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const [employers, setEmployers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [companyFilter, setCompanyFilter] = useState("");
  const [trainerFilter, setTrainerFilter] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    axios.get("http://localhost:8081/api/employers").then((res) => setEmployers(res.data));
    axios.get("http://localhost:8081/api/trainers").then((res) => setTrainers(res.data));
    axios.get("http://localhost:8081/api/jobseekers").then((res) => setJobSeekers(res.data));
    axios.get("http://localhost:8081/api/courses").then((res) => setCourses(res.data));
    axios.get("http://localhost:8081/api/enrollments").then((res) => setEnrollments(res.data));
    axios.get("http://localhost:8081/api/jobs").then((res) => setJobs(res.data));
  };

  const handleTabChange = (e, newVal) => setTab(newVal);

  // Delete handlers for each entity
  const handleDelete = (type, id) => {
    Swal.fire({
      title: `Are you sure you want to delete this ${type}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8081/api/${type}/${id}`)
          .then(() => {
            Swal.fire("Deleted!", `${type} has been deleted.`, "success");
            // Update state by filtering out deleted
            switch (type) {
              case "employers":
                setEmployers((prev) => prev.filter((e) => e.id !== id));
                break;
              case "trainers":
                setTrainers((prev) => prev.filter((t) => t.id !== id));
                break;
              case "jobseekers":
                setJobSeekers((prev) => prev.filter((j) => j.id !== id));
                break;
              case "jobs":
                setJobs((prev) => prev.filter((j) => j.id !== id));
                break;
              case "courses":
                setCourses((prev) => prev.filter((c) => c.id !== id));
                break;
              case "enrollments":
                setEnrollments((prev) => prev.filter((e) => e.id !== id));
                break;
              default:
                break;
            }
          })
          .catch(() => {
            Swal.fire("Error", `Failed to delete the ${type}.`, "error");
          });
      }
    });
  };

  // Analytics cards data
  const analytics = [
    {
      label: "Employers",
      count: employers.length,
      icon: <BusinessIcon fontSize="large" color="primary" />,
      color: "primary.main",
    },
    {
      label: "Trainers",
      count: trainers.length,
      icon: <SchoolIcon fontSize="large" color="secondary" />,
      color: "secondary.main",
    },
    {
      label: "Job Seekers",
      count: jobSeekers.length,
      icon: <PeopleIcon fontSize="large" color="success" />,
      color: "success.main",
    },
    {
      label: "Jobs",
      count: jobs.length,
      icon: <WorkIcon fontSize="large" color="info" />,
      color: "info.main",
    },
    {
      label: "Courses",
      count: courses.length,
      icon: <BookIcon fontSize="large" color="warning" />,
      color: "warning.main",
    },
    {
      label: "Enrollments",
      count: enrollments.length,
      icon: <AssignmentTurnedInIcon fontSize="large" color="error" />,
      color: "error.main",
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Analytics cards */}
      <Grid container spacing={2} mb={4}>
        {analytics.map(({ label, count, icon, color }) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={label}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
              <Box sx={{ mr: 2, color }}>
                {icon}
              </Box>
              <Box>
                <Typography variant="h6">{label}</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {count}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary" sx={{ mb: 3 }}>
        <Tab label="Employers" />
        <Tab label="Trainers" />
        <Tab label="Job Seekers" />
        <Tab label="Jobs" />
        <Tab label="Courses" />
        <Tab label="Enrollments" />
      </Tabs>

      {/* Employers */}
      {tab === 0 && (
        <Box>
          <TextField
            label="Filter by Company"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employers
                  .filter((emp) =>
                    emp.companyName?.toLowerCase().includes(companyFilter.toLowerCase())
                  )
                  .map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.companyName}</TableCell>
                      <TableCell>{emp.contactNumber}</TableCell>
                      <TableCell>{emp.address}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete("employers", emp.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* Trainers */}
      {tab === 1 && (
        <Box>
          <TextField
            label="Filter by Trainer Name"
            value={trainerFilter}
            onChange={(e) => setTrainerFilter(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Qualification</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trainers
                  .filter((t) => t.name?.toLowerCase().includes(trainerFilter.toLowerCase()))
                  .map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{t.courseCategory}</TableCell>
                      <TableCell>{t.qualification}</TableCell>
                      <TableCell>{t.experience}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete("trainers", t.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* Job Seekers */}
      {tab === 2 && (
        <Box>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Job Category</TableCell>
                  <TableCell>Skill</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobSeekers.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell>{j.name}</TableCell>
                    <TableCell>{j.jobCategory}</TableCell>
                    <TableCell>{j.skill}</TableCell>
                    <TableCell>{j.contactNumber}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete("jobseekers", j.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* Jobs */}
      {tab === 3 && (
        <Box>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell>{j.title}</TableCell>
                    <TableCell>{j.description}</TableCell>
                    <TableCell>{j.location}</TableCell>
                    <TableCell>{j.salary}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete("jobs", j.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* Courses */}
      {tab === 4 && (
        <Box>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{c.duration}</TableCell>
                    <TableCell>LKR {c.fee}</TableCell>
                    <TableCell>{c.description}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete("courses", c.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>
      )}

      {/* Enrollments */}
      {tab === 5 && (
        <Box>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Job Seeker</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrollments.map((e, i) => {
                  const jobSeeker = jobSeekers.find((js) => js.id === e.jobSeekerId);
                  const course = courses.find((c) => c.id === e.courseId);

                  return (
                    <TableRow key={i}>
<TableCell>{jobSeeker ? jobSeeker.name : e.jobSeekerId}</TableCell>
<TableCell>{course ? course.title : e.courseId}</TableCell>
<TableCell>LKR {e.amount}</TableCell>
<TableCell>{e.date}</TableCell>
<TableCell align="center">
<Tooltip title="Delete">
<IconButton
color="error"
onClick={() => handleDelete("enrollments", e.id)}
>
<DeleteIcon />
</IconButton>
</Tooltip>
</TableCell>
</TableRow>
);
})}
</TableBody>
</Table>
</Paper>
</Box>
)}
</Box>
);
};

export default AdminDashboard;
