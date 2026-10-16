import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorite = isInWishlist(product._id);
  const displayPrice = product.variants?.[0]?.price || product.basePrice;
  const image = product.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      weight: product.variants?.[0]?.weight || '500g',
      price: displayPrice,
      flavor: product.flavors?.[0] || 'Classic',
      quantity: 1
    });
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-2px_rgba(138,90,100,0.07)] hover:shadow-[0_12px_30px_-4px_rgba(138,90,100,0.15)] transition-all duration-300 border border-[#FDE8EC] flex flex-col justify-between">
      
      {/* Top Image Section */}
      <Link to={`/product/${product.slug || product._id}`} className="relative block overflow-hidden aspect-[4/3] bg-[#FDE8EC]/40">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-sm ${
            isFavorite ? 'bg-white text-rose-500' : 'bg-white/90 text-[#8E7D7D] hover:text-rose-500 hover:bg-white'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <span className={`material-symbols-outlined text-[20px] ${isFavorite ? 'fill' : ''}`}>
            favorite
          </span>
        </button>

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.category?.name && (
            <span className="bg-[#FFE9A8] text-[#71612E] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">
              {product.category.name}
            </span>
          )}

          {product.isEggless && (
            <span className="bg-[#DFF3E8] text-[#3E4F48] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              100% Eggless
            </span>
          )}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-500 text-xs">
              <span className="material-symbols-outlined text-[16px] fill">star</span>
            </div>
            <span className="text-xs font-semibold text-[#6B5B5B]">
              {product.rating ? product.rating.toFixed(1) : '4.9'}
            </span>
            <span className="text-[11px] text-[#8E7D7D]">
              ({product.numReviews || 12})
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug || product._id}`}>
            <h3 className="font-serif text-lg font-bold text-[#8A5A64] group-hover:text-[#894C5C] transition-colors line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-[#8E7D7D] line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-[#FDE8EC] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#8E7D7D] block uppercase tracking-wider">Starts at</span>
            <span className="font-serif text-xl font-bold text-[#894C5C]">
              ₹{displayPrice}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="bg-[#FDE8EC] text-[#8A5A64] hover:bg-[#F4A7B9] hover:text-[#733949] px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 group-hover:bg-[#F4A7B9]"
            title="Quick add to order"
          >
            <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
