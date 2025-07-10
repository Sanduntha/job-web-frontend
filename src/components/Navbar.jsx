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
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem>
          <Typography variant="h6">Menu</Typography>
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/">
          <HomeIcon sx={{ mr: 1 }} />
          <ListItemText primary="Home" />
        </ListItem>
        {user ? (
          <>
            <ListItem button component={Link} to={`/${user.role.toLowerCase()}/dashboard`}>
              <DashboardIcon sx={{ mr: 1 }} />
              <ListItemText primary={`${user.role} Dashboard`} />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <LoginIcon sx={{ mr: 1 }} />
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <HowToRegIcon sx={{ mr: 1 }} />
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="primary" elevation={4}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left Side */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton edge="start" color="inherit" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                color: "inherit",
                textDecoration: "none",
                ml: isMobile ? 1 : 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <HomeIcon sx={{ mr: 1 }} />
              Job Portal
            </Typography>
          </Box>

          {/* Right Side */}
          {!isMobile && (
            <Box>
              {user ? (
                <>
                  <Tooltip title={`${user.role} Dashboard`}>
                    <Button
                      color="inherit"
                      startIcon={<DashboardIcon />}
                      component={Link}
                      to={`/${user.role.toLowerCase()}/dashboard`}
                      sx={{ textTransform: "capitalize", mr: 2 }}
                    >
                      {user.role}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Account">
                    <IconButton onClick={handleMenuClick}>
                      <Avatar sx={{ bgcolor: "#fff", color: "#1976d2" }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={menuAnchor}
                    open={openMenu}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2">{user.email}</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    startIcon={<LoginIcon />}
                    component={Link}
                    to="/login"
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={<HowToRegIcon />}
                    component={Link}
                    to="/register"
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
