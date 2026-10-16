import React, { useEffect, useState } from 'react';
import { categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [order, setOrder] = useState('0');
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getAll({ all: 'true' });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('');
    setOrder('0');
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setOrder(cat.order?.toString() || '0');
    setImageFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);
      formData.append('order', Number(order));
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await categoryAPI.create(formData);
        toast.success('Category created successfully');
      }

      setShowModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    try {
      await categoryAPI.delete(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
            Classification
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Bakery Categories ({categories.length})
          </h1>
        </div>

        <button
          onClick={openAddModal}
          className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Cards */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-3xl border border-[#FDE8EC] shadow-sm overflow-hidden p-5 flex flex-col justify-between"
            >
              <div>
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-[#FDE8EC] mb-4">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-serif text-lg font-bold text-[#8A5A64]">{cat.name}</h3>
                  <span className="text-[10px] text-[#8E7D7D] bg-[#FFF9F3] border border-[#FDE8EC] px-2 py-0.5 rounded-full">
                    Order: {cat.order}
                  </span>
                </div>
                <p className="text-xs text-[#8E7D7D] line-clamp-2 leading-relaxed">
                  {cat.description || 'Artisanal cake category'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#FDE8EC] mt-4">
                <span className="text-[11px] text-[#894C5C] font-semibold">
                  Slug: /{cat.slug}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-[#8A5A64] hover:bg-[#FDE8EC] rounded-lg"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id, cat.name)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#FDE8EC] shadow-2xl max-w-md w-full animate-fadeIn">
            <h3 className="font-serif text-xl font-bold text-[#8A5A64] mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Signature Cakes"
                  className="w-full px-4 py-2.5 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-sm text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary..."
                  className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#8A5A64] uppercase tracking-wider mb-1">
                  Image Web URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
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
                  Display Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-[#8E7D7D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2 rounded-full text-xs font-bold shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminCategories;
