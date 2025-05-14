import React from "react";
import { Heart, Plus, Star } from "lucide-react";
import { toast } from "react-toastify";

const BookCard = ({
  title = "",
  author = "",
  price = 0,
  discountPercent = 0,
  startDate,
  endDate,
  image = "/placeholder.jpg",
  isBookmarked = false,
  onAddToCart = () => {},
  onBookmarkClick = () => {},
  onViewDetail = () => {},
  averageRating = 0,
  totalReviews = 0,
  quantity = 0, // Replace 'stock' with 'quantity'
}) => {
  const now = new Date();
  const validStart = startDate ? new Date(startDate) : null;
  const validEnd = endDate ? new Date(endDate) : null;

  const isDiscountActive =
    validStart && validEnd && now >= validStart && now <= validEnd;

  const finalDiscount = isDiscountActive ? discountPercent : 0;
  const discountedPrice = (price - (price * finalDiscount) / 100).toFixed(2);

  const formatDate = (date) => {
    if (!date) return "";
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    const totalStars = 5;

    return (
      <div className="flex items-center space-x-0.5 text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={14} className="fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star size={14} className="fill-yellow-300 opacity-50" />
        )}
        {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map(
          (_, i) => (
            <Star key={`empty-${i}`} size={14} className="text-gray-300" />
          )
        )}
      </div>
    );
  };

  const renderDiscountBadge = () => {
    if (discountPercent <= 0 || !validStart || !validEnd) return null;

    const formattedStart = formatDate(validStart);
    const formattedEnd = formatDate(validEnd);

    if (isDiscountActive) {
      return (
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <div className="bg-red-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <span className="text-lg leading-none">{finalDiscount}%</span>
              <span className="block text-xs leading-none">OFF</span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="absolute top-0 right-0 mt-4 mr-4">
          <div className="bg-gray-700 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <span className="text-lg leading-none">{discountPercent}%</span>
              <span className="block text-xs leading-none">Off</span>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderDiscountDates = () => {
    if (discountPercent <= 0 || !validStart || !validEnd) return null;

    const formattedStart = formatDate(validStart);
    const formattedEnd = formatDate(validEnd);

    if (isDiscountActive) {
      return (
        <div className="absolute top-0 left-0 mt-3 ml-3">
          <div className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            Offer ends: {formattedEnd}
          </div>
        </div>
      );
    } else {
      return (
        <div className="absolute top-0 left-0 mt-3 ml-3">
          <div className="bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {formattedStart} - {formattedEnd}
          </div>
        </div>
      );
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // Show a Toastify message if the quantity is 0
    if (quantity <= 0) {
      toast.error("Sorry, this book is out of stock!"); // Toastify message when out of stock
    } else {
      onAddToCart(e); // Add to cart if quantity is available
    }
  };

  return (
    <div
      onClick={onViewDetail}
      className="group bg-white border border-gray-200 rounded-lg overflow-hidden w-72 transition-all duration-300 hover:shadow-lg cursor-pointer"
    >
      {/* Image Section */}
      <div className="w-full h-56 relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {renderDiscountBadge()}
        {renderDiscountDates()}

        {/* Dark gradient overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent opacity-60"></div>
      </div>

      {/* Content */}
      <div className="p-6 pb-7">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
          {author}
        </p>
        <h2 className="font-medium text-gray-900 mb-3 leading-tight group-hover:text-blue-700 transition-colors">
          {title}
        </h2>

        {/* Rating */}
        <div className="flex items-center justify-between mb-3">
          {renderStars()}
          <span className="text-xs text-gray-500 ml-2">({totalReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline">
            <span className="text-lg font-medium text-gray-900 mr-2">
              ₹{discountedPrice}
            </span>
            {isDiscountActive && finalDiscount > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{price}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkClick(e);
            }}
            className="focus:outline-none"
          >
            <Heart
              size={20}
              className={`cursor-pointer transition ${
                isBookmarked
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-400"
              }`}
              fill={isBookmarked ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={handleAddToCart} // Click handler to check stock
            className="bg-web-primary text-white text-sm py-2 px-4 rounded-md font-medium flex items-center space-x-2 
              transition-colors hover:bg-web-accent focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <span>Add to cart</span>
            <Plus size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
