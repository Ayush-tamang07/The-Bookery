import React from "react";
import { useNavigate } from "react-router-dom";

// Sample book data
const books = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: "Atomic Habits",
  author: "James Clear",
  price: "Rs. 899",
  isbn: `87${i}`,
  rating: "4.8 ★",
  image: "https://m.media-amazon.com/images/I/91bYsX41DVL._SL1500_.jpg",
}));

const BooksPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-gray-800 font-sans pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-emerald-600 shadow sticky top-0 z-20 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">📚 Books</h1>
        <div className="text-sm flex items-center gap-2 text-white cursor-pointer">
          <span>Filters</span>
          <i className="fas fa-sliders-h text-lg"></i>
        </div>
      </header>

      {/* Book Grid */}
      <section className="px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-4 cursor-pointer"
              onClick={() => navigate(`/book/${book.id}`)}
            >
              <img
                src={book.image}
                alt={book.title}
                className="h-40 w-full object-cover rounded-md mb-3"
              />
              <h3 className="text-sm font-semibold">{book.title}</h3>
              <p className="text-xs text-gray-600">{book.author}</p>
              <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
              <p className="text-xs text-green-700 font-medium">{book.price}</p>
              <p className="text-xs text-yellow-600">{book.rating}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-cyan-700 to-teal-600 text-white border-t shadow-md z-10">
        <div className="flex justify-around py-3 text-sm">
          {[
            { label: "Home", icon: "fas fa-home", path: "/home" },
            { label: "Books", icon: "fas fa-book", path: "/books" },
            { label: "Cart", icon: "fas fa-shopping-cart" },
            { label: "Profile", icon: "fas fa-user" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center cursor-pointer hover:text-yellow-300 transition"
              onClick={() => item.path && navigate(item.path)}
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

export default BooksPage;
