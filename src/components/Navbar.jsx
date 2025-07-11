import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(90deg, #1565c0, #64b5f6)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)",
  padding: theme.spacing(1, 0),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.25)",
  color: "#fff",
  textTransform: "none",
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 2.5),
  margin: theme.spacing(0, 1),
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

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#1976d2",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    background: "linear-gradient(145deg, #ffffff, #f0f4f8)",
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: "#1976d2",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(25, 118, 210, 0.1)",
  },
}));

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openMenu = Boolean(menuAnchor);

  const handleMenuClick = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate("/login");
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  const drawerContent = (
    <Box sx={{ width: 250, bgcolor: "#f0f4f8" }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <StyledListItem>
          <Typography variant="h6" className="font-bold text-gray-800">
            Menu
          </Typography>
        </StyledListItem>
        <Divider sx={{ mb: 1 }} />
        <StyledListItem button component={Link} to="/">
          <HomeIcon sx={{ mr: 1, color: "#1976d2" }} />
          <ListItemText primary="Home" />
        </StyledListItem>
        {user ? (
          <>
            <StyledListItem button component={Link} to={`/${user.role.toLowerCase()}/dashboard`}>
              <DashboardIcon sx={{ mr: 1, color: "#1976d2" }} />
              <ListItemText primary={`${user.role} Dashboard`} />
            </StyledListItem>
            <StyledListItem button onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1, color: "#1976d2" }} />
              <ListItemText primary="Logout" />
            </StyledListItem>
          </>
        ) : (
          <>
            <StyledListItem button component={Link} to="/login">
              <LoginIcon sx={{ mr: 1, color: "#1976d2" }} />
              <ListItemText primary="Login" />
            </StyledListItem>
            <StyledListItem button component={Link} to="/register">
              <HowToRegIcon sx={{ mr: 1, color: "#1976d2" }} />
              <ListItemText primary="Register" />
            </StyledListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Side */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={toggleDrawer(true)}
                sx={{ "&:hover": { transform: "scale(1.1)" } }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                color: "#fff",
                textDecoration: "none",
                ml: isMobile ? 1 : 0,
                display: "flex",
                alignItems: "center",
                fontWeight: "bold",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
              className="tracking-tight"
            >
              <HomeIcon sx={{ mr: 1, fontSize: { xs: "1.5rem", sm: "1.8rem" } }} />
              Job Portal
            </Typography>
          </Box>

          {/* Right Side */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {user ? (
                <>
                  <StyledButton
                    startIcon={<DashboardIcon />}
                    component={Link}
                    to={`/${user.role.toLowerCase()}/dashboard`}
                  >
                    {user.role} Dashboard
                  </StyledButton>
                  <Tooltip title="Account">
                    <IconButton onClick={handleMenuClick}>
                      <StyledAvatar>
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </StyledAvatar>
                    </IconButton>
                  </Tooltip>
                  <StyledMenu
                    anchorEl={menuAnchor}
                    open={openMenu}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2" className="text-gray-800">
                        {user.email}
                      </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1, color: "#1976d2" }} />
                      Logout
                    </MenuItem>
                  </StyledMenu>
                </>
              ) : (
                <>
                  <StyledButton
                    startIcon={<LoginIcon />}
                    component={Link}
                    to="/login"
                  >
                    Login
                  </StyledButton>
                  <StyledButton
                    startIcon={<HowToRegIcon />}
                    component={Link}
                    to="/register"
                  >
                    Register
                  </StyledButton>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;