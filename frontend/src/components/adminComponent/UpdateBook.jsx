import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";

function UpdateBook() {
  const { bookId: id } = useParams();
  const location = useLocation();
  const bookFromState = location.state?.book;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    publishDate: "",
    publisher: "",
    language: "",
    format: "",
    isbn: "",
    price: "",
    quantity: "",
    awardWinner: "",
    image: "", // New state for image
  });

  // Handle image file change for preview
  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files && files[0]) {
      // Create a URL for preview
      const imageUrl = URL.createObjectURL(files[0]);
      setFormData((prev) => ({
        ...prev,
        image: files[0], // Store the file object for sending to the server
        previewImage: imageUrl, // Store the preview URL
      }));
    }
  };

  useEffect(() => {
    const populateForm = (book) => {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        description: book.description || "",
        genre: book.genre || "",
        publishDate: book.publishDate ? book.publishDate.split("T")[0] : "",
        publisher: book.publisher || "",
        language: book.language || "",
        format: book.format || "",
        isbn: book.isbn || "",
        price: book.price || "",
        quantity: book.quantity || "",
        awardWinner: book.awardWinner?.toString() || "",
        image: book.image || "", // Set the current image URL
      });
    };

    if (bookFromState) {
      populateForm(bookFromState);
    } else {
      const fetchBook = async () => {
        try {
          const response = await apiClient.get(`/admin/book/${id}`);
          populateForm(response.data.data);
        } catch (error) {
          console.error("Failed to fetch book", error);
        }
      };
      fetchBook();
    }
  }, [id, bookFromState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = new FormData(); // Use FormData for file uploads
    Object.keys(formData).forEach((key) => {
      if (key === "image" || key === "previewImage") return; // Skip these keys
      if (key === "publishDate" && formData.publishDate) {
        updatedData.append("publishDate", new Date(formData.publishDate).toISOString()); // Ensure UTC
      } else {
        updatedData.append(key, formData[key]);
      }
    });

    if (formData.image) {
      updatedData.append("images", formData.image); // Correct key for backend
    }

    try {
      await apiClient.put(`/admin/updateBook/${id}`, updatedData, {
        headers: {
          // Remove the 'Content-Type' header here
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Book updated successfully!");
      navigate("/admin/book");
    } catch (error) {
      console.error("Error updating book", error?.response?.data || error);
      toast.error("Failed to update book");
    }
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Book</h2>
        <div className="flex justify-between">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back
          </button>
        </div>
        <form onSubmit={handleUpdate} className="space-y-6">
          {[
            { label: "Title", name: "title" },
            { label: "Author", name: "author" },
            { label: "Publisher", name: "publisher" },
            { label: "ISBN", name: "isbn" },
            { label: "Price", name: "price", type: "number" },
            { label: "Quantity", name: "quantity", type: "number" },
            { label: "Publish Date", name: "publishDate", type: "date" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Award Winner
            </label>
            <select
              name="awardWinner"
              value={formData.awardWinner}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select genre</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="science-fiction">Science Fiction</option>
              <option value="fantasy">Fantasy</option>
              <option value="mystery">Mystery</option>
              <option value="biography">Biography</option>
              <option value="history">History</option>
              <option value="self-help">Self-Help</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Format
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select format</option>
              <option value="hardcover">Hardcover</option>
              <option value="paperback">Paperback</option>
              <option value="ebook">E-Book</option>
              <option value="audiobook">Audiobook</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded-md"
            >
              <option value="">Select language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          {/* Image Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Image
            </label>
            {/* Show preview image if available */}
            {formData.previewImage ? (
              <img
                src={formData.previewImage}
                alt="Book cover preview"
                className="w-24 h-32 object-cover mb-3"
              />
            ) : (
              formData.image && (
                <img
                  src={formData.image}
                  alt="Book cover"
                  className="w-24 h-32 object-cover mb-3"
                />
              )
            )}
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full border border-gray-300 p-2 rounded-md"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateBook;
