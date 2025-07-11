// src/pages/employer/JobApplicants.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import { useParams } from 'react-router-dom';

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    axios.get(`/applications/job/${jobId}`).then(res => setApplicants(res.data));
  }, [jobId]);

  return (
    <div>
      <h2>Applicants for Job #{jobId}</h2>
      {applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        applicants.map(app => (
          <div key={app.id} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <p><strong>Job Seeker ID:</strong> {app.jobSeekerId}</p>
            <p><strong>Intro:</strong> {app.introduction}</p>
            <a href={`http://localhost:8081/api/cv/download/${app.cvFile}`} target="_blank" rel="noreferrer">
              Download CV
            </a>
          </div>
        ))
      )}
    </div>
  );
};

export default JobApplicants;
