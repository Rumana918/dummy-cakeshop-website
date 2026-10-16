import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI } from '../../services/api';
import toast from 'react-hot-toast';

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productAPI.getAll({ limit: 100 }),
        categoryAPI.getAll({ all: 'true' })
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleAvailability = async (id) => {
    try {
      const res = await productAPI.toggleAvailability(id);
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, isAvailable: res.data.isAvailable } : p))
      );
      toast.success(res.data.isAvailable ? 'Cake is now visible on shop' : 'Cake hidden from shop');
    } catch (err) {
      toast.error('Failed to toggle availability');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Cake deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat =
      selectedCat === 'all' ||
      p.category?._id === selectedCat ||
      p.category?.slug === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#894C5C]">
            Inventory Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#8A5A64]">
            Bakery Products ({products.length})
          </h1>
        </div>

        <Link
          to="/admin/products/add"
          className="bg-[#894C5C] text-white hover:bg-[#733949] px-6 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#FDE8EC] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8E7D7D] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by cake name..."
            className="w-full pl-9 pr-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none focus:border-[#F4A7B9]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-[#FFF9F3] border border-[#FDE8EC] rounded-xl text-xs text-[#6B5B5B] outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#FDE8EC] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-[#8E7D7D]">Loading cakes...</div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FFF9F3] text-[#8E7D7D] border-b border-[#FDE8EC] text-xs">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Cake / Product</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Base Price</th>
                  <th className="py-3.5 px-4 font-semibold">Stock</th>
                  <th className="py-3.5 px-4 font-semibold">Dietary</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FDE8EC]/60">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-[#FFF9F3]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-[#FDE8EC] shrink-0"
                        />
                        <div>
                          <p className="font-bold text-[#8A5A64] line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-[#8E7D7D] line-clamp-1">{p.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-xs font-semibold text-[#6B5B5B]">
                      {p.category?.name || 'Uncategorized'}
                    </td>

                    <td className="py-3 px-4 font-serif font-bold text-[#894C5C]">
                      ₹{p.basePrice}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        p.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {p.isEggless ? (
                        <span className="text-[11px] bg-[#DFF3E8] text-[#3E4F48] px-2 py-0.5 rounded-full font-semibold">
                          Eggless
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#8E7D7D]">Contains Egg</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAvailability(p._id)}
                        className={`text-[11px] font-bold px-3 py-1 rounded-full transition-all ${
                          p.isAvailable
                            ? 'bg-[#DFF3E8] text-[#3E4F48] hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Click to toggle availability"
                      >
                        {p.isAvailable ? 'Available' : 'Hidden'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="p-1.5 rounded-lg text-[#8A5A64] hover:bg-[#FDE8EC] transition-colors"
                          title="Edit Cake"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Delete Cake"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-[#8E7D7D]">
            No products match your search or filter.
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminProducts;
