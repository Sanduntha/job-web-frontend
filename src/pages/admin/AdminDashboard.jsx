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
    Stack,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import BookIcon from "@mui/icons-material/Book";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
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
    const [jobSeekerFilter, setJobSeekerFilter] = useState("");
    const [jobFilter, setJobFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [enrollmentFilter, setEnrollmentFilter] = useState("");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = () => {
        axios.get("http://localhost:8080/api/employers").then((res) => setEmployers(res.data));
        axios.get("http://localhost:8080/api/trainers").then((res) => setTrainers(res.data));
        axios.get("http://localhost:8080/api/jobseekers").then((res) => setJobSeekers(res.data));
        axios.get("http://localhost:8080/api/courses").then((res) => setCourses(res.data));
        axios.get("http://localhost:8080/api/enrollments").then((res) => setEnrollments(res.data));
        axios.get("http://localhost:8080/api/jobs").then((res) => setJobs(res.data));
    };

    const handleTabChange = (newVal) => {
        setTab(newVal);
        if (isMobile) setDrawerOpen(false);
    };

    const handleDelete = (type, id) => {
        Swal.fire({
            title: `Are you sure you want to delete this ${type}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`http://localhost:8080/api/${type}/${id}`)
                    .then(() => {
                        Swal.fire("Deleted!", `${type} has been deleted.`, "success");
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

    const analytics = [
        {
            label: "Employers",
            count: employers.length,
            icon: <BusinessIcon fontSize="large" sx={{ color: "#1976d2" }} />,
        },
        {
            label: "Trainers",
            count: trainers.length,
            icon: <SchoolIcon fontSize="large" sx={{ color: "#ab47bc" }} />,
        },
        {
            label: "Job Seekers",
            count: jobSeekers.length,
            icon: <PeopleIcon fontSize="large" sx={{ color: "#4caf50" }} />,
        },
        {
            label: "Jobs",
            count: jobs.length,
            icon: <WorkIcon fontSize="large" sx={{ color: "#0288d1" }} />,
        },
        {
            label: "Courses",
            count: courses.length,
            icon: <BookIcon fontSize="large" sx={{ color: "#f57c00" }} />,
        },
        {
            label: "Enrollments",
            count: enrollments.length,
            icon: <AssignmentTurnedInIcon fontSize="large" sx={{ color: "#d32f2f" }} />,
        },
    ];

    const navItems = [
        { label: "Employers", icon: <BusinessIcon /> },
        { label: "Trainers", icon: <SchoolIcon /> },
        { label: "Job Seekers", icon: <PeopleIcon /> },
        { label: "Jobs", icon: <WorkIcon /> },
        { label: "Courses", icon: <BookIcon /> },
        { label: "Enrollments", icon: <AssignmentTurnedInIcon /> },
    ];

    const drawerContent = (
        <Box sx={{ width: 250, bgcolor: "#1565c0" }}>
            <List>
                <StyledListItem>
                    <Typography variant="h6" className="font-bold" sx={{ fontFamily: "'Roboto', sans-serif" }}>
                        Admin Dashboard
                    </Typography>
                </StyledListItem>
                {navItems.map((item, index) => (
                    <StyledListItem
                        key={item.label}
                        button
                        selected={tab === index}
                        onClick={() => handleTabChange(index)}
                    >
                        <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.label} sx={{ "& .MuiListItemText-primary": { fontFamily: "'Roboto', sans-serif" } }} />
                    </StyledListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar */}
            {!isMobile && (
                <StyledSidebar>
                    <Typography variant="h5" sx={{ p: 2, fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }} className="text-center">
                        Admin Dashboard
                    </Typography>
                    <List>
                        {navItems.map((item, index) => (
                            <StyledListItem
                                key={item.label}
                                button
                                selected={tab === index}
                                onClick={() => handleTabChange(index)}
                            >
                                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} sx={{ "& .MuiListItemText-primary": { fontFamily: "'Roboto', sans-serif" } }} />
                            </StyledListItem>
                        ))}
                    </List>
                </StyledSidebar>
            )}

            {/* Main Content */}
            <StyledContent>
                {isMobile && (
                    <StyledIconButton
                        onClick={() => setDrawerOpen(true)}
                        sx={{ mb: 2, color: "#1976d2" }}
                    >
                        <MenuIcon />
                    </StyledIconButton>
                )}
                <Typography variant="h4" className="font-extrabold text-gray-800" gutterBottom sx={{ fontFamily: "'Roboto', sans-serif" }}>
                    Admin Dashboard
                </Typography>

                {/* Analytics Cards */}
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

                {/* Employers */}
                {tab === 0 && (
                    <Box>
                        <TextField
                            label="Filter by Company"
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 3, borderRadius: "12px", backgroundColor: "#fff", fontFamily: "'Roboto', sans-serif" }}
                            InputProps={{
                                sx: {
                                    borderRadius: "12px",
                                    fontFamily: "'Roboto', sans-serif",
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#1976d2",
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: { fontFamily: "'Roboto', sans-serif" },
                            }}
                        />
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
                                        .filter((emp) =>
                                            emp.companyName?.toLowerCase().includes(companyFilter.toLowerCase())
                                        )
                                        .map((emp) => (
                                            <StyledTableRow key={emp.id}>
                                                <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{emp.companyName}</TableCell>
                                                <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{emp.contactNumber}</TableCell>
                                                <TableCell sx={{ fontFamily: "'Roboto', sans-serif" }}>{emp.address}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Delete">
                                                        <StyledIconButton
                                                            color="error"
                                                            onClick={() => handleDelete("employers", emp.id)}
                                                        >
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

                {/* Trainers */}
                {tab === 1 && (
                    <Box>
                        <TextField
                            label="Filter by Trainer Name"
                            value={trainerFilter}
                            onChange={(e) => setTrainerFilter(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 3, borderRadius: "12px", backgroundColor: "#fff", fontFamily: "'Roboto', sans-serif" }}
                            InputProps={{
                                sx: {
                                    borderRadius: "12px",
                                    fontFamily: "'Roboto', sans-serif",
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#1976d2",
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: { fontFamily: "'Roboto', sans-serif" },
                            }}
                        />
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
                                                    <Tooltip title="Delete">
                                                        <StyledIconButton
                                                            color="error"
                                                            onClick={() => handleDelete("trainers", t.id)}
                                                        >
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

                {/* Job Seekers */}
                {tab === 2 && (
                    <Box>
                        <TextField
                            label="Filter by Job Seeker Name"
                            value={jobSeekerFilter}
                            onChange={(e) => setJobSeekerFilter(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 3, borderRadius: "12px", backgroundColor: "#fff", fontFamily: "'Roboto', sans-serif" }}
                            InputProps={{
                                sx: {
                                    borderRadius: "12px",
                                    fontFamily: "'Roboto', sans-serif",
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#1976d2",
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: { fontFamily: "'Roboto', sans-serif" },
                            }}
                        />
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
                                                    <Tooltip title="Delete">
                                                        <StyledIconButton
                                                            color="error"
                                                            onClick={() => handleDelete("jobseekers", j.id)}
                                                        >
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

                {/* Jobs */}
                {tab === 3 && (
                    <Box>
                        <TextField
                            label="Filter by Job Title"
                            value={jobFilter}
                            onChange={(e) => setJobFilter(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 3, borderRadius: "12px", backgroundColor: "#fff", fontFamily: "'Roboto', sans-serif" }}
                            InputProps={{
                                sx: {
                                    borderRadius: "12px",
                                    fontFamily: "'Roboto', sans-serif",
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#1976d2",
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: { fontFamily: "'Roboto', sans-serif" },
                            }}
                        />
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
                                                    <Tooltip title="Delete">
                                                        <StyledIconButton
                                                            color="error"
                                                            onClick={() => handleDelete("jobs", j.id)}
                                                        >
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

                {/* Courses */}
                {tab === 4 && (
                    <Box>
                        <TextField
                            label="Filter by Course Title"
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 3, borderRadius: "12px", backgroundColor: "#fff", fontFamily: "'Roboto', sans-serif" }}
                            InputProps={{
                                sx: {
                                    borderRadius: "12px",
                                    fontFamily: "'Roboto', sans-serif",
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#1976d2",
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: { fontFamily: "'Roboto', sans-serif" },
                            }}
                        />
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
                                                    <Tooltip title="Delete">
                                                        <StyledIconButton
                                                            color="error"
                                                            onClick={() => handleDelete("courses", c.id)}
                                                        >
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

                {/* Enrollments */}
                {tab === 5 && (
                    <Box>
                        <TextField
                            label="Filter by Job Seeker or Course"
                            value={enrollmentFilter}
                            onChange={(e) => setEnrollmentFilter(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 3, borderRadius: "12px", backgroundColor: "#fff", fontFamily: "'Roboto', sans-serif" }}
                            InputProps={{
                                sx: {
                                    borderRadius: "12px",
                                    fontFamily: "'Roboto', sans-serif",
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#1976d2",
                                    },
                                },
                            }}
                            InputLabelProps={{
                                sx: { fontFamily: "'Roboto', sans-serif" },
                            }}
                        />
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
                                                        <Tooltip title="Delete">
                                                            <StyledIconButton
                                                                color="error"
                                                                onClick={() => handleDelete("enrollments", e.id)}
                                                            >
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
            </StyledContent>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default AdminDashboard;