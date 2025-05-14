import React from "react";
import HeroSection from "../../components/user/HeroSection";
import BestSellers from "../../components/user/BestSellers";
import AwardWinner from "../../components/user/AwardWinner";
import NewReleases from "../../components/user/NewReleases";
import ComingSoon from "../../components/user/ComingSoon";
import Notification from "../../components/NotificationController/Notification";
import { useNavigate } from "react-router-dom";
import DealsComponent from "../../components/user/DealsComponent"; // ✅ Correct component
import Soon from "../../components/user/Soon";

function Home() {
  const navigate = useNavigate();

  const SectionWrapper = ({ title, children, seeAllPath }) => (
    <div className="mt-12 px-6 sm:px-10 md:px-16 lg:px-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <button
          onClick={() => navigate(seeAllPath)}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          View More →
        </button>
      </div>
      {children}
    </div>
  );

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="mt-28 mb-28">
        <HeroSection />
      </div>

      {/* Best Sellers */}
      <SectionWrapper title="Best Sellers" seeAllPath="/SellerBest">
        <BestSellers limit={4} />
      </SectionWrapper>

      {/* Award Winning Books */}
      <SectionWrapper title="Award Winning Books" seeAllPath="/WinnerAward">
        <AwardWinner limit={4} />
      </SectionWrapper>

      {/* Notifications */}
      <Notification />

      {/* New Releases */}
      <SectionWrapper title="New Releases" seeAllPath="/ReleaseNew">
        <NewReleases limit={4} />
      </SectionWrapper>

      {/* Coming Soon */}
      <SectionWrapper title="New Arrivals" seeAllPath="/SoonComing">
        <ComingSoon limit={4} />
      </SectionWrapper>

      {/* 🔥 Deals Section */}
      <SectionWrapper title="Deals" seeAllPath="/deals">
        <DealsComponent limit={4} />
      </SectionWrapper>

      {/* Optional: Full Soon Page Preview (if needed) */}
      <Soon />
    </div>
  );
}

export default Home;
