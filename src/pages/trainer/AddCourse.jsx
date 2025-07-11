import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import Swal from "sweetalert2";

const AddCourse = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: "",
    duration: "",
    description: "",
    fee: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      Swal.fire("Error", "You must be logged in as Trainer", "error");
      return;
    }

    try {
      await axiosInstance.post("/courses", {
        title: form.title,
        duration: form.duration,
        description: form.description,
        fee: Number(form.fee),
        trainerId: user.id,
      });

      Swal.fire("Success", "Course added successfully", "success");
      setForm({ title: "", duration: "", description: "", fee: "" });
    } catch (error) {
      Swal.fire("Error", error.response?.data || "Failed to add course", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <input
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      />
      <input
        name="fee"
        type="number"
        placeholder="Fee"
        value={form.fee}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Course</button>
    </form>
  );
};

export default AddCourse;
