import React, { useState } from 'react';
import API from '../api/api';

export default function JobForm({ employerId }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    salary: '',
    location: ''
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post(`/jobs/${employerId}`, form);
      alert('Job posted: ' + JSON.stringify(res.data));
    } catch {
      alert('Error posting job');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Job Form</h3>
      <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
      <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
      <input placeholder="Salary" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} required />
      <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
      <button type="submit">Post Job</button>
    </form>
  );
}
