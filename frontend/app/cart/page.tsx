"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { getCartItems, updateCartItem, deleteCartItem } from "@/lib/api";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export default function CartPage() {
  // const [cartItems, setCartItems] = useState<CartItem[]>([])

  // useEffect(() => {
  //   // Simulate cart items - in real app, this would come from state management or API
  //   const dummyCartItems: CartItem[] = [
  //     { id: "1", name: "Fresh Tomatoes", quantity: 2, price: 2.99 },
  //     { id: "2", name: "Basmati Rice", quantity: 1, price: 8.99 },
  //     { id: "3", name: "Whole Milk", quantity: 1, price: 3.49 },
  //     { id: "4", name: "Organic Bananas", quantity: 3, price: 1.99 },
  //   ]
  //   setCartItems(dummyCartItems)
  // }, [])

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const userId = "rahul123";

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartItems(userId);

        const mapped = data.map((item: any, index: number) => ({
          id: index.toString(),
          name: item.product_name,
          quantity: item.quantity,
          price: 3.49, // 👈 temporary price for demo, or set default like 0
        }));

        setCartItems(mapped);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCart();
  }, []);

  // const updateQuantity = (id: string, newQuantity: number) => {
  //   if (newQuantity <= 0) {
  //     removeItem(id);
  //     return;
  //   }
  //   setCartItems((items) =>
  //     items.map((item) =>
  //       item.id === id ? { ...item, quantity: newQuantity } : item
  //     )
  //   );
  // };

  const updateQuantity = async (id: string, newQuantity: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    if (newQuantity < 1) {
      // 🧹 Delete from backend if quantity goes to 0
      setCartItems((prev) => prev.filter((i) => i.id !== id));
      try {
        await deleteCartItem(userId, item.name);
        console.log("done");
      } catch (err) {
        console.error("Failed to delete item from backend", err);
      }
      return;
    }

    const updatedItem = { ...item, quantity: newQuantity };

    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );

    try {
      await updateCartItem(userId, {
        name: updatedItem.name,
        quantity: updatedItem.quantity,
      });
    } catch (err) {
      console.error("Failed to update item in backend", err);
    }
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
          <ShoppingCart className="mr-3" />
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500">Add some products to get started!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${(item.price ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${((item.price ?? 0) * (item.quantity ?? 1)).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">
                  Total: ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
