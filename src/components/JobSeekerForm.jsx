import React, { useState } from 'react';
import API from '../api/api';

export default function JobSeekerForm() {
  const [form, setForm] = useState({
    name: '',
    jobCategory: '',
    skill: '',
    contactNumber: ''
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/jobseekers', form);
      alert('Job Seeker saved: ' + JSON.stringify(res.data));
    } catch {
      alert('Error saving job seeker');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Job Seeker Form</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Job Category" value={form.jobCategory} onChange={e => setForm({ ...form, jobCategory: e.target.value })} required />
      <input placeholder="Skill" value={form.skill} onChange={e => setForm({ ...form, skill: e.target.value })} required />
      <input placeholder="Contact Number" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} required />
      <button type="submit">Save Job Seeker</button>
    </form>
  );
}
