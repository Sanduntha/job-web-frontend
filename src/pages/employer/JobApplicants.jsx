import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from '../../axios';

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f0f4f8',
  minHeight: '100vh',
  fontFamily: "'Roboto', sans-serif",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  background: 'linear-gradient(145deg, #ffffff, #f0f4f8)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #1565c0, #64b5f6)',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Roboto', sans-serif",
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(90deg, #104c91, #4a8fe7)',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
}));

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    axios.get(`/applications/job/${jobId}`).then(res => setApplicants(res.data));
  }, [jobId]);

  return (
    <StyledBox>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 'bold', color: '#1565c0' }}
        className="text-center"
      >
        Applicants for Job #{jobId}
      </Typography>
      {applicants.length === 0 ? (
        <Typography sx={{ fontFamily: "'Roboto', sans-serif", color: '#555', textAlign: 'center', mt: 4 }}>
          No applicants yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {applicants.map(app => (
            <Grid item xs={12} sm={6} md={4} key={app.id}>
              <StyledCard>
                <CardContent>
                  <Typography sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 'bold', color: '#1565c0' }}>
                    Job Seeker ID: {app.jobSeekerId}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Roboto', sans-serif", color: '#555', mt: 1 }}>
                    <strong>Intro:</strong> {app.introduction}
                  </Typography>
                  <StyledButton
                    href={`http://localhost:8081/api/cv/download/${app.cvFile}`}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ mt: 2 }}
                  >
                    Download CV
                  </StyledButton>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}
    </StyledBox>
  );
};

export default JobApplicants;