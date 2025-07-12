import React, { useState } from 'react';
import API from '../api/api';

export default function CourseForm({ trainerId }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    fee: ''
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post(`/courses/${trainerId}`, form);
      alert('Course created: ' + JSON.stringify(res.data));
    } catch {
      alert('Error creating course');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Course Form</h3>
      <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
      <input placeholder="Duration" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required />
      <input placeholder="Fee" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} required />
      <button type="submit">Create Course</button>
    </form>
  );
}
