import React from "react";
import { images } from "../../context/assets";
import { useNavigate } from "react-router-dom"; // ✅ Import

function HeroSection() {
  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleGetStarted = () => {
    navigate("/Browsebooks"); // ✅ Navigate to Browsebooks
  };

  return (
    <section className="py-12 px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Left: Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            Transform your idea into{" "}
            <span className="text-web-primary">Digital Success</span> with Us
          </h1>

          <p className="text-lg md:text-xl text-gray-600 mb-6">
            We help you build scalable, elegant, and user-centric digital
            products that thrive.
          </p>

          <button
            onClick={handleGetStarted}
            className="mt-4 bg-web-primary text-white px-6 py-2 rounded hover:bg-web-accent transition"
          >
            Get Started
          </button>
        </div>

        {/* Right: Image Section */}
        <div className="md:w-1/2">
          <img
            src={images.heroImage}
            alt="Digital Transformation"
            className="rounded-xl w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
