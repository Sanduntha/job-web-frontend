import React, { useState } from 'react';
import API from '../api/api';

export default function EmployerForm() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    contactNumber: '',
    companyName: ''
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/employers', form);
      alert('Employer saved: ' + JSON.stringify(res.data));
    } catch {
      alert('Error saving employer');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Employer Form</h3>
      <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
      <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
      <input placeholder="Contact Number" value={form.contactNumber} onChange={e => setForm({ ...form, contactNumber: e.target.value })} required />
      <input placeholder="Company Name" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required />
      <button type="submit">Save Employer</button>
    </form>
  );
}
