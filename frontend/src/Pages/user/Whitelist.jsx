import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import BookCard from "../../components/user/BookCard";
import { toast } from "react-toastify";

const Whitelist = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await apiClient.get("/bookmark/getbookmark", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setBookmarks(response.data || []);
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
        setError("Failed to fetch bookmarks.");
        toast.error("Could not load your whitelist.");
      }
    };

    fetchBookmarks();
  }, []);

  const handleViewDetail = (bookId) => {
    window.location.href = `/book/${bookId}`;
  };

  const handleBookmarkClick = async (e, book) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    try {
      await apiClient.delete(`/bookmark/removebookmark/${book.bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`"${book.title}" removed from bookmarks!`);
      setBookmarks((prev) => prev.filter((b) => b.bookId !== book.bookId));
    } catch (err) {
      console.error("Error removing bookmark:", err);
      toast.error("Failed to remove from whitelist.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f6f1] pt-24 px-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Whitelist</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {bookmarks.length === 0 ? (
        <p className="text-gray-600">
          You haven’t added any books to your whitelist yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bookmarks.map((book) => (
            <BookCard
              key={book.bookId}
              title={book.title}
              author={book.author}
              price={book.price}
              discountPercent={book.discount}
              image={book.image || "/placeholder.jpg"}
              isBookmarked={true}
              onViewDetail={() => handleViewDetail(book.bookId)}
              onBookmarkClick={(e) => handleBookmarkClick(e, book)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Whitelist;
