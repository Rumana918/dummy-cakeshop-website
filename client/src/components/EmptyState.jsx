import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon = 'cookie',
  title = 'No treats found',
  description = 'We couldn’t find what you were looking for. Explore our fresh morning menu!',
  buttonText = 'Explore Bakery Menu',
  buttonLink = '/menu'
}) => {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-[#FDE8EC] flex items-center justify-center text-[#894C5C] mb-6 shadow-inner">
        <span className="material-symbols-outlined text-[40px]">{icon}</span>
      </div>
      <h3 className="font-serif text-2xl font-bold text-[#8A5A64] mb-2">{title}</h3>
      <p className="text-sm text-[#8E7D7D] leading-relaxed mb-6">{description}</p>
      {buttonText && buttonLink && (
        <Link
          to={buttonLink}
          className="bg-[#F4A7B9] text-[#733949] hover:bg-[#894C5C] hover:text-white px-7 py-3 rounded-full text-sm font-semibold transition-all shadow-sm inline-flex items-center gap-2"
        >
          <span>{buttonText}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
