import React, { useState } from 'react';
import axios from '../../axios';
import { TextField, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const CreateCourse = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ title: '', description: '', duration: '', courseFee: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/courses', { ...form, trainerId: user.id });
      Swal.fire('Success', 'Course created!', 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data || 'Failed to create course', 'error');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Typography variant="h6">Create Course</Typography>
      <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
        <TextField name="title" label="Title" onChange={handleChange} required fullWidth />
        <TextField name="description" label="Description" multiline rows={4} onChange={handleChange} required fullWidth />
        <TextField name="duration" label="Duration" onChange={handleChange} required fullWidth />
        <TextField name="courseFee" label="Course Fee" type="number" onChange={handleChange} required fullWidth />
        <Button type="submit" variant="contained">Create</Button>
      </form>
    </div>
  );
};

export default CreateCourse;