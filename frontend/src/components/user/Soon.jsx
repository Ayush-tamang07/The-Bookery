import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";

const Soon = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComingSoonBooks = async () => {
      try {
        const res = await apiClient.get("/book/commingsoon");
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        if (data.length === 0) {
          toast.info("No upcoming books found.");
        }

        setBooks(data);
      } catch (err) {
        console.error("Error fetching coming soon books:", err);
        toast.error("Failed to load coming soon books.");
      } finally {
        setLoading(false);
      }
    };

    fetchComingSoonBooks();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-600">
        Loading coming soon books...
      </p>
    );
  }

  if (books.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">No books coming soon.</p>
    );
  }

  return (
    <div className="mt-20 mb-24 px-6 sm:px-8 lg:px-20">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Coming Soon Books
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.bookId}
            className="bg-white border border-gray-100 rounded-lg overflow-hidden w-72 shadow hover:shadow-lg transition relative"
          >
            {/* Book Image */}
            <div className="w-full h-56 overflow-hidden relative">
              <img
                src={book.image || "/placeholder.jpg"}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                Coming Soon
              </div>
            </div>

            {/* Book Info */}
            <div className="p-4 flex flex-col justify-between h-44">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  {book.author}
                </p>
                <h2 className="font-semibold text-gray-900 text-lg truncate">
                  {book.title}
                </h2>
                <div className="mt-2 text-gray-700 font-medium text-sm">
                  ₹{book.price}
                </div>
              </div>

              {/* Coming Soon Button */}
              <div className="mt-4 flex justify-center">
                <button
                  disabled
                  className="bg-web-primary text-white text-sm py-2 px-4 rounded-md font-medium flex items-center space-x-2 
    transition-colors hover:bg-web-accent focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Soon;
