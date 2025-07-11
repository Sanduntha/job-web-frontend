import React from "react";
import { Box, Typography, Container, Link, Fade } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4, 2),
  marginTop: "auto",
  background: "linear-gradient(180deg, #f0f4f8, #d9e2ec)",
  textAlign: "center",
  borderTop: `1px solid ${theme.palette.grey[300]}`,
  boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.05)",
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  margin: theme.spacing(0, 1),
  fontWeight: 500,
  transition: "color 0.3s ease, transform 0.3s ease",
  "&:hover": {
    color: theme.palette.primary.dark,
    transform: "translateY(-2px)",
  },
}));

const Footer = () => (
  <StyledFooter component="footer">
    <Container maxWidth="lg">
      <Fade in={true} timeout={800}>
        <Box>
          <Typography 
            variant="h6" 
            color="text.primary" 
            className="font-bold text-gray-800"
            gutterBottom
          >
            Job Portal
          </Typography>
          <Box sx={{ mb: 2 }}>
            <StyledLink href="https://twitter.com" target="_blank" rel="noopener">
              Twitter
            </StyledLink>
            <StyledLink href="https://linkedin.com" target="_blank" rel="noopener">
              LinkedIn
            </StyledLink>
            <StyledLink href="https://github.com" target="_blank" rel="noopener">
              GitHub
            </StyledLink>
          </Box>
          <Typography 
            variant="body2" 
            color="text.secondary"
            className="text-gray-600"
          >
            © {new Date().getFullYear()} Job Portal. All rights reserved.
          </Typography>
        </Box>
      </Fade>
    </Container>
  </StyledFooter>
);

export default Footer;