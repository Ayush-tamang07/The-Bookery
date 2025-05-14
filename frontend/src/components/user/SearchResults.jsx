import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookCard from "../../components/user/BookCard";
import apiClient from "../../api/axios";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/search/searchbook", {
        params: {
          query,
          genre,
          language,
          minPrice,
          maxPrice,
          sortBy,
          sortDir,
        },
      });
      setBooks(response.data.data || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (genre) params.set("genre", genre);
    if (language) params.set("language", language);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortDir) params.set("sortDir", sortDir);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="pt-32 px-6 md:px-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Search Results
        </h1>

        {/* Filter Options */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Scifi">Sci-fi</option>
            <option value="Education">Education</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Languages</option>
            <option value="English">English</option>
            <option value="Nepali">Nepali</option>
            <option value="Chinese">Chinese</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Sort By</option>
            <option value="price">Price</option>
          </select>
          <select
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-600">No books found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.bookId}
              title={book.title}
              author={book.author}
              price={book.price}
              discountPercent={book.discount}
              image={book.image}
              onAddToCart={() => {}}
              onBookmarkClick={() => {}}
              onViewDetail={() => navigate(`/book/${book.bookId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
