import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardNav = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();

  const navMap = {
    admin: [
      { label: 'Admin Panel', path: '/admin' },
      { label: 'Manage Users', path: '/admin/manage-users' },
      { label: 'Manage Jobs', path: '/admin/manage-jobs' },
    ],
    employer: [
      { label: 'Dashboard', path: '/employer/dashboard' },
      { label: 'Post Job', path: '/employer/post-job' },
      { label: 'My Jobs', path: '/employer/jobs' },
    ],
    jobseeker: [
      { label: 'Dashboard', path: '/jobseeker/dashboard' },
      { label: 'Jobs', path: '/jobseeker/jobs' },
      { label: 'Upload Resume', path: '/jobseeker/upload-resume' },
    ],
    trainer: [
      { label: 'Dashboard', path: '/trainer/dashboard' },
      { label: 'Create Course', path: '/trainer/create-course' },
      { label: 'My Courses', path: '/trainer/my-courses' },
    ],
  };

  return (
    <div className="p-4">
      <ButtonGroup>
        {navMap[role]?.map((btn) => (
          <Button key={btn.path} onClick={() => navigate(btn.path)}>{btn.label}</Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default DashboardNav;
