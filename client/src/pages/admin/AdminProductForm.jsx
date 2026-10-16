import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [variants, setVariants] = useState([
    { weight: '500g', price: 650 },
    { weight: '1kg', price: 1200 },
    { weight: '2kg', price: 2300 }
  ]);
  const [flavors, setFlavors] = useState(['Classic Vanilla', 'Belgian Chocolate']);
  const [newFlavorInput, setNewFlavorInput] = useState('');
  const [isEggless, setIsEggless] = useState(true);
  const [ingredients, setIngredients] = useState('');
  const [stock, setStock] = useState('20');
  const [images, setImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await categoryAPI.getAll({ all: 'true' });
        setCategories(catRes.data.categories || []);

        if (isEdit) {
          const prodRes = await productAPI.getById(id);
          const p = prodRes.data.product;
          setName(p.name);
          setDescription(p.description);
          setCategory(p.category?._id || p.category);
          setBasePrice(p.basePrice);
          if (p.variants && p.variants.length > 0) setVariants(p.variants);
          if (p.flavors) setFlavors(p.flavors);
          setIsEggless(Boolean(p.isEggless));
          setIngredients(p.ingredients || '');
          setStock(p.stock.toString());
          setImages(p.images || []);
          setIsFeatured(Boolean(p.isFeatured));
          setIsBestSeller(Boolean(p.isBestSeller));
          setIsAvailable(p.isAvailable !== undefined ? Boolean(p.isAvailable) : true);
        } else if (catRes.data.categories?.length > 0) {
          setCategory(catRes.data.categories[0]._id);
        }
      } catch (err) {
        toast.error('Failed to load cake data');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEdit]);

  // Variant operations
  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = field === 'price' ? Number(value) : value;
    setVariants(updated);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { weight: '500g', price: Number(basePrice) || 600 }]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Flavor operations
  const handleAddFlavor = () => {
    if (newFlavorInput.trim() && !flavors.includes(newFlavorInput.trim())) {
      setFlavors([...flavors, newFlavorInput.trim()]);
      setNewFlavorInput('');
    }
  };

  const handleRemoveFlavor = (flavorToRemove) => {
    setFlavors(flavors.filter((f) => f !== flavorToRemove));
  };

  // Image operations
  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !basePrice || !description) {
      toast.error('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('basePrice', Number(basePrice));
      formData.append('variants', JSON.stringify(variants));
      formData.append('flavors', JSON.stringify(flavors));
      formData.append('isEggless', isEggless);
      formData.append('ingredients', ingredients);
      formData.append('stock', Number(stock));
      formData.append('isFeatured', isFeatured);
      formData.append('isBestSeller', isBestSeller);
      formData.append('isAvailable', isAvailable);

      images.forEach((url) => {
        formData.append('images', url);
      });

      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      if (isEdit) {
        await productAPI.update(id, formData);
        toast.success('Cake updated successfully! ✨');
      } else {
        await productAPI.create(formData);
        toast.success('New cake added to bakery catalog! 🎂');
      }

      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Error saving cake');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading form...</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/products" className="text-xs text-[#894C5C] font-semibold hover:underline inline-flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to Products
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            {isEdit ? 'Edit Bakery Product' : 'Add New Cake / Product'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#8A5A64]">Product Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Cake / Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Pistachio Raspberry Bloom Cake"
                className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Description &amp; Tasting Notes *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the layers, textures, and sensory flavors..."
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Base Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="650"
                className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Stock Inventory Count *
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
                className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
            </div>
          </div>
        </div>

        {/* Variants & Flavors Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-lg font-bold text-[#8A5A64]">
              Weight &amp; Price Variants
            </h3>
            <button
              type="button"
              onClick={handleAddVariant}
              className="bg-[#FDE8EC] text-[#8A5A64] hover:bg-[#FCD1D9] px-3.5 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>Add Size</span>
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input
                  type="text"
                  value={v.weight}
                  onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)}
                  placeholder="e.g. 500g, 1kg, 2kg"
                  className="w-1/2 px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                />
                <div className="relative w-1/2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8E7D7D]">₹</span>
                  <input
                    type="number"
                    value={v.price}
                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                    placeholder="Price"
                    className="w-full pl-7 pr-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                  />
                </div>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Flavors Manager */}
          <div className="pt-4 border-t border-[#FDE8EC]">
            <h4 className="font-serif text-base font-bold text-[#8A5A64] mb-2">
              Available Flavors
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {flavors.map((flv) => (
                <span
                  key={flv}
                  className="bg-[#FFF9F3] border border-[#FDE8EC] text-xs font-medium text-[#6B5B5B] px-3 py-1 rounded-full flex items-center gap-1.5"
                >
                  <span>{flv}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFlavor(flv)}
                    className="text-[#8E7D7D] hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newFlavorInput}
                onChange={(e) => setNewFlavorInput(e.target.value)}
                placeholder="Add flavor (e.g. Raspberry Curd)"
                className="w-full px-3 py-1.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
              />
              <button
                type="button"
                onClick={handleAddFlavor}
                className="bg-[#894C5C] text-white px-4 py-1.5 rounded-xl text-xs font-bold shrink-0"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Ingredients & Flags Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#8A5A64]">Dietary &amp; Badges</h3>

          <div>
            <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
              Ingredients &amp; Allergens Text
            </label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Cultured butter, unbleached flour, raw sugar, Valrhona dark chocolate..."
              className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
            />
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#6B5B5B]">
              <input
                type="checkbox"
                checked={isEggless}
                onChange={(e) => setIsEggless(e.target.checked)}
                className="w-4 h-4 accent-[#894C5C] rounded"
              />
              <span>100% Eggless (Vegetarian)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#6B5B5B]">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#894C5C] rounded"
              />
              <span>Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#6B5B5B]">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 accent-[#894C5C] rounded"
              />
              <span>Best-Seller Badge</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-[#6B5B5B]">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 accent-[#894C5C] rounded"
              />
              <span>Visible in Menu (Available)</span>
            </label>
          </div>
        </div>

        {/* Images Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#8A5A64]">Product Photography</h3>

          {/* Current Images */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[#FDE8EC]">
                  <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs"
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Upload Image Files
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                className="w-full text-xs text-[#8E7D7D] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFD9E0] file:text-[#733949] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                Or Add Image Web URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-[#894C5C] text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0"
                >
                  Add URL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-full text-xs font-semibold text-[#8E7D7D] hover:text-[#8A5A64]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#894C5C] text-white hover:bg-[#733949] px-8 py-3.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Cake'}
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminProductForm;
