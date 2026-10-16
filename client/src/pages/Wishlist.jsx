import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';

export const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="w-full bg-[#FFF9F3] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            Saved Sweets
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] font-bold mt-1">
            My Favorite Bakes ({wishlist.length})
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            icon="favorite"
            title="Your Wishlist is Empty"
            description="You haven’t bookmarked any treats yet! Click the heart icon on any cake or macaron to keep track of what you’d love to order."
            buttonText="Browse Bakery Menu"
            buttonLink="/menu"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((cake) => (
              <ProductCard key={cake._id} product={cake} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;
