import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const TrainerDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    duration: "",
    description: "",
    fee: "",
  });
  const [trainerId, setTrainerId] = useState(null);

  useEffect(() => {
    const loadTrainerProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/trainers/user/${user.id}`);
        localStorage.setItem("trainerId", res.data.id);
        setTrainerId(res.data.id);
      } catch (err) {
        alert("Trainer profile not found. Please register first.");
      }
    };

    const fetchCoursesWithEarnings = async (trainerId) => {
      try {
        // Fetch courses with enrollment counts and total amounts
        const res = await axios.get(`http://localhost:8081/api/courses/trainer/${trainerId}/earnings`);
        setCourses(res.data);
      } catch (err) {
        alert("Failed to load courses or earnings");
      }
    };

    if (user?.id) {
      loadTrainerProfile().then(() => {
        const id = localStorage.getItem("trainerId");
        if (id) fetchCoursesWithEarnings(id);
      });
    }
  }, [user?.id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!trainerId) {
      alert("Trainer ID not found. Please refresh or re-login.");
      return;
    }

    try {
      await axios.post("http://localhost:8081/api/courses", {
        trainerId,
        title: form.title,
        duration: form.duration,
        description: form.description,
        fee: parseFloat(form.fee),
      });

      alert("Course added!");
      setForm({ title: "", duration: "", description: "", fee: "" });

      // refresh courses + earnings after adding a course
      const res = await axios.get(`http://localhost:8081/api/courses/trainer/${trainerId}/earnings`);
      setCourses(res.data);
    } catch (err) {
      alert("Failed to add course");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>Trainer Dashboard</h2>

      <h3>Add a new course</h3>
      <form onSubmit={handleAddCourse}>
        <input
          name="title"
          placeholder="Course Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="duration"
          placeholder="Duration"
          value={form.duration}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          name="fee"
          placeholder="Course Fee"
          type="number"
          value={form.fee}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Course</button>
      </form>

      <h3>Your Courses and Earnings</h3>
      <ul>
        {courses.length === 0 && <p>No courses available.</p>}
        {courses.map((course) => (
          <li key={course.id}>
            <strong>Course:</strong> {course.title} <br />
            <strong>Duration:</strong> {course.duration} <br />
            <strong>Description:</strong> {course.description} <br />
            <strong>Fee:</strong> LKR {course.fee} <br />
            <strong>Enrollments:</strong> {course.enrollmentCount || 0} <br />
            <strong>Total Revenue:</strong> LKR {course.totalAmount || 0}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainerDashboard;
