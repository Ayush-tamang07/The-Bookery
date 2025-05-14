import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";
import { FaTrashAlt, FaShoppingBag, FaTruck, FaLock } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get("/user/getCart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Could not load your cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCartItem = async (cartId) => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/user/deletecart/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Item removed from cart.");
      setCartItems((prev) => prev.filter((item) => item.cartId !== cartId));
    } catch (error) {
      console.error("Error deleting cart item:", error);
      toast.error("Failed to remove item.");
    }
  };

  const handleQuantityChange = async (cartId, newQty) => {
    if (newQty < 1) return;

    try {
      const token = localStorage.getItem("token");
      await apiClient.put(
        `/user/updatecart/${cartId}`,
        { quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity: newQty,
                totalPrice: newQty * item.pricePerUnit,
              }
            : item
        )
      );
      toast.success("Quantity updated!");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity.");
    }
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Only make ONE request (no payload) — it uses the cart on the backend
      const response = await apiClient.post(
        "/order/placeorder",
        {}, // ⬅️ empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order placed successfully!");
      setCartItems([]); // clear frontend cart
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="pt-32 px-4 md:px-10 lg:px-16 pb-12 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-2">
            <FaShoppingBag className="text-green-700" />
            <span>
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6 bg-gradient-to-r from-green-700 to-green-600">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaShoppingBag className="mr-2" /> Your Items
                </h2>
              </div>

              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-pulse flex justify-center">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ) : cartItems.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaShoppingBag className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Looks like you haven't added any books to your cart yet.
                  </p>
                  <button className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition shadow-sm">
                    Browse Books
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartId}
                      className="p-6 hover:bg-gray-50 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-6">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-20 h-28 object-cover rounded-md shadow-md"
                            />
                            <div className="absolute -top-2 -right-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                              Book
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Genre: {item.genre || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Price: ₹{item.pricePerUnit}
                            </p>

                            <div className="flex items-center gap-3 mt-4">
                              <span className="text-sm text-gray-600">
                                Quantity:
                              </span>
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.cartId,
                                      item.quantity - 1
                                    )
                                  }
                                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 font-medium">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.cartId,
                                      item.quantity + 1
                                    )
                                  }
                                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                          <span className="text-lg font-bold text-green-700">
                            ₹{item.totalPrice}
                          </span>
                          <button
                            onClick={() => handleDeleteCartItem(item.cartId)}
                            className="mt-4 flex items-center text-red-500 hover:text-red-700 transition"
                          >
                            <FaTrashAlt className="mr-1 text-sm" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 sticky top-24">
              <div className="p-6 bg-gradient-to-r from-green-700 to-green-600">
                <h2 className="text-xl font-bold text-white">Order Summary</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      Subtotal ({cartItems.length}{" "}
                      {cartItems.length === 1 ? "item" : "items"})
                    </span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <div className="flex items-center">
                      <FaTruck className="mr-2 text-green-600" />
                      <span>Shipping</span>
                    </div>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between font-bold text-xl text-gray-800">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  <p className="text-right text-xs text-gray-500 mt-1">
                    Tax included if applicable
                  </p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-sm font-medium flex items-center justify-center"
                  disabled={cartItems.length === 0}
                >
                  <FaLock className="mr-2" />
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    <FaLock className="mr-1 text-xs" />
                    Secure Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
