import React from "react";
import DealsComponent from "../../components/user/DealsComponent";

const Deals = () => {
  return (
    <div className="mt-32 mb-20 px-6 sm:px-8 lg:px-20">
      <DealsComponent /> {/* ✅ Real deals rendering here */}
    </div>
  );
};

export default Deals;
