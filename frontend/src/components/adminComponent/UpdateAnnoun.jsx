import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import apiClient from "../../api/axios";
import { toast } from 'react-toastify';

function UpdateAnnoun() {
  const { announcementId:id } = useParams();
  const location = useLocation();
  const annoucementFromState = location.state?.announcement;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    message: '',
    startTime: '',
    endTime: '',
    isActive: '',
  });

  useEffect(() => {
    const populateForm = (announcement) => {
      // Format dates for datetime-local input
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
      };
      
      setFormData({
        message: announcement.message || '',
        startTime: announcement.startTime ? formatDate(announcement.startTime) : '',
        endTime: announcement.endTime ? formatDate(announcement.endTime) : '',
        isActive: announcement.isActive !== undefined ? announcement.isActive.toString() : '',
      });
      
      setLoading(false);
    };

    if (annoucementFromState) {
      populateForm(annoucementFromState);
    } else {
      const fetchAnnouncement = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await apiClient.get(`/announcement/announcement/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          populateForm(response.data.data || response.data);
        } catch (error) {
          console.error("Failed to fetch announcement:", error);
          toast.error("Failed to load announcement data");
          navigate("/admin/announcement");
        }
      };
      
      fetchAnnouncement();
    }
  }, [id, annoucementFromState, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
        toast.error("End time must be after start time.");
        return;
      }
      
      // Convert datetime-local values to UTC ISO strings
      const updatedData = {
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        isActive: formData.isActive === "true",
      };
      
      console.log("Updating with data:", updatedData);
      
      await apiClient.put(`/announcement/updateannouncement/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      toast.success("Announcement updated successfully!");
      navigate("/admin/announcement");
    } catch (error) {
      console.error("Error updating announcement", error?.response?.data || error);
      toast.error("Failed to update announcement");
    }
  };
  
  if (loading) {
    return (
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <p className="text-center">Loading announcement data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6">
      <div className="mb-4">
        <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back
          </button>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Update Announcement</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/announcement")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateAnnoun;