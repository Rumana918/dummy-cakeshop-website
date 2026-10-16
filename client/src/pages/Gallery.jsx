import React, { useEffect, useState } from 'react';
import { galleryAPI } from '../services/api';

export const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeLightboxImage, setActiveLightboxImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Weddings',
    'Birthdays',
    'Anniversaries',
    'Cupcakes',
    'Pastries',
    'Custom Cakes'
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const res = await galleryAPI.get(selectedCategory);
        setImages(res.data.images || []);
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [selectedCategory]);

  return (
    <div className="w-full bg-[#FFF9F3] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            Visual Inspiration
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#8A5A64] font-medium mt-1">
            Artisanal Cake &amp; Pastry Gallery
          </h1>
          <p className="text-sm text-[#8E7D7D] mt-2">
            A glimpse into the celebratory centerpieces and delicate morning treats freshly whipped in our studio.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${
                selectedCategory === cat
                  ? 'bg-[#894C5C] text-white'
                  : 'bg-white text-[#6B5B5B] hover:bg-[#FDE8EC] border border-[#FDE8EC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-[#FDE8EC] rounded-2xl"></div>
            ))}
          </div>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((item) => (
              <div
                key={item._id}
                onClick={() => setActiveLightboxImage(item)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-[#FDE8EC] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#FDE8EC]"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="bg-[#FFE9A8] text-[#71612E] text-[10px] font-bold px-2.5 py-0.5 rounded-full self-start mb-1.5 uppercase">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 text-[#894C5C] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-[18px]">zoom_in</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-xs text-[#8E7D7D]">
            No gallery creations found in this category yet.
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {activeLightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setActiveLightboxImage(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video sm:aspect-[4/3] bg-black">
              <img
                src={activeLightboxImage.imageUrl}
                alt={activeLightboxImage.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#FFE9A8] text-[#71612E] text-[11px] font-bold px-3 py-0.5 rounded-full uppercase">
                  {activeLightboxImage.category}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#8A5A64]">
                {activeLightboxImage.title}
              </h3>
              {activeLightboxImage.description && (
                <p className="text-xs text-[#8E7D7D] mt-2 leading-relaxed">
                  {activeLightboxImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;
