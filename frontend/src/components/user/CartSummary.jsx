import React from 'react';

const CartSummary = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-green-900 mb-4">Order Summary</h2>
      <hr className="mb-4" />

      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-700">Subtotal</span>
        <span className="text-gray-700">Rs. 0</span>
      </div>

      <div className="flex justify-between text-sm mb-4">
        <span className="text-gray-700">Shipping</span>
        <span className="text-gray-700">Free</span>
      </div>

      <hr className="mb-4" />

      <div className="flex justify-between text-base font-bold mb-4">
        <span className="text-gray-900">Total</span>
        <span className="text-gray-900">Rs. 0</span>
      </div>

      <button className="w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition">
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
