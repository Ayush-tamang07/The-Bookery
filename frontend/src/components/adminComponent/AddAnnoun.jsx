import React, { useState } from "react";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddAnnoun = () => {
  const [formData, setFormData] = useState({
    message: "",
    startTime: "",
    endTime: "",
    isActive: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        toast.error("End time must be after start time.");
        return;
      }

      // Convert datetime-local values to UTC ISO strings
      const utcFormData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      };

      console.log("Payload being sent:", utcFormData);

      const response = await apiClient.post(
        "/announcement/addannouncement",
        utcFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Announcement added successfully!");
      console.log("Announcement added:", response.data);
      navigate("/admin/announcement");
    } catch (error) {
      console.error("Failed to add announcement:", error);
      if (error.response) {
        console.error("Backend response:", error.response.data);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded-md shadow-md">
       <div className="mb-4">
        <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      <h2 className="text-xl font-semibold mb-4">Add Announcement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Is Active</label>
          <select
            name="isActive"
            value={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.value === "true",
              }))
            }
            className="w-full border border-gray-300 p-2 rounded-md"
            required
          >
            <option value="">Select status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Announcement
        </button>
      </form>
    </div>
  );
};

export default AddAnnoun;
