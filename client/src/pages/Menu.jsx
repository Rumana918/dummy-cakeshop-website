import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';

export const Menu = () => {
  const { category: routeCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters state
  const selectedCategory = routeCategory || searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const [egglessOnly, setEgglessOnly] = useState(searchParams.get('eggless') === 'true');
  const [priceRange, setPriceRange] = useState(searchParams.get('maxPrice') || '4000');

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch filtered products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          category: selectedCategory,
          sort: sortOption,
          maxPrice: priceRange
        };

        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        if (egglessOnly) {
          params.eggless = 'true';
        }

        const res = await productAPI.getAll(params);
        setProducts(res.data.products || []);
        setPages(res.data.pages || 1);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, sortOption, egglessOnly, priceRange, page]);

  const handleCategorySelect = (slug) => {
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('search', searchTerm);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortOption('newest');
    setEgglessOnly(false);
    setPriceRange('4000');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            Fresh From Our Oven
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#8A5A64] font-medium mt-1">
            Artisanal Menu &amp; Patisserie
          </h1>
          <p className="text-sm text-[#8E7D7D] mt-2">
            Every cake is baked from scratch with pure butter, rich chocolate, and sweet berries.
          </p>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none justify-start sm:justify-center">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-[#894C5C] text-white'
                : 'bg-white text-[#6B5B5B] hover:bg-[#FDE8EC] border border-[#FDE8EC]'
            }`}
          >
            All Delights
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-sm ${
                selectedCategory === cat.slug
                  ? 'bg-[#894C5C] text-white'
                  : 'bg-white text-[#6B5B5B] hover:bg-[#FDE8EC] border border-[#FDE8EC]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter & Search Bar Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#FDE8EC] shadow-sm mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E7D7D] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cakes, flavors, ingredients..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-full text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9] transition-colors"
            />
          </form>

          {/* Right Controls: Eggless, Max Price, Sort */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-between md:justify-end">
            
            {/* 100% Eggless Toggle */}
            <label className="flex items-center gap-2 cursor-pointer bg-[#FFF9F3] px-3.5 py-2 rounded-full border border-[#FDE8EC] hover:bg-[#FDE8EC] transition-colors">
              <input
                type="checkbox"
                checked={egglessOnly}
                onChange={(e) => {
                  setEgglessOnly(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 accent-[#894C5C] rounded"
              />
              <span className="text-xs font-semibold text-[#3E4F48] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Eggless Only
              </span>
            </label>

            {/* Price Filter */}
            <div className="flex items-center gap-2 bg-[#FFF9F3] px-3 py-2 rounded-full border border-[#FDE8EC]">
              <span className="text-xs text-[#8E7D7D] whitespace-nowrap">Up to:</span>
              <span className="text-xs font-bold text-[#894C5C]">₹{priceRange}</span>
              <input
                type="range"
                min="300"
                max="4000"
                step="100"
                value={priceRange}
                onChange={(e) => {
                  setPriceRange(e.target.value);
                  setPage(1);
                }}
                className="w-20 sm:w-28 accent-[#894C5C] cursor-pointer"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value);
                setPage(1);
              }}
              className="bg-[#FFF9F3] text-xs font-medium text-[#6B5B5B] px-3.5 py-2.5 rounded-full border border-[#FDE8EC] outline-none focus:border-[#F4A7B9] cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* Reset Filters */}
            {(searchTerm || egglessOnly || priceRange !== '4000' || selectedCategory !== 'all') && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#894C5C] underline hover:text-[#733949] px-2 py-1"
                title="Reset all filters"
              >
                Reset
              </button>
            )}

          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center text-xs text-[#8E7D7D]">
          <span>
            Showing <strong className="text-[#8A5A64]">{products.length}</strong> of{' '}
            <strong className="text-[#8A5A64]">{total}</strong> cakes
          </span>
          {egglessOnly && (
            <span className="bg-[#DFF3E8] text-[#3E4F48] px-2.5 py-0.5 rounded-full font-medium">
              Eggless filter active
            </span>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="sentiment_dissatisfied"
            title="No cakes match your criteria"
            description="Try clearing your filters, adjusting the price slider, or searching for another flavor."
            buttonText="Reset All Filters"
            buttonLink="/menu"
          />
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-full border border-[#FDE8EC] bg-white text-[#8A5A64] flex items-center justify-center hover:bg-[#FDE8EC] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </button>

            {[...Array(pages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-all ${
                  page === i + 1
                    ? 'bg-[#894C5C] text-white shadow-sm'
                    : 'bg-white text-[#6B5B5B] hover:bg-[#FDE8EC] border border-[#FDE8EC]'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="w-10 h-10 rounded-full border border-[#FDE8EC] bg-white text-[#8A5A64] flex items-center justify-center hover:bg-[#FDE8EC] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Menu;
