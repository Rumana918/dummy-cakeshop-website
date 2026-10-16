import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sw_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sw_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        try {
          const res = await wishlistAPI.get();
          if (res.data?.wishlist) {
            setWishlist(res.data.wishlist);
          }
        } catch (err) {
          console.warn('Wishlist load warning:', err.message);
        }
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item) === productId);
  };

  const toggleWishlist = async (product) => {
    const inList = isInWishlist(product._id);
    if (inList) {
      setWishlist(prev => prev.filter(item => (item._id || item) !== product._id));
      if (isAuthenticated) {
        try { await wishlistAPI.remove(product._id); } catch (e) {}
      }
      toast('Removed from favorites', { icon: '🤍' });
    } else {
      setWishlist(prev => [...prev, product]);
      if (isAuthenticated) {
        try { await wishlistAPI.add(product._id); } catch (e) {}
      }
      toast.success('Added to your favorites! 💖', {
        style: {
          background: '#FFF9F3',
          color: '#8A5A64',
          border: '1px solid #F4A7B9'
        }
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
export default WishlistContext;
