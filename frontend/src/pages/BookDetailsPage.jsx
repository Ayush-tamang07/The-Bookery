import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const books = Array.from({ length: 12 }, (_, i) => ({
  id: (i + 1).toString(),
  title: "Atomic Habits",
  author: "James Clear",
  price: "Rs. 899",
  isbn: `87${i}`,
  rating: "4.8 ★",
  image: "https://m.media-amazon.com/images/I/91bYsX41DVL._SL1500_.jpg",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since...",
}));

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = books.find((b) => b.id === id);

  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [submittedReviews, setSubmittedReviews] = useState([]);

  if (!book) return <div className="p-6 text-red-500">Book not found.</div>;

  return (
    <div className="min-h-screen bg-[#FAF6EF] font-sans pb-24">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-20 p-4 text-center text-2xl font-bold text-[#3A4F41]">
        {book.title}
      </header>

      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Image */}
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-80 object-cover rounded-lg"
        />

        {/* Book Info */}
        <div className="space-y-4">
          <p className="text-gray-800">{book.description}</p>
          <p className="text-lg font-semibold">{book.price}</p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-sm">Quantity</span>
            <button
              className="border px-2"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              className="border px-2"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          <button className="bg-green-800 text-white py-2 px-6 rounded hover:bg-green-900 transition">
            Add to cart
          </button>
        </div>
      </div>

      {/* Book Details */}
      <section className="px-6 mt-8">
        <h3 className="font-semibold text-lg mb-2">Book Details</h3>
        <p className="text-sm text-gray-700">
          ISBN: {book.isbn} | Author: {book.author}
        </p>
      </section>

      {/* Review Section */}
      <section className="px-6 mt-6">
        <h3 className="font-semibold text-lg mb-2">Add Your Review</h3>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (reviewText.trim()) {
              setSubmittedReviews((prev) => [
                ...prev,
                { rating, text: reviewText },
              ]);
              setReviewText("");
              setRating(5);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-sm font-medium block mb-1">Your Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="border p-2 rounded w-24"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Your Review:</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded"
              placeholder="Write your feedback..."
            />
          </div>

          <button
            type="submit"
            className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-900"
          >
            Submit Review
          </button>
        </form>

        {submittedReviews.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-gray-700">User Reviews</h4>
            {submittedReviews.map((rev, idx) => (
              <div
                key={idx}
                className="bg-white p-3 rounded shadow text-sm"
              >
                <p className="font-medium text-yellow-600 mb-1">{rev.rating} ★</p>
                <p className="text-gray-700">{rev.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-10">
        <div className="flex justify-around py-3 text-sm text-gray-600">
          {[
            { label: "Home", icon: "fas fa-home", path: "/home" },
            { label: "Books", icon: "fas fa-book", path: "/books" },
            { label: "Cart", icon: "fas fa-shopping-cart", path: "/cart" },
            { label: "Profile", icon: "fas fa-user", path: "/profile" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center cursor-pointer hover:text-green-700 transition"
              onClick={() => navigate(item.path)}
            >
              <i className={`${item.icon} text-lg`}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default BookDetailsPage;
