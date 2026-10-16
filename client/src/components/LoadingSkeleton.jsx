import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-[#FDE8EC] animate-pulse p-4">
    <div className="w-full aspect-[4/3] bg-[#FDE8EC]/60 rounded-xl mb-4"></div>
    <div className="h-4 bg-[#FDE8EC] rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-[#FDE8EC]/60 rounded w-full mb-1"></div>
    <div className="h-3 bg-[#FDE8EC]/60 rounded w-2/3 mb-4"></div>
    <div className="flex justify-between items-center pt-2 border-t border-[#FDE8EC]">
      <div className="h-5 bg-[#FDE8EC] rounded w-16"></div>
      <div className="h-8 bg-[#FDE8EC] rounded-full w-20"></div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export default ProductSkeleton;
