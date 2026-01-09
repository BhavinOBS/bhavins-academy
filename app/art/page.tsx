"use client";

import Image from "next/image";
import { useState } from "react";

export default function ArtGalleryPage() {
  // You can add more image filenames here later
  const [images] = useState([
    { src: "/art/sketch1.jpg", title: "Narendra Modi" },
    { src: "/art/sketch2.jpg", title: "Portrait Study" },
    { src: "/art/sketch3.jpg", title: "Nature Scene" },
    { src: "/art/sketch4.jpg", title: "Still Life" },
    { src: "/art/sketch5.jpg", title: "Animal Sketch" },
  ]);

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6 text-gray-800">
      <section className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-10 text-center">
          🎨 Bhavin’s Art Gallery
        </h1>

        {images.length === 0 ? (
          <p className="text-center text-gray-500">No artwork added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-gray-200"
              >
                <div className="relative w-full h-64">
                  <Image
                    src={img.src}
                    alt={img.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 text-center text-gray-700 font-medium">
                  {img.title}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
