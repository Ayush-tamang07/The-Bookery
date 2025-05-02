import React from "react";
import { useNavigate } from "react-router-dom";

// Dummy book data
const books = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  title: "Atomic Habits",
  author: "James Clear",
  price: "Rs. 899",
  isbn: `87${i}`,
  rating: "4.8 ★",
  image: "https://m.media-amazon.com/images/I/91bYsX41DVL._SL1500_.jpg",
}));

const SectionTitle = ({ children }) => (
  <h2 className="text-xl font-semibold mb-4 text-[#ffffff] border-b-2 border-white inline-block">
    {children}
  </h2>
);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-[#f0f9f4] to-[#FAF6EF] min-h-screen pb-24 font-sans">
      {/* Colorful Header */}
      <header className="bg-gradient-to-r from-[#2D4739] to-[#4CAF50] py-6 text-center text-3xl font-bold text-white shadow-md">
        📖 Welcome to <span className="text-yellow-300">The Bookery</span>
      </header>

      {/* Hero */}
      <section
        className="relative h-72 bg-center bg-cover m-6 rounded-3xl overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1050&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center px-6">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            Find Your Next Great Read 📚
          </h1>
        </div>
      </section>

      {/* Best Seller Section */}
      <section className="px-6 mt-6">
        <SectionTitle>🔥 Best Sellers</SectionTitle>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => navigate(`/book/${book.id}`)}
              className="bg-white border border-green-100 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 w-48 flex-shrink-0 cursor-pointer"
            >
              <img
                src={book.image}
                alt={book.title}
                className="h-40 w-full object-cover rounded-t-2xl"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm text-[#2D4739]">{book.title}</h3>
                <p className="text-xs text-gray-600">{book.author}</p>
                <p className="text-xs">ISBN: {book.isbn}</p>
                <p className="text-sm text-green-700 font-semibold">{book.price}</p>
                <p className="text-xs text-yellow-600">{book.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Award Winner Section */}
      <section className="px-6 mt-10">
        <SectionTitle>🏆 Award Winners</SectionTitle>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => navigate(`/book/${book.id}`)}
              className="bg-white border border-yellow-100 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 w-48 flex-shrink-0 cursor-pointer"
            >
              <img
                src={book.image}
                alt={book.title}
                className="h-40 w-full object-cover rounded-t-2xl"
              />
              <div className="p-3">
                <h3 className="font-semibold text-sm text-[#3A4F41]">{book.title}</h3>
                <p className="text-xs text-gray-600">{book.author}</p>
                <p className="text-xs">ISBN: {book.isbn}</p>
                <p className="text-sm text-green-700 font-semibold">{book.price}</p>
                <p className="text-xs text-yellow-600">{book.rating}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Colorful Footer */}
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

export default HomePage;
