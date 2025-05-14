import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BookCard from "../../components/user/BookCard";
import apiClient from "../../api/axios";

const BestSellers = ({ limit }) => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await apiClient.get("/book/bestSeller");
        const raw = response.data;

        if (Array.isArray(raw.data)) {
          const extractedBooks = raw.data.map((item) => item.book);
          setBooks(limit ? extractedBooks.slice(0, limit) : extractedBooks);
        } else {
          toast.error("Unexpected best seller response format.");
          setBooks([]);
        }
      } catch (error) {
        console.error("Error fetching best seller books:", error);
        toast.error("Failed to load best seller books.");
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
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
      <p className="text-center py-10 text-gray-600">Loading best sellers...</p>
    );
  }

  if (books.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No best seller books found.
      </p>
    );
  }

  return (
    <div className="mt-12 mb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-6">
        {books.map((book) => (
          <BookCard
            key={book.bookId}
            title={book.title}
            author={book.author}
            price={book.price}
            discountPercent={book.discount}
            startDate={book.startDate}
            endDate={book.endDate}
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
    </div>
  );
};

export default BestSellers;
