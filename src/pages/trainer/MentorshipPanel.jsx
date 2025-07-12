import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const MentorshipPanel = () => {
  return (
    <Box p={4}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mentorship Panel
          </Typography>
          <Typography>
            This section can be expanded to support live Q&A, video calls, or discussion threads.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MentorshipPanel;
