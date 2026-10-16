import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="w-full bg-[#FFF9F3] py-24 min-h-[75vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <span className="text-7xl block mb-4 animate-bounce">🥐</span>
        <span className="bg-[#FFD9E0] text-[#733949] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          404 Error
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#8A5A64] mt-3 mb-2">
          Page Crumbled Away
        </h1>
        <p className="text-sm text-[#8E7D7D] mb-8 leading-relaxed">
          The page or confection you are looking for doesn't exist, has been eaten, or was moved to another shelf in our bakery.
        </p>
        <Link
          to="/"
          className="bg-[#894C5C] text-white hover:bg-[#733949] px-8 py-3.5 rounded-full text-sm font-semibold shadow-md transition-all inline-flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>Return to Bakery Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
