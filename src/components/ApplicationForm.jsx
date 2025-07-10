import React, { useState } from 'react';
import API from '../api/api';

export default function ApplicationForm({ jobId }) {
  const [form, setForm] = useState({ introduction: '' });
  const [cvFile, setCvFile] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('jobSeekerEmail', localStorage.getItem('jwtToken'));
    formData.append('introduction', form.introduction);
    formData.append('cv', cvFile);

    try {
      const res = await API.post('/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Application submitted: ' + JSON.stringify(res.data));
    } catch (err) {
      console.error('Error applying:', err);
      alert('Error applying');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Job Application</h3>
      <textarea placeholder="Introduction" value={form.introduction} onChange={e => setForm({ ...form, introduction: e.target.value })} required />
      <input type="file" accept=".pdf,.doc,.docx" onChange={e => setCvFile(e.target.files[0])} required />
      <button type="submit">Apply</button>
    </form>
  );
}
