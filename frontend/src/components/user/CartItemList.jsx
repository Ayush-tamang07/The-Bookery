import React from 'react';

const CartItemList = () => {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-green-900 mb-4">Order Items</h2>
      <hr className="mb-6" />
      <div className="flex justify-center text-gray-500 text-sm">
        Your cart is empty.
      </div>
    </div>
  );
};

export default CartItemList;
