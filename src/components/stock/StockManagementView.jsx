import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Boxes, 
  Search, 
  Plus, 
  AlertTriangle, 
  Check, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  Layers, 
  Tag, 
  X, 
  Sparkles,
  PackagePlus,
  RefreshCw
} from 'lucide-react';

export default function StockManagementView() {
  const { 
    categories,
    products, 
    lowStockProducts, 
    quickAddStock, 
    updateProductStock, 
    addNewProduct, 
    updateProduct, 
    deleteProduct 
  } = useShop();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'bulb',
    size: '',
    price: '',
    stock: '',
    lowStockAlert: '5',
    unit: 'piece'
  });

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      (p.size && p.size.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q);
    const matchesLowStock = !showLowStockOnly || p.stock <= p.lowStockAlert;
    return matchesCategory && matchesSearch && matchesLowStock;
  });

  // Handle Add Product Submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.size.trim()) {
      alert('Product name matrum Size/Inches kandippa enter pannanum!');
      return;
    }

    addNewProduct(formData);
    setFormData({
      name: '',
      category: 'bulb',
      size: '',
      price: '',
      stock: '',
      lowStockAlert: '5',
      unit: 'piece'
    });
    setIsAddModalOpen(false);
  };

  // Handle Edit Product Submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      size: editingProduct.size,
      price: parseFloat(editingProduct.price) || 0,
      stock: parseInt(editingProduct.stock) || 0,
      lowStockAlert: parseInt(editingProduct.lowStockAlert) || 5,
      unit: editingProduct.unit || 'piece'
    });

    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-28 sm:pb-24">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 m-0">
            <Boxes className="w-6 h-6 text-blue-600" />
            <span>Sarakku & Stock Nilavaram (Stock Management)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sarakku iruppu kanakku, low stock warnings, matrum pudhu sarakku serkkum idam
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition cursor-pointer self-start sm:self-auto"
        >
          <PackagePlus className="w-4 h-4" />
          <span>+ Pudhu Sarakku / Item Serka</span>
        </button>
      </div>

      {/* ⚠️ LOW STOCK WARNING ALERT BANNER */}
      {lowStockProducts.length > 0 && (
        <div className="mb-5 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-2 border-rose-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 animate-bounce" />
              <span>
                ⚠️ Low Stock Warning! ({lowStockProducts.length} Porutkal Kammiya Irukku!)
              </span>
            </div>
            <button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className="text-xs font-bold px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition shrink-0 cursor-pointer"
            >
              {showLowStockOnly ? 'Show All Products' : 'Ivaigala Mattum Paaru'}
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-1">
            Keezhe ulla porutkalin stock limit kuraindhadhu. Udane stock order podavum:
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {lowStockProducts.slice(0, 6).map(p => (
              <div
                key={p.id}
                className="bg-white px-3 py-1.5 rounded-xl border border-rose-200 text-xs shadow-2xs flex items-center gap-2"
              >
                <div>
                  <span className="font-bold text-slate-800">{p.name}</span>
                  <span className="text-slate-400 text-[10px] ml-1">({p.size})</span>
                </div>
                <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 font-black text-[11px]">
                  {p.stock} left
                </span>
                <button
                  onClick={() => quickAddStock(p.id, 10)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200"
                  title="Quick restock +10"
                >
                  +10 Podu
                </button>
              </div>
            ))}
            {lowStockProducts.length > 6 && (
              <span className="text-xs font-bold text-rose-600 self-center">
                +{lowStockProducts.length - 6} more items
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search item, size / inches..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showLowStockOnly
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Low Stock Mattum ({lowStockProducts.length})</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 no-scrollbar">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            selectedCategory === null
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Ellam ({products.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.name} ({products.filter(p => p.category === cat.id).length})
          </button>
        ))}
      </div>

      {/* Products Stock Table / Mobile Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-3 sm:px-4">Product Name & Category</th>
                <th className="py-3 px-3 sm:px-4">Size / Inches</th>
                <th className="py-3 px-3 sm:px-4">Vilai (Rate)</th>
                <th className="py-3 px-3 sm:px-4 text-center">Current Stock</th>
                <th className="py-3 px-3 sm:px-4">Stock Status</th>
                <th className="py-3 px-3 sm:px-4 text-right">Quick Restock</th>
                <th className="py-3 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => {
                const isLow = product.stock <= product.lowStockAlert;
                const isZero = product.stock <= 0;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Name & Category */}
                    <td className="py-3 px-3 sm:px-4">
                      <div className="font-bold text-slate-900">{product.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{product.category.replace('_', ' ')}</div>
                    </td>

                    {/* Size / Inches */}
                    <td className="py-3 px-3 sm:px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs">
                        {product.size}
                      </span>
                    </td>

                    {/* Rate */}
                    <td className="py-3 px-3 sm:px-4 font-black text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </td>

                    {/* Stock Count (Editable inline) */}
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={product.stock}
                        onChange={(e) => updateProductStock(product.id, e.target.value)}
                        className={`w-16 text-center py-1 rounded-lg border font-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isLow ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 sm:px-4">
                      {isZero ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
                          Stock Illai (0)
                        </span>
                      ) : isLow ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Low Stock Warning!
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3" />
                          Stock Nalla Irukku
                        </span>
                      )}
                    </td>

                    {/* Quick Restock Buttons */}
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => quickAddStock(product.id, 5)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-md text-[11px] transition cursor-pointer"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => quickAddStock(product.id, 10)}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-md text-[11px] transition cursor-pointer"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => quickAddStock(product.id, 25)}
                          className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md text-[11px] transition cursor-pointer"
                        >
                          +25
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`"${product.name}"-ai neekka venduma?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add New Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-base font-bold m-0 flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-amber-400" />
                <span>Pudhu Sarakku / Item Serka</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-3.5">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.tamilName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Philips LED Batten Light"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Size / Inches */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Size / Inches (அளவு) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="e.g. 1/2 Inch, 3/4 Inch, 9W, 1 HP, 6201 ZZ"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price & Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vilai (Price ₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 95"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Alavu Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium"
                  >
                    <option value="piece">Piece (Pcs)</option>
                    <option value="box">Box (100 pcs)</option>
                    <option value="roll">Roll</option>
                    <option value="coil">Coil (90m)</option>
                    <option value="pkt">Packet</option>
                  </select>
                </div>
              </div>

              {/* Stock Count & Low Stock Alert Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Initial Stock Count *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="e.g. 20"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Low Stock Warning Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.lowStockAlert}
                    onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
                    placeholder="5"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  Sarakku Serka (Save Product)
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: Edit Product */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-base font-bold m-0 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <span>Sarakku Matra (Edit Product)</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Size / Inches</label>
                <input
                  type="text"
                  required
                  value={editingProduct.size}
                  onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Count</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Low Stock Warning Alert Level</label>
                <input
                  type="number"
                  min="1"
                  value={editingProduct.lowStockAlert}
                  onChange={(e) => setEditingProduct({ ...editingProduct, lowStockAlert: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
