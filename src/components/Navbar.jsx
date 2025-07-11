import React from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Link, 
  Button, 
  IconButton, 
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import WorkIcon from "@mui/icons-material/Work";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import { Link as RouterLink } from "react-router-dom";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(90deg, #1565c0, #64b5f6)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
  padding: theme.spacing(1, 0),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: "#fff",
  textDecoration: "none",
  margin: theme.spacing(0, 2),
  fontWeight: 500,
  fontSize: "1.1rem",
  display: "flex",
  alignItems: "center",
  transition: "color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    color: theme.palette.grey[100],
    transform: "translateY(-2px)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.25)",
  color: "#fff",
  textTransform: "none",
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 2.5),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  transition: "background-color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    transform: "translateY(-2px)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, bgcolor: "#f0f4f8" }} onClick={handleDrawerToggle}>
      <List>
        {[
          { text: "Home", to: "/", icon: <HomeIcon /> },
          { text: "About", to: "/about", icon: <InfoIcon /> },
          { text: "Contact", to: "/contact", icon: <ContactMailIcon /> },
        ].map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.to}
            sx={{
              color: "#1976d2",
              "&:hover": { bgcolor: "rgba(25, 118, 210, 0.1)" },
            }}
          >
            <ListItemIcon sx={{ color: "#1976d2" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <ListItem
          component={RouterLink}
          to="/login"
          sx={{
            color: "#1976d2",
            "&:hover": { bgcolor: "rgba(25, 118, 210, 0.1)" },
          }}
        >
          <ListItemIcon sx={{ color: "#1976d2" }}>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem
          component={RouterLink}
          to="/register"
          sx={{
            color: "#1976d2",
            "&:hover": { bgcolor: "rgba(25, 118, 210, 0.1)" },
          }}
        >
          <ListItemIcon sx={{ color: "#1976d2" }}>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary="Register" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="static">
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                color: "#fff",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              className="tracking-tight"
            >
              <WorkIcon sx={{ fontSize: { xs: "1.5rem", sm: "1.8rem" } }} />
              Job Portal
            </Typography>
            {isMobile ? (
              <IconButton
                color="inherit"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ display: { md: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StyledButton component={RouterLink} to="/login">
                  <LoginIcon sx={{ fontSize: "1.2rem" }} />
                  Login
                </StyledButton>
                <StyledButton component={RouterLink} to="/register" sx={{ ml: 1 }}>
                  <PersonAddIcon sx={{ fontSize: "1.2rem" }} />
                  Register
                </StyledButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </StyledAppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;