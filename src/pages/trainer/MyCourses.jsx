import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';

const MyCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (user?.id) {
      axios.get(`/courses/trainer/${user.id}`).then((res) => setCourses(res.data));
    }
  }, [user?.id]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/courses/${id}`);
      setCourses(courses.filter((c) => c.id !== id));
      Swal.fire('Deleted', 'Course removed.', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data || 'Delete failed', 'error');
    }
  };

  return (
    <Box p={4} display="grid" gap={3}>
      {courses.map((course) => (
        <Card key={course.id} variant="outlined" sx={{ p: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {course.title}
            </Typography>
            <Typography paragraph>{course.description}</Typography>
            <Typography variant="caption" display="block" gutterBottom>
              Duration: {course.duration}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(course.id)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MyCourses;
