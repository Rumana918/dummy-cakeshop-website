import React, { useEffect, useState } from 'react';
import { galleryAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pastries');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await galleryAPI.get('All');
      setImages(res.data.images || []);
    } catch (err) {
      console.error('Failed to load gallery images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || (!imageUrl && !imageFile)) {
      toast.error('Please provide a title and image');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('imageUrl', imageUrl);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await galleryAPI.create(formData);
      toast.success('Image published to public gallery! 📸');
      setShowModal(false);
      setTitle('');
      setImageUrl('');
      setImageFile(null);
      setDescription('');
      fetchImages();
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, imgTitle) => {
    if (!window.confirm(`Delete image "${imgTitle}"?`)) return;
    try {
      await galleryAPI.delete(id);
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success('Image removed from gallery');
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
            Visual Showcase
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Gallery Media ({images.length})
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
          <span>Upload Image</span>
        </button>
      </div>

      {/* Grid of Images */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading gallery media...</div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img._id}
              className="bg-white rounded-3xl border border-[#FDE8EC] shadow-sm overflow-hidden p-3.5 flex flex-col justify-between group"
            >
              <div>
                <div className="w-full aspect-square rounded-2xl overflow-hidden bg-[#FDE8EC] relative mb-3">
                  <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 bg-[#FFE9A8] text-[#71612E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {img.category}
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-[#8A5A64] line-clamp-1">{img.title}</h4>
                {img.description && (
                  <p className="text-xs text-[#8E7D7D] line-clamp-1 mt-0.5">{img.description}</p>
                )}
              </div>

              <div className="flex justify-end pt-3 border-t border-[#FDE8EC] mt-3">
                <button
                  onClick={() => handleDelete(img._id, img.title)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-xs text-[#8E7D7D] bg-white rounded-3xl border border-[#FDE8EC]">
          No gallery images uploaded yet. Click "Upload Image" to showcase bakery cakes!
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-2xl max-w-md w-full animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-[#8A5A64] mb-4">
              Add Image to Gallery
            </h3>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Creation Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lavender Wedding Floral Tier"
                  className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none"
                >
                  <option value="Weddings">Weddings</option>
                  <option value="Birthdays">Birthdays</option>
                  <option value="Anniversaries">Anniversaries</option>
                  <option value="Cupcakes">Cupcakes</option>
                  <option value="Pastries">Pastries</option>
                  <option value="Custom Cakes">Custom Cakes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Image Web URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Or Upload Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-[#8E7D7D] file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#FFD9E0] file:text-[#733949]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Sugar peony florals with silver eucalyptus leaf."
                  className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 text-xs font-semibold text-[#8E7D7D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2 rounded-full text-xs font-bold shadow-sm"
                >
                  {saving ? 'Publishing...' : 'Publish Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminGallery;
