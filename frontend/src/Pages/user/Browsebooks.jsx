import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";
import BookCard from "../../components/user/BookCard";

const Browsebooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await apiClient.get("/user/getbook");
        if (Array.isArray(response.data)) {
          setBooks(response.data);
        } else if (Array.isArray(response.data.data)) {
          setBooks(response.data.data);
        } else {
          setError("Unexpected data format from server");
          setBooks([]);
        }
      } catch (error) {
        console.error("Failed to load books:", error);
        setError("Failed to fetch books");
        setBooks([]);
      }
    };

    fetchBooks();
  }, []);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const handleAddToCart = async (book, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add to cart.");
      return;
    }

    const payload = { bookId: book.bookId, quantity: 1 };

    try {
      await apiClient.post("/user/addtocart", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      toast.success(`${book.title} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart.");
    }
  };

  const handleBookmarkClick = async (book, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      toast.error("Please login to bookmark.");
      return;
    }

    if (book.isBookmarked && book.bookmarkId) {
      try {
        await apiClient.delete(`/bookmark/deletebookmark/${book.bookmarkId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(`"${book.title}" removed from bookmarks!`);
        setBooks((prev) =>
          prev.map((b) =>
            b.bookId === book.bookId
              ? { ...b, isBookmarked: false, bookmarkId: null }
              : b
          )
        );
      } catch (error) {
        console.error("Error removing bookmark:", error);
        toast.error("Failed to remove bookmark.");
      }
      return;
    }

    try {
      const response = await apiClient.post(
        "/bookmark/addbookmark",
        {
          userId,
          bookId: book.bookId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const bookmarkId = response.data.bookmarkId;
      toast.success(`"${book.title}" added to bookmarks!`);
      setBooks((prev) =>
        prev.map((b) =>
          b.bookId === book.bookId
            ? { ...b, isBookmarked: true, bookmarkId }
            : b
        )
      );
    } catch (error) {
      console.error("Error bookmarking book:", error);
      toast.error("Already added to Whitelist.");
    }
  };

  const handleViewDetail = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const Pagination = () => (
    <div className="flex justify-center mt-8 gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={`px-3 py-1 rounded border ${
            currentPage === i + 1
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-[#f9f6f1] min-h-screen pt-28 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 mt-20">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse Books</h2>
        {error && (
          <div className="text-red-600 font-semibold mb-6">{error}</div>
        )}
        {books.length === 0 ? (
          <p className="text-gray-600">No books found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-6">
              {currentBooks.map((book) => (
                <BookCard
                  title={book.title}
                  author={book.author}
                  price={book.price}
                  discountPercent={book.discount}
                  startDate={book.startDate}
                  endDate={book.endDate}
                  image={book.image}
                  isBookmarked={book.isBookmarked}
                  averageRating={book.averageRating}
                  totalReviews={book.totalReviews}
                  onAddToCart={(e) => handleAddToCart(book, e)}
                  onBookmarkClick={(e) => handleBookmarkClick(book, e)}
                  onViewDetail={() => handleViewDetail(book.bookId)}
                  quantity={book.quantity} // Pass the correct quantity value
                />
              ))}
            </div>
            <Pagination />
          </>
        )}
      </div>
    </div>
  );
};

export default Browsebooks;
