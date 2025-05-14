import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Filter, X, ArrowUpDown, BookOpen } from "lucide-react";
import apiClient from "../../api/axios";
import BookCard from "../../components/user/BookCard";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [genre, setGenre] = useState("");
  const [language, setLanguage] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  // Get filter values from URL on initial load
  useEffect(() => {
    setGenre(queryParams.get("genre") || "");
    setLanguage(queryParams.get("language") || "");
    setMinPrice(queryParams.get("minPrice") || "");
    setMaxPrice(queryParams.get("maxPrice") || "");
    setSortBy(queryParams.get("sortBy") || "");
    setSortDir(queryParams.get("sortDir") || "asc");
  }, []);

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
    setShowFilters(false);
  };

  const clearFilters = () => {
    setGenre("");
    setLanguage("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setSortDir("asc");
    navigate(`/search?query=${query}`);
  };

  const genres = [
    "Fiction",
    "Scifi",
    "Mystery",
    "Romance",
    "Biography",
    "Fantasy",
    "Education",
    "History",
    "Business",
  ];
  const languages = [
    "English",
    "Nepali",
    "Chinese",
    "Spanish",
    "French",
    "German",
    "Hindi",
    "Japanese",
  ];
  const sortOptions = [
    { value: "price", label: "Price" },
    { value: "title", label: "Title" },
    { value: "publishDate", label: "Publish Date" },
    { value: "popularity", label: "Popularity" },
  ];

  const activeFilterCount = [
    genre,
    language,
    minPrice,
    maxPrice,
    sortBy,
  ].filter(Boolean).length;

  return (
    <div className="pt-32 pb-16 px-4 md:px-8 lg:px-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search Summary */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Search Results
              </h1>
              <p className="text-gray-600">
                {loading ? "Searching..." : `Found ${books.length} books`}
                {query ? ` for "${query}"` : ""}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 mr-3"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-sm">Sort:</span>
                <select
                  value={sortBy ? `${sortBy}-${sortDir}` : ""}
                  onChange={(e) => {
                    const [newSortBy, newSortDir] = e.target.value.split("-");
                    setSortBy(newSortBy);
                    setSortDir(newSortDir);
                    setTimeout(() => applyFilters(), 0);
                  }}
                  className="border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Relevance</option>
                  {sortOptions.map((option) => (
                    <React.Fragment key={option.value}>
                      <option value={`${option.value}-asc`}>
                        {option.label}: Low to High
                      </option>
                      <option value={`${option.value}-desc`}>
                        {option.label}: High to Low
                      </option>
                    </React.Fragment>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filter Panel - Slides down when active */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Refine Results
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre
                  </label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Genres</option>
                    {genres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Languages</option>
                    {languages.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Clear All
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-gray-600">Active filters:</span>

              {genre && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-800">
                  Genre: {genre}
                  <button
                    onClick={() => {
                      setGenre("");
                      setTimeout(() => applyFilters(), 0);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {language && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-800">
                  Language: {language}
                  <button
                    onClick={() => {
                      setLanguage("");
                      setTimeout(() => applyFilters(), 0);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {minPrice && maxPrice && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-800">
                  Price: ${minPrice} - ${maxPrice}
                  <button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                      setTimeout(() => applyFilters(), 0);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {sortBy && sortDir && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-800">
                  Sort: {sortBy} (
                  {sortDir === "asc" ? "Low to High" : "High to Low"})
                  <button
                    onClick={() => {
                      setSortBy("");
                      setSortDir("asc");
                      setTimeout(() => applyFilters(), 0);
                    }}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any books matching your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear filters and try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </div>
  );
};

export default SearchResults;
