import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI, settingsAPI } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/LoadingSkeleton';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, bestRes, catRes, setRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getBestSellers(),
          categoryAPI.getAll(),
          settingsAPI.get()
        ]);
        setFeaturedProducts(featRes.data.products || []);
        setBestSellers(bestRes.data.products || []);
        setCategories(catRes.data.categories || []);
        setSettings(setRes.data.settings || {});
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const claimDailySpecial = () => {
    // Add special promo treat
    addToCart({
      _id: 'special-matcha-croissant',
      name: 'Matcha White Chocolate Croissant & Rose Latte Combo',
      slug: 'flaky-french-butter-croissant-pack-of-4',
      basePrice: 749,
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC3ceCVi4-0PsFwvtaybdY_R_S9E2tjZSHdNRLQpFexJsSctcKvq9Ol0lyMBkfDDyb5axEfzStxwpBQXqmeOpMulwoT8PGbSMmCy9hC613pIvMRS0rpkQFkXO0jTdosXw86J_Aj8UljYpeRP7zAhfPc0xCACgGmmlio7w12nS_765NYDdY1m1mpkcJutEdSqIBz4n_8OVxi3quBpiA5o4yD8mwPFpy5Mv7T71-3DqAA8qWMeww6ttB0']
    }, {
      weight: 'Combo Set',
      price: 749,
      flavor: 'Matcha & Rose',
      quantity: 1
    });
    toast.success("Today's special claimed! Added to your cart ✨");
  };

  return (
    <div className="w-full bg-[#FFF9F3]">
      
      {/* 1. Hero Section */}
      <section className="relative w-full overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        {/* Soft pastel decorative blurs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD9E0]/40 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFE9A8]/40 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            <span className="inline-flex items-center gap-2 bg-[#FFD9E0] text-[#733949] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-[#894C5C]">favorite</span>
              {settings?.heroBanner?.badge || 'Artisanal Bakery & Patisserie'}
            </span>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#8A5A64] font-medium leading-[1.15]">
              Handcrafted with <span className="text-[#894C5C] italic font-serif">Love &amp; Sweetness</span>
            </h1>

            <p className="text-base sm:text-lg text-[#6B5B5B] max-w-xl leading-relaxed">
              {settings?.heroBanner?.subtitle ||
                'Experience the pure bliss of organic ingredients, traditional French techniques, and a modern artisanal touch in every single bite. Baked fresh daily for your sweetest moments.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/menu"
                className="bg-[#894C5C] text-white hover:bg-[#F4A7B9] hover:text-[#733949] transition-all px-8 py-3.5 rounded-full font-semibold text-sm shadow-md flex items-center gap-2 group"
              >
                <span>Explore Menu</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
              <Link
                to="/custom-cake"
                className="bg-[#FDE8EC] text-[#8A5A64] hover:bg-[#FCD1D9] transition-all px-8 py-3.5 rounded-full font-semibold text-sm shadow-sm"
              >
                Custom Orders
              </Link>
            </div>

            {/* Value Props */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs sm:text-sm text-[#8E7D7D]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#894C5C] text-[20px]">eco</span>
                <span className="font-medium text-[#6B5B5B]">100% Organic Butter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#894C5C] text-[20px]">local_shipping</span>
                <span className="font-medium text-[#6B5B5B]">Same-Day Local Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#894C5C] text-[20px]">verified</span>
                <span className="font-medium text-[#6B5B5B]">Pure Eggless Options</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl bg-[#FDE8EC] border-4 border-white">
              <img
                src={settings?.heroBanner?.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVpULMsjNNStgGGl9ON5NQfN_H6uurOrBYeVKbSaWwSjWiGYY5BV5a6R2l3u_fdoNRmnEUcMqI6LSDzO9dgHP_-i0d23eRl1QEBApjWki7DkGCNsKdCUUDGCBPLdd6s_iXFbfYZ9T4jysgnlEPVpyfR6JAtxUTe9gZSD7qljPxVVV4bOzC2fjUh4PQgk5Olx-21zGtrM-I51CZ0mIPpKf-J-IIT8D-PkSmnJ76GKBJB76DJM69jfpw'}
                alt="Signature Artisanal Cake"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-[#FDE8EC] flex items-center justify-between">
                <div>
                  <p className="font-serif text-lg font-bold text-[#8A5A64]">Pistachio Raspberry Bloom</p>
                  <p className="text-xs text-[#8E7D7D]">Organic berries &amp; pure pistachio praline</p>
                </div>
                <span className="bg-[#F4A7B9] text-[#733949] px-3.5 py-1.5 rounded-full font-bold text-sm shadow-sm">
                  ₹850
                </span>
              </div>
            </div>

            {/* Floating Rating Pill */}
            <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-[#FFE9A8] text-[#71612E] p-3 sm:p-4 rounded-2xl shadow-xl flex items-center gap-2.5 animate-bounce">
              <span className="material-symbols-outlined text-[24px] text-amber-600 fill">star</span>
              <div>
                <p className="font-bold text-xs sm:text-sm">4.9 / 5.0 Rating</p>
                <p className="text-[10px] sm:text-xs text-[#71612E]/80">Over 2,500 happy reviews</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Daily Specials Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-4 relative z-20 mb-16">
        <div className="bg-[#894C5C] text-white rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 border-2 border-[#F4A7B9]/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#FFF9F3] text-[#894C5C] flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-[28px]">redeem</span>
            </div>
            <div>
              <span className="bg-[#F4A7B9] text-[#733949] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                Today's Fresh Bake Special
              </span>
              <h2 className="font-serif text-xl sm:text-2xl text-white mt-1.5">
                {settings?.heroBanner?.specialTitle || 'Matcha White Chocolate Croissant & Rose Latte Combo'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0 w-full lg:w-auto justify-between lg:justify-end">
            <div className="text-right">
              <span className="line-through text-white/60 text-xs sm:text-sm">
                ₹{settings?.heroBanner?.specialOriginalPrice || 999}
              </span>
              <p className="font-serif text-2xl font-bold text-[#FFE9A8]">
                ₹{settings?.heroBanner?.specialDiscountedPrice || 749}
              </p>
            </div>
            <button
              onClick={claimDailySpecial}
              className="bg-[#FFF9F3] text-[#894C5C] hover:bg-[#F4A7B9] hover:text-[#733949] transition-all px-6 py-3 rounded-full font-bold text-sm shadow-md"
            >
              Claim Special
            </button>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
              Curated Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] mt-1">
              Explore Our Categories
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-[#894C5C] hover:text-[#8A5A64] font-semibold text-sm flex items-center gap-1 group"
          >
            <span>View Full Menu</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/menu?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-3 border border-[#FDE8EC] hover:border-[#F4A7B9] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-[#FDE8EC]">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-sm font-bold text-[#8A5A64] group-hover:text-[#894C5C] transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Best-Selling Cakes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
              Customer Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] mt-1">
              Best-Selling Delicacies
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-[#894C5C] hover:text-[#8A5A64] font-semibold text-sm flex items-center gap-1 group"
          >
            <span>See All Cakes</span>
            <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((cake) => (
              <ProductCard key={cake._id} product={cake} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Why Choose Us */}
      <section className="w-full bg-[#FDE8EC]/50 py-16 my-8 border-y border-[#F4A7B9]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
              The Sweet Whisk Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] mt-1">
              Why Bloom City Loves Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-[#FDE8EC] shadow-sm text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#DFF3E8] text-[#3E4F48] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">eco</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#8A5A64] mb-2">100% Organic Flours &amp; Dairy</h3>
              <p className="text-xs text-[#8E7D7D] leading-relaxed">
                We strictly use pure cultured butter, Madagascar vanilla beans, and non-GMO unbleached flour.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#FDE8EC] shadow-sm text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#FFE9A8] text-[#71612E] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">bakery_dining</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#8A5A64] mb-2">Baked Fresh at Dawn</h3>
              <p className="text-xs text-[#8E7D7D] leading-relaxed">
                Our ovens light up at 5:00 AM every morning. Nothing is stored overnight or frozen.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#FDE8EC] shadow-sm text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#FFD9E0] text-[#733949] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">palette</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#8A5A64] mb-2">Bespoke Artisanal Design</h3>
              <p className="text-xs text-[#8E7D7D] leading-relaxed">
                Every cake is an edible masterpiece handcrafted by master decorators with delicate sugar florals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#FDE8EC] shadow-sm text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#FDE8EC] text-[#894C5C] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">ac_unit</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#8A5A64] mb-2">Chilled Delivery Fleet</h3>
              <p className="text-xs text-[#8E7D7D] leading-relaxed">
                Temperature-controlled vans ensure your delicate buttercream and fresh fruit reach you pristine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            Customer Testimonials
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#8A5A64] mt-1">
            Loved by Our Sweet Patrons
          </h2>
          <p className="text-sm text-[#8E7D7D] mt-2">
            Here is what our wonderful community has to say about our daily bakes and custom celebration cakes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-[#FDE8EC] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[20px] fill">star</span>
                ))}
              </div>
              <p className="text-sm text-[#6B5B5B] italic leading-relaxed mb-6">
                "Sweet Whisk made our wedding cake and it was absolute perfection! Not only did it look like a piece of art, but every single guest raved about the raspberry pistachio filling."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#FFD9E0] text-[#733949] flex items-center justify-center font-bold text-sm">
                EV
              </div>
              <div>
                <p className="font-semibold text-sm text-[#8A5A64]">Eleanor Vance</p>
                <p className="text-xs text-[#8E7D7D]">Bride &amp; Regular Customer</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#FDE8EC] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[20px] fill">star</span>
                ))}
              </div>
              <p className="text-sm text-[#6B5B5B] italic leading-relaxed mb-6">
                "Their macarons are hands down the best in the city. Perfectly crisp shells with creamy, flavorful centers. I stop by every Friday for my pastry box!"
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#FFE9A8] text-[#71612E] flex items-center justify-center font-bold text-sm">
                MC
              </div>
              <div>
                <p className="font-semibold text-sm text-[#8A5A64]">Marcus Chen</p>
                <p className="text-xs text-[#8E7D7D]">Food Critic &amp; Enthusiast</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#FDE8EC] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[20px] fill">star</span>
                ))}
              </div>
              <p className="text-sm text-[#6B5B5B] italic leading-relaxed mb-6">
                "The atmosphere is warm and inviting, and the daily specials never disappoint. The matcha croissant is my absolute morning obsession."
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#DFF3E8] text-[#3E4F48] flex items-center justify-center font-bold text-sm">
                SO
              </div>
              <div>
                <p className="font-semibold text-sm text-[#8A5A64]">Sophia Ortiz</p>
                <p className="text-xs text-[#8E7D7D]">Bloom City Resident</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Custom Cake CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#FDE8EC] to-[#FFD9E0] p-8 sm:p-12 lg:p-16 border border-[#F4A7B9]/40 shadow-lg">
          <div className="max-w-xl">
            <span className="bg-white text-[#894C5C] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              Bespoke Patisserie
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#8A5A64] font-medium mt-4 mb-4 leading-tight">
              Planning a Dream Celebration?
            </h2>
            <p className="text-sm sm:text-base text-[#6B5B5B] leading-relaxed mb-8">
              Tell us your theme, favorite flavors, and guest count. Our master decorators will sculpt and hand-paint a custom masterpiece just for you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/custom-cake"
                className="bg-[#894C5C] text-white hover:bg-[#733949] px-8 py-3.5 rounded-full font-semibold text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>Design Custom Cake</span>
                <span className="material-symbols-outlined text-[18px]">brush</span>
              </Link>
              <Link
                to="/gallery"
                className="bg-white text-[#8A5A64] hover:bg-[#FFF9F3] px-8 py-3.5 rounded-full font-semibold text-sm shadow-sm transition-all"
              >
                Browse Cake Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
