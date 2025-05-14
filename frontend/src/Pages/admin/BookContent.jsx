import { useEffect, useState } from "react";
import { FaPlus, FaFilter, FaEdit, FaTrashAlt, FaBook, FaSearch, FaSort, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";

function BookContent() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [discountForm, setDiscountForm] = useState({ discount: "", startDate: "", endDate: "" });
  // Confirmation modal state
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get("/admin/getbook", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Books response:", response.data);
        const booksData = response?.data?.data;
        console.log("Books data:", booksData);
        if (Array.isArray(booksData)) {
          setBooks(booksData);
        } else {
          console.error("Expected 'data' to be an array, but got:", booksData);
          setBooks([]);
        }
      } catch (error) {
        console.error("Failed to fetch books", error);
      }
    };

    fetchBooks();
  }, []);

  // Prompt for delete confirmation
  const promptDelete = (id) => {
    setSelectedBookId(id);
    setShowConfirm(true);
  };

  // Delete handler (after confirmation)
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/admin/deleteBook/${selectedBookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBooks(prevBooks => prevBooks.filter(book => book.bookId !== selectedBookId));
      toast.success("Book deleted successfully!");
    } catch (error) {
      console.error("Failed to delete book", error);
      toast.error("Error deleting book");
    } finally {
      setShowConfirm(false);
      setSelectedBookId(null);
    }
  };

  const toggleExpandRow = (id) => {
    if (expandedRow === id) {
      setExpandedRow(null);
    } else {
      setExpandedRow(id);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => navigate("/admin/add-book")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <FaPlus size={16} className="mr-2" />
            Add Book
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <FaBook className="text-blue-600 mr-3" size={20} />
            <h2 className="text-lg font-medium text-gray-800">Book Inventory</h2>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
            {filteredBooks.length} Books
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 text-left">Title & Details</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <>
                    <tr key={book.bookId} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleExpandRow(book.bookId)}>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-12 mr-4">
                            <img src={book.image} alt={book.title} className="w-12 h-16 object-cover rounded shadow" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{book.title}</div>
                            <div className="text-sm text-gray-500">By {book.author}</div>
                            <div className="text-xs text-gray-400">ISBN: {book.isbn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-800">
                          {book.genre}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium">Rs {book.price}</div>
                        {book.discount > 0 && (
                          <div className="text-xs text-green-600">{book.discount}% off</div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          book.quantity > 10 
                            ? "bg-green-100 text-green-800" 
                            : book.quantity > 0 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                        }`}>
                          {book.quantity > 0 ? `${book.quantity} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/book/update-book/${book.bookId}`, { state: { book } });
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                            title="Edit Book"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              promptDelete(book.bookId);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                            title="Delete Book"
                          >
                            <FaTrashAlt size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBookId(book.bookId);
                              setShowDiscountModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                            title="Add Discount"
                          >
                            <FaTag size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRow === book.bookId && (
                      <tr className="bg-gray-50">
                        <td colSpan="8" className="py-4 px-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <h4 className="font-medium text-gray-700 mb-2">Book Details</h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-gray-500">Publisher:</div>
                                <div>{book.publisher}</div>
                                <div className="text-gray-500">Language:</div>
                                <div>{book.language}</div>
                                <div className="text-gray-500">Format:</div>
                                <div>{book.format}</div>
                                <div className="text-gray-500">Published:</div>
                                <div>{book.publishDate ? new Date(book.publishDate).toLocaleDateString() : "N/A"}</div>
                                <div className="text-gray-500">Award Winner:</div>
                                <div>{book.awardWinner ? "Yes" : "No"}</div>
                                <div className="text-gray-500">Start Date:</div>
                                <div>{book.startDate ? new Date(book.startDate).toLocaleDateString() : "N/A"}</div>
                                <div className="text-gray-500">End Date:</div>
                                <div>{book.endDate ? new Date(book.endDate).toLocaleDateString() : "N/A"}</div>
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                              <p className="text-gray-600 line-clamp-3">{book.description}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaBook className="text-gray-300 mb-3" size={24} />
                      <p>No books found matching your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-t border-gray-100">
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">Showing 1 to {filteredBooks.length} of {filteredBooks.length} entries</div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this book?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedBookId(null);
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
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-semibold">Set Discount Offer</h3>
            <div className="space-y-2">
              <input
                type="number"
                placeholder="Discount %"
                className="w-full p-2 border rounded"
                value={discountForm.discount}
                onChange={(e) => setDiscountForm({ ...discountForm, discount: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={discountForm.startDate}
                  onChange={(e) => setDiscountForm({ ...discountForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={discountForm.endDate}
                  onChange={(e) => setDiscountForm({ ...discountForm, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowDiscountModal(false)}>Cancel</button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={async () => {
                  try {
                    const start = new Date(discountForm.startDate);
                    const end = new Date(discountForm.endDate);
                    if (end < start) {
                      toast.error("End date cannot be before start date.");
                      return;
                    }
                    const token = localStorage.getItem("token");
                    await apiClient.put(`/admin/discountoffer/${selectedBookId}`, {
                      discount: parseInt(discountForm.discount),
                      startDate: new Date(discountForm.startDate).toISOString(),
                      endDate: new Date(discountForm.endDate).toISOString()
                    }, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success("Discount offer updated!");
                    setShowDiscountModal(false);
                  } catch (error) {
                    toast.error("Failed to update discount");
                    console.error("Discount update error:", error);
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookContent;