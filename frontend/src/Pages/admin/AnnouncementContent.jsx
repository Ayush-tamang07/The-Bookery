import { useEffect, useState } from "react";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";

function AnnouncementContent() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get("/announcement/getannouncementsbyadmin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response?.data;
        console.log("Fetched announcements:", data);
        if (Array.isArray(data)) {
          setAnnouncements(data);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      }
    };
    fetchAnnouncements();
  }, []);

  const promptDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/announcement/deleteAnnouncement/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnnouncements(prevAnnouncements =>
        prevAnnouncements.filter(a => a.announcementId !== selectedId)
      );
      toast.success("Announcement deleted successfully!");
    } catch (error) {
      console.error("Failed to delete announcement", error);
      toast.error("Error deleting announcement");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/admin/add-announcement")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center"
        >
          <FaPlus size={18} className="mr-1" />
          Add Announcement
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Message</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Start Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">End Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Created At</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Is Active</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a.announcementId} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{a.message}</td>
                <td className="py-3 px-4">{new Date(a.startTime).toLocaleString()}</td>
                <td className="py-3 px-4">{new Date(a.endTime).toLocaleString()}</td>
                <td className="py-3 px-4">{new Date(a.createdAt).toLocaleString()}</td>
                <td className="py-3 px-4">{a.isActive ? "True" : "False"}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/announcement/update-announcement/${a.announcementId}`, { state: { announcement: a } })}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button 
                      onClick={() => promptDelete(a.announcementId)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (you can customize or remove) */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing 1 to {announcements.length} of {announcements.length} entries
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Next</button>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this announcement?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedId(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnnouncementContent;
