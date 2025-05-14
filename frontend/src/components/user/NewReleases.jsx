import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../api/axios";
import BookCard from "./BookCard";

const NewReleases = ({ limit }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const response = await apiClient.get("/book/newreleases");
        const data = response.data;

        let booksList = [];

        if (Array.isArray(data)) {
          booksList = data;
        } else if (Array.isArray(data.data)) {
          booksList = data.data;
        } else {
          setBooks([]);
          setError("Unexpected response format.");
          return;
        }

        // ✅ Apply limit if provided
        setBooks(limit ? booksList.slice(0, limit) : booksList);
      } catch (err) {
        console.error("Error fetching new releases:", err);
        setError("Failed to load new releases.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, [limit]);

  const handleAddToCart = (book, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add to cart.");
      return;
    }

    toast.success(`${book.title} added to cart!`);
  };

  const handleBookmarkClick = (book, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to bookmark.");
      return;
    }

    setBooks((prev) =>
      prev.map((b) =>
        b.bookId === book.bookId
          ? {
              ...b,
              isBookmarked: !b.isBookmarked,
              bookmarkId: b.isBookmarked ? null : Date.now(),
            }
          : b
      )
    );

    toast.success(
      `${book.title} ${
        book.isBookmarked ? "removed from" : "added to"
      } bookmarks!`
    );
  };

  const handleViewDetail = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-600">Loading new releases...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  if (books.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">No new releases found.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-6">
      {books.map((book) => (
        <BookCard
          key={book.bookId}
          title={book.title}
          author={book.author}
          price={book.price}
          discountPercent={book.discount}
          image={book.image || "/placeholder.jpg"}
          onAddToCart={(e) => handleAddToCart(book, e)}
          onBookmarkClick={(e) => handleBookmarkClick(book, e)}
          onViewDetail={() => handleViewDetail(book.bookId)}
          isBookmarked={book.isBookmarked}
          averageRating={book.averageRating}
          totalReviews={book.totalReviews}
        />
      ))}
    </div>
  );
};

export default NewReleases;
