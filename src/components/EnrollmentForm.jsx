import React, { useState } from 'react';
import API from '../api/api';

export default function EnrollmentForm({ courseId }) {
  const [form, setForm] = useState({
    date: '',
    amount: ''
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/enrollments', {
        courseId,
        jobSeekerEmail: localStorage.getItem('jwtToken'),
        date: form.date,
        amount: form.amount
      });
      alert('Enrollment successful: ' + JSON.stringify(res.data));
    } catch (err) {
      console.error('Error enrolling:', err);
      alert('Error enrolling');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Course Enrollment</h3>
      <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
      <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
      <button type="submit">Enroll</button>
    </form>
  );
}
