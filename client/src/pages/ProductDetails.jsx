import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI, reviewAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import toast from 'react-hot-toast';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setDeliveryDate: setCartDeliveryDate } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Customization state
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [messageOnCake, setMessageOnCake] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  // Tabs state
  const [activeTab, setActiveTab] = useState('description');

  // New review state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getById(id);
        const prod = res.data.product;
        setProduct(prod);
        setReviews(res.data.reviews || []);
        setRelated(res.data.related || []);

        if (prod.images && prod.images.length > 0) {
          setSelectedImage(prod.images[0]);
        }
        if (prod.variants && prod.variants.length > 0) {
          setSelectedWeight(prod.variants[0].weight);
        } else {
          setSelectedWeight('500g');
        }
        if (prod.flavors && prod.flavors.length > 0) {
          setSelectedFlavor(prod.flavors[0]);
        } else {
          setSelectedFlavor('Classic');
        }
      } catch (err) {
        toast.error('Cake details not found');
        navigate('/menu');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F4A7B9] border-t-[#894C5C] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-serif text-lg text-[#8A5A64]">Warming the oven...</p>
        </div>
      </div>
    );
  }

  // Calculate current price based on weight variant
  const currentVariant = product.variants?.find((v) => v.weight === selectedWeight);
  const currentPrice = currentVariant ? currentVariant.price : product.basePrice;
  const isFavorite = isInWishlist(product._id);

  const handleAddToCart = () => {
    setCartDeliveryDate(deliveryDate);
    addToCart(product, {
      weight: selectedWeight,
      price: currentPrice,
      flavor: selectedFlavor,
      messageOnCake,
      quantity,
      deliveryDate
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to share your thoughts on this bake');
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please write a brief comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewAPI.add(product._id, {
        rating,
        title: reviewTitle,
        comment: reviewComment
      });
      toast.success(res.data.message || 'Review added! Thank you!');
      setReviews([res.data.review, ...reviews]);
      setReviewTitle('');
      setReviewComment('');
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="w-full bg-[#FFF9F3] py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#8E7D7D] mb-8">
          <Link to="/" className="hover:text-[#8A5A64]">Home</Link>
          <span>/</span>
          <Link to="/menu" className="hover:text-[#8A5A64]">Menu</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/menu?category=${product.category.slug}`} className="hover:text-[#8A5A64]">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#8A5A64] font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Hero Section: Images & Customizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-3xl border border-[#FDE8EC] shadow-sm mb-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#FDE8EC]/40 border border-[#FDE8EC] shadow-sm">
              <img
                src={selectedImage || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isEggless && (
                <span className="absolute top-4 left-4 bg-[#DFF3E8] text-[#3E4F48] text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  100% Eggless
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm ${
                  isFavorite ? 'bg-white text-rose-500' : 'bg-white/90 text-[#8E7D7D] hover:text-rose-500'
                }`}
              >
                <span className={`material-symbols-outlined text-[22px] ${isFavorite ? 'fill' : ''}`}>
                  favorite
                </span>
              </button>
            </div>

            {/* Thumbnail Carousel */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === imgUrl ? 'border-[#894C5C] shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between mb-2">
                <span className="bg-[#FFE9A8] text-[#71612E] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category?.name || 'Artisanal Cake'}
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px] fill">star</span>
                    ))}
                  </div>
                  <span className="font-semibold text-[#6B5B5B]">{product.rating?.toFixed(1) || '4.9'}</span>
                  <a href="#reviews" onClick={() => setActiveTab('reviews')} className="text-[#894C5C] underline">
                    ({reviews.length} reviews)
                  </a>
                </div>
              </div>

              {/* Title & Price */}
              <h1 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] font-bold mb-3">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-3xl font-bold text-[#894C5C]">
                  ₹{currentPrice}
                </span>
                <span className="text-xs text-[#8E7D7D]">(Inclusive of all bakery taxes)</span>
              </div>

              <p className="text-sm text-[#6B5B5B] leading-relaxed mb-6">
                {product.description}
              </p>

              {/* 1. Weight Selector */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2.5">
                  Select Size / Weight
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(product.variants && product.variants.length > 0 ? product.variants : [
                    { weight: '500g', price: product.basePrice },
                    { weight: '1kg', price: Math.round(product.basePrice * 1.85) },
                    { weight: '2kg', price: Math.round(product.basePrice * 3.5) }
                  ]).map((variant) => (
                    <button
                      key={variant.weight}
                      type="button"
                      onClick={() => setSelectedWeight(variant.weight)}
                      className={`py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                        selectedWeight === variant.weight
                          ? 'border-[#894C5C] bg-[#894C5C] text-white shadow-sm'
                          : 'border-[#FDE8EC] bg-[#FFF9F3] text-[#6B5B5B] hover:border-[#F4A7B9]'
                      }`}
                    >
                      <span className="font-bold text-sm">{variant.weight}</span>
                      <span className="text-xs opacity-90 mt-0.5">₹{variant.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Flavor Notes Selector */}
              {product.flavors && product.flavors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2.5">
                    Select Flavor Note
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors.map((flavor) => (
                      <button
                        key={flavor}
                        type="button"
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                          selectedFlavor === flavor
                            ? 'bg-[#894C5C] text-white shadow-sm'
                            : 'bg-[#FFF9F3] text-[#6B5B5B] border border-[#FDE8EC] hover:bg-[#FDE8EC]'
                        }`}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Message on Cake */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2">
                  Custom Message on Cake (Optional, max 30 chars)
                </label>
                <input
                  type="text"
                  maxLength={30}
                  value={messageOnCake}
                  onChange={(e) => setMessageOnCake(e.target.value)}
                  placeholder="e.g., Happy Birthday Sarah!"
                  className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9] transition-colors"
                />
              </div>

              {/* 4. Quantity & Delivery Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl overflow-hidden w-full max-w-[140px]">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-2.5 text-[#6B5B5B] hover:bg-[#FDE8EC] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">remove</span>
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-[#8A5A64]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-2.5 text-[#6B5B5B] hover:bg-[#FDE8EC] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-2">
                    Delivery / Pickup Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>
              </div>

            </div>

            {/* CTAs: Add to Cart & Buy Now */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#FDE8EC]">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-[#F4A7B9] text-[#733949] hover:bg-[#894C5C] hover:text-white py-3.5 px-6 rounded-full font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>Add to Cart • ₹{currentPrice * quantity}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 bg-[#894C5C] text-white hover:bg-[#733949] py-3.5 px-6 rounded-full font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Buy Now</span>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </button>
            </div>

          </div>

        </div>

        {/* Tabbed Info: Description, Ingredients, Reviews */}
        <div id="reviews" className="bg-white p-6 sm:p-10 rounded-3xl border border-[#FDE8EC] shadow-sm mb-16">
          <div className="flex items-center gap-4 sm:gap-8 border-b border-[#FDE8EC] pb-4 mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('description')}
              className={`font-serif text-lg font-bold pb-2 transition-all relative ${
                activeTab === 'description' ? 'text-[#894C5C]' : 'text-[#8E7D7D] hover:text-[#8A5A64]'
              }`}
            >
              Description &amp; Story
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#894C5C] rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('ingredients')}
              className={`font-serif text-lg font-bold pb-2 transition-all relative ${
                activeTab === 'ingredients' ? 'text-[#894C5C]' : 'text-[#8E7D7D] hover:text-[#8A5A64]'
              }`}
            >
              Ingredients &amp; Allergen Info
              {activeTab === 'ingredients' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#894C5C] rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`font-serif text-lg font-bold pb-2 transition-all relative ${
                activeTab === 'reviews' ? 'text-[#894C5C]' : 'text-[#8E7D7D] hover:text-[#8A5A64]'
              }`}
            >
              Customer Reviews ({reviews.length})
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#894C5C] rounded-full"></span>
              )}
            </button>
          </div>

          {/* Tab 1: Description */}
          {activeTab === 'description' && (
            <div className="text-sm text-[#6B5B5B] leading-relaxed space-y-4 max-w-3xl">
              <p>{product.description}</p>
              <p>
                Every batch is crafted under the watchful eye of our pastry chefs, respecting traditional Parisian patisserie fundamentals while celebrating the season’s sweetest botanical flavors.
              </p>
              <div className="bg-[#FFF9F3] p-4 rounded-2xl border border-[#FDE8EC] text-xs text-[#8E7D7D] space-y-1">
                <p><strong>Storage Instructions:</strong> Keep refrigerated. Best enjoyed within 48 hours of delivery.</p>
                <p><strong>Serving Tip:</strong> Allow to sit at room temperature for 15 minutes prior to slicing for optimal buttercream texture.</p>
              </div>
            </div>
          )}

          {/* Tab 2: Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="text-sm text-[#6B5B5B] leading-relaxed max-w-3xl space-y-4">
              <p className="font-semibold text-[#8A5A64]">Pure Organic Ingredients:</p>
              <p>{product.ingredients || 'Organic stoneground flour, pure cultured French butter, unrefined cane sugar, farm-fresh dairy cream, Madagascar bourbon vanilla bean.'}</p>
              <div className="p-4 bg-[#FDE8EC] rounded-2xl text-xs text-[#8A5A64] space-y-1">
                <p><strong>Allergen Notice:</strong> Contains gluten, milk, and tree nuts where applicable. Baked in an artisanal kitchen handling pistachios, almonds, and hazelnuts.</p>
                {product.isEggless && (
                  <p className="text-emerald-800 font-semibold mt-1">✓ 100% Vegetarian / Eggless formulation.</p>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Add Review Box */}
              <div className="bg-[#FFF9F3] p-6 rounded-2xl border border-[#FDE8EC] max-w-2xl">
                <h4 className="font-serif text-lg font-bold text-[#8A5A64] mb-3">Share Your Sweet Experience</h4>
                
                {isAuthenticated ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#8E7D7D] mb-1 font-medium">Your Rating</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="text-amber-500 focus:outline-none"
                          >
                            <span className={`material-symbols-outlined text-[24px] ${rating >= star ? 'fill' : ''}`}>
                              star
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="Headline / Title (e.g. Absolutely magical cake!)"
                        className="w-full px-4 py-2.5 bg-white border border-[#FDE8EC] rounded-xl text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell others what you loved about this bake..."
                        className="w-full px-4 py-2.5 bg-white border border-[#FDE8EC] rounded-xl text-xs sm:text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
                    >
                      {submittingReview ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                ) : (
                  <div className="text-xs text-[#8E7D7D]">
                    Please{' '}
                    <Link to="/login" className="text-[#894C5C] font-semibold underline">
                      sign in
                    </Link>{' '}
                    to leave a review on this cake.
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div key={rev._id} className="p-5 rounded-2xl bg-[#FFF9F3]/60 border border-[#FDE8EC]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#FFD9E0] text-[#733949] flex items-center justify-center font-bold text-xs">
                            {rev.userName ? rev.userName[0].toUpperCase() : 'U'}
                          </div>
                          <span className="font-semibold text-xs sm:text-sm text-[#8A5A64]">{rev.userName}</span>
                        </div>
                        <div className="flex items-center text-amber-500 text-xs">
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-[16px] fill">star</span>
                          ))}
                        </div>
                      </div>
                      {rev.title && <h5 className="font-semibold text-xs sm:text-sm text-[#6B5B5B] mb-1">{rev.title}</h5>}
                      <p className="text-xs text-[#8E7D7D] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#8E7D7D] italic">
                    Be the first patron to leave a review for this bake!
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Related Cakes Section */}
        {related.length > 0 && (
          <div className="mb-12">
            <h3 className="font-serif text-2xl font-bold text-[#8A5A64] mb-6">
              You May Also Adore
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((cake) => (
                <ProductCard key={cake._id} product={cake} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
