import React from 'react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="w-full bg-[#FFF9F3] py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            Our Heritage &amp; Craft
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#8A5A64] font-medium mt-1">
            The Story Behind Sweet Whisk
          </h1>
          <p className="text-sm sm:text-base text-[#8E7D7D] mt-3 leading-relaxed">
            Founded with a passion for traditional French patisserie techniques, uncompromised organic sourcing, and the timeless magic of fresh morning ovens.
          </p>
        </div>

        {/* Section 1: The Beginning */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80"
                alt="Sweet Whisk Bakery Kitchen"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 bg-[#FFE9A8] p-4 sm:p-5 rounded-2xl shadow-lg max-w-xs">
              <p className="font-serif text-base font-bold text-[#71612E]">Baking since 2018</p>
              <p className="text-xs text-[#71612E]/80 mt-1">Over 85,000 celebration cakes crafted with love.</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4 text-sm text-[#6B5B5B] leading-relaxed">
            <span className="bg-[#FFD9E0] text-[#733949] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Artisanal Philosophy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#8A5A64]">
              Where Butter Meets Botanical Elegance
            </h2>
            <p>
              Sweet Whisk started as an intimate neighborhood micro-bakery with just one French convection oven and a vision: to elevate everyday moments into poetic celebrations.
            </p>
            <p>
              Unlike mass-production cake shops, every single sponge at Sweet Whisk is slow-whipped in small batches. We hand-crack farm-fresh eggs, churn organic butter to delicate airy peaks, and fold in pure fruit reductions with culinary patience.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-white rounded-2xl border border-[#FDE8EC]">
                <h4 className="font-serif text-lg font-bold text-[#894C5C]">0% Artificial</h4>
                <p className="text-xs text-[#8E7D7D] mt-0.5">No synthetic food scents or stabilizers</p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-[#FDE8EC]">
                <h4 className="font-serif text-lg font-bold text-[#894C5C]">100% Passion</h4>
                <p className="text-xs text-[#8E7D7D] mt-0.5">Hand-decorated by Le Cordon Bleu trained chefs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Ingredients That Matter */}
        <div className="bg-[#FDE8EC]/60 rounded-3xl p-8 sm:p-12 mb-20 border border-[#F4A7B9]/30">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
              Uncompromising Standards
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#8A5A64] mt-1">
              Pure, Honest Ingredients
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#FDE8EC] shadow-sm text-center">
              <span className="text-3xl mb-3 block">🧈</span>
              <h4 className="font-serif text-base font-bold text-[#8A5A64] mb-1">Cultured French Butter</h4>
              <p className="text-xs text-[#8E7D7D] leading-relaxed">
                84% butterfat European cultured butter giving our pastries a rich hazelnut aroma and flaky crust.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#FDE8EC] shadow-sm text-center">
              <span className="text-3xl mb-3 block">🍫</span>
              <h4 className="font-serif text-base font-bold text-[#8A5A64] mb-1">Single-Origin Chocolate</h4>
              <p className="text-xs text-[#8E7D7D] leading-relaxed">
                Sourced exclusively from Callebaut and Valrhona fair-trade sustainable plantations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#FDE8EC] shadow-sm text-center">
              <span className="text-3xl mb-3 block">🍓</span>
              <h4 className="font-serif text-base font-bold text-[#8A5A64] mb-1">Hand-Picked Berry Compotes</h4>
              <p className="text-xs text-[#8E7D7D] leading-relaxed">
                Simmered slowly in small copper pots with unrefined cane sugar and fragrant Madagascar vanilla.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Meet Our Master Decorators */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#894C5C] font-semibold text-xs uppercase tracking-widest">
            The Artists
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#8A5A64] mt-1">
            Meet the Masters at the Oven
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-3xl overflow-hidden border border-[#FDE8EC] shadow-sm text-center p-6">
            <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#F4A7B9]">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&auto=format&fit=crop&q=80"
                alt="Chef Camille Moreau"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#8A5A64]">Camille Moreau</h4>
            <p className="text-xs font-semibold text-[#894C5C] mb-2">Head Pastry Chef &amp; Founder</p>
            <p className="text-xs text-[#8E7D7D] leading-relaxed">
              Trained in Paris, Camille brings 12 years of French entremet expertise and an obsession with delicate botanical sponge pairings.
            </p>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-[#FDE8EC] shadow-sm text-center p-6">
            <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#F4A7B9]">
              <img
                src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&auto=format&fit=crop&q=80"
                alt="Aarav Sharma"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#8A5A64]">Aarav Sharma</h4>
            <p className="text-xs font-semibold text-[#894C5C] mb-2">Master Sugar Artist</p>
            <p className="text-xs text-[#8E7D7D] leading-relaxed">
              Specializing in lifelike handcrafted sugar peonies and watercolor buttercream finishes for multi-tier wedding cakes.
            </p>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-[#FDE8EC] shadow-sm text-center p-6">
            <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#F4A7B9]">
              <img
                src="https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&auto=format&fit=crop&q=80"
                alt="Isabella Chen"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#8A5A64]">Isabella Chen</h4>
            <p className="text-xs font-semibold text-[#894C5C] mb-2">Viennoiserie Specialist</p>
            <p className="text-xs text-[#8E7D7D] leading-relaxed">
              Responsible for the hundreds of crisp, shatteringly buttery layers in our croissants and weekend morning brioches.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-white p-8 rounded-3xl border border-[#FDE8EC] shadow-sm max-w-xl mx-auto">
          <h4 className="font-serif text-xl font-bold text-[#8A5A64] mb-2">Taste the Craftsmanship</h4>
          <p className="text-xs text-[#8E7D7D] mb-5">
            Visit our boutique cafe or order your celebration cake online with same-day doorstep chilled delivery.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/menu"
              className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              Order Online
            </Link>
            <Link
              to="/contact"
              className="bg-[#FDE8EC] text-[#8A5A64] hover:bg-[#FCD1D9] px-6 py-2.5 rounded-full text-xs font-bold transition-all"
            >
              Visit Our Bakery
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
