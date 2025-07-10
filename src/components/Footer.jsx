// src/components/Footer.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      py: 2,
      px: 2,
      mt: "auto",
      backgroundColor: (theme) => theme.palette.grey[200],
      textAlign: "center",
    }}
  >
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Job Portal. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;
