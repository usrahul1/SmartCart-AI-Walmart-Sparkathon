"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

const dummyProducts: Product[] = [
  {
    id: "1",
    name: "Fresh Tomatoes",
    price: 2.99,
    image:
      "https://tiimg.tistatic.com/fp/1/007/847/indian-originated-compound-preserved-tasty-round-fresh-raw-red-tomatoes-1-kg--864.jpg",
    description: "Fresh organic tomatoes, perfect for salads and cooking",
  },
  {
    id: "2",
    name: "Basmati Rice",
    price: 8.99,
    image:
      "https://5.imimg.com/data5/SELLER/Default/2022/3/LJ/ZL/GQ/49710505/soft-basmati-rice-500x500.png",
    description: "Premium quality basmati rice, 5kg pack",
  },
  {
    id: "3",
    name: "Whole Milk",
    price: 3.49,
    image:
      "https://c.ndtvimg.com/2023-06/ev07v3c8_milk_625x300_27_June_23.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=886",
    description: "Fresh whole milk, 1 gallon",
  },
  {
    id: "4",
    name: "Organic Bananas",
    price: 1.99,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5adi-L5VkX8ySqtelmPMsYJt98HOdrGqGQA&s",
    description: "Organic bananas, bunch of 6-8",
  },
  {
    id: "5",
    name: "Chicken Breast",
    price: 12.99,
    image:
      "https://assets.tendercuts.in/product/C/H/594e4559-f6b7-417d-9aac-d0643b5711d3.jpg",
    description: "Fresh chicken breast, 2lbs pack",
  },
  {
    id: "6",
    name: "Olive Oil",
    price: 15.99,
    image:
      "https://www.greendna.in/cdn/shop/products/oliveoil_600x.jpg?v=1738823916",
    description: "Extra virgin olive oil, 500ml bottle",
  },
  {
    id: "7",
    name: "Bread Loaf",
    price: 2.49,
    image:
      "https://www.kingarthurbaking.com/sites/default/files/styles/featured_image/public/2020-02/the-easiest-loaf-of-bread-youll-ever-bake.jpg?itok=j89yDeId",
    description: "Whole wheat bread loaf",
  },
  {
    id: "8",
    name: "Greek Yogurt",
    price: 4.99,
    image:
      "https://www.themediterraneandish.com/wp-content/uploads/2025/04/TMD-Homemade-Greek-Yogurt-Edited-1.jpg",
    description: "Plain Greek yogurt, 32oz container",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(dummyProducts);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to SmartCart AI
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your intelligent shopping assistant. Browse products, chat with AI,
          and enjoy a seamless shopping experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
