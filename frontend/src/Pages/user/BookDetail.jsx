import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiClient from "../../api/axios";
import {
  Star,
  Bookmark,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  Calendar,
  BookOpen,
  Globe,
  Book,
} from "lucide-react";
import { toast } from "react-toastify";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const bookRes = await apiClient.get(`/user/getbook/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBook(bookRes.data);

        const reviewRes = await apiClient.get(`/review/getreview/${id}`);
        if (reviewRes.data.success && Array.isArray(reviewRes.data.reviews)) {
          setReviews(reviewRes.data.reviews);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookAndReviews();
  }, [id]);

  const handleQuantityChange = (type) => {
    if (type === "inc") setQuantity((prev) => prev + 1);
    if (type === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!book || book.quantity === 0) return;

    try {
      const token = localStorage.getItem("token");
      const payload = { quantity, bookId: book.bookId };

      const response = await apiClient.post("/user/addtocart", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.success("Book added to cart successfully!");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add book to cart");
    }
  };

  const calculateDiscountedPrice = () => {
    if (!book) return "0.00";
    return (book.price - (book.price * book.discount) / 100).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <p className="text-gray-700">Book not found.</p>
      </div>
    );
  }

  const discountedPrice = calculateDiscountedPrice();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-4 text-sm">
        <p className="text-gray-500">
          Home / Books / {book.genre} / {book.title}
        </p>
      </div>

      <div className="max-w-6xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-10">
          <div className="md:w-1/3">
            <div className="rounded-lg p-6 flex items-center justify-center h-80">
              {book.image ? (
                <img
                  src={book.image}
                  alt={book.title}
                  className="h-full object-contain rounded"
                />
              ) : (
                <BookOpen size={120} className="text-gray-400" />
              )}
            </div>

            <div className="flex justify-between mt-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                <Bookmark size={18} />
                <span className="text-sm">Save</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
                <Share2 size={18} />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="lg:w-3/5">
                <div className="flex items-center">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    {book.format}
                  </span>
                  {book.quantity <= 5 && book.quantity > 0 && (
                    <span className="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                      Low Stock
                    </span>
                  )}
                  {book.quantity === 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                      Out of Stock
                    </span>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
                  {book.title}
                </h1>

                <p className="text-lg text-gray-700 mt-1">
                  by <span className="font-medium">{book.author}</span>
                </p>

                <div className="space-y-3 text-sm text-gray-700 mt-4">
                  <div className="flex items-center gap-2">
                    <Book size={16} className="text-gray-500" />
                    <span>
                      <strong>ISBN:</strong> {book.isbn}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span>
                      <strong>Published:</strong>{" "}
                      {new Date(book.publishDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-gray-500" />
                    <span>
                      <strong>Language:</strong> {book.language}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:w-2/5 mt-6 lg:mt-0">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-baseline mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{discountedPrice}
                    </span>
                    {book.discount > 0 && (
                      <>
                        <span className="ml-2 text-lg line-through text-gray-400">
                          ₹{book.price}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                          {book.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => handleQuantityChange("dec")}
                        disabled={quantity <= 1}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 font-medium">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange("inc")}
                        disabled={book.quantity === 0}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={book.quantity === 0}
                    className="bg-web-primary text-white text-sm py-2 px-4 rounded-md font-medium flex items-center space-x-2 
              transition-colors hover:bg-web-accent focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    <ShoppingCart size={18} />
                    <span>
                      {book.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <div className="flex border-b">
              {["description", "details", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    About this book
                  </h3>
                  <p className="text-gray-700">{book.description}</p>
                </div>
              )}

              {activeTab === "details" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Book Details</h3>
                  {/* Same as before */}
                  {activeTab === "details" && (
                    <div>
                      <h3 className="text-xl font-semibold mb-4"></h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div className="flex flex-col">
                          <span className="text-gray-500">Title</span>
                          <span className="font-medium">{book.title}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500">Author</span>
                          <span className="font-medium">{book.author}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500">ISBN</span>
                          <span className="font-medium">{book.isbn}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500">Publisher</span>
                          <span className="font-medium">{book.publisher}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500">Published Date</span>
                          <span className="font-medium">
                            {new Date(book.publishDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500">Language</span>
                          <span className="font-medium">{book.language}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500">Format</span>
                          <span className="font-medium">{book.format}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-500">Genre</span>
                          <span className="font-medium">{book.genre}</span>
                        </div>
                        {book.pages && (
                          <div className="flex flex-col">
                            <span className="text-gray-500">Pages</span>
                            <span className="font-medium">{book.pages}</span>
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-gray-500">Price</span>
                          <span className="font-medium">₹{book.price}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Customer Reviews
                  </h3>
                  <div className="space-y-6">
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 italic text-center">
                        No reviews yet.
                      </p>
                    ) : (
                      reviews.map((review, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 shadow-sm"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-gray-800">
                              {review.username}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            {review.comment}
                          </p>
                          <div className="flex text-yellow-500">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-4 h-4 fill-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
