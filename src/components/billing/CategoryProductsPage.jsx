import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  AlertTriangle, 
  Tag, 
  ArrowRight, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  PackagePlus, 
  Sparkles,
  Lightbulb,
  Zap,
  Wrench,
  CornerUpRight,
  Cpu,
  ToggleRight,
  Droplets,
  Disc,
  CircleDot,
  Package
} from 'lucide-react';

const iconMap = {
  Lightbulb,
  Zap,
  Wrench,
  CornerUpRight,
  Cpu,
  ToggleRight,
  Droplets,
  Disc,
  CircleDot,
  Package
};

export default function CategoryProductsPage({ categoryId, onBackToCategories, onOpenCheckout }) {
  const { 
    categories,
    products, 
    cart, 
    addToCart, 
    updateCartQty, 
    cartSubtotal, 
    cartTotalItems,
    addNewProduct,
    updateProduct,
    deleteProduct 
  } = useShop();

  const [localSearch, setLocalSearch] = useState('');

  // Modals state
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdSize, setNewProdSize] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdAlert, setNewProdAlert] = useState('5');
  const [newProdUnit, setNewProdUnit] = useState('piece');

  // Edit Product Form State
  const [editProdName, setEditProdName] = useState('');
  const [editProdSize, setEditProdSize] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdStock, setEditProdStock] = useState('');
  const [editProdAlert, setEditProdAlert] = useState('5');
  const [editProdUnit, setEditProdUnit] = useState('piece');

  // Find the selected category metadata
  const category = categories.find(c => c.id === categoryId) || {
    id: categoryId,
    name: categoryId,
    tamilName: '',
    icon: 'Package',
    color: 'from-blue-600 to-indigo-700'
  };

  const Icon = iconMap[category.icon] || Package;

  // Filter products for this category
  const categoryProducts = products.filter(p => {
    const isCat = p.category === categoryId;
    const q = localSearch.toLowerCase().trim();
    const isSearchMatch = !q || 
      p.name.toLowerCase().includes(q) || 
      (p.size && p.size.toLowerCase().includes(q));
    return isCat && isSearchMatch;
  });

  // Get cart quantity
  const getCartQty = (productId) => {
    const item = cart.find(i => i.product.id === productId);
    return item ? item.qty : 0;
  };

  // Submit Add Product
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdSize.trim()) {
      alert('Product Name matrum Size / Inches kandippa thevai!');
      return;
    }

    addNewProduct({
      name: newProdName.trim(),
      category: categoryId,
      size: newProdSize.trim(),
      price: parseFloat(newProdPrice) || 0,
      stock: parseInt(newProdStock) || 0,
      lowStockAlert: parseInt(newProdAlert) || 5,
      unit: newProdUnit
    });

    setNewProdName('');
    setNewProdSize('');
    setNewProdPrice('');
    setNewProdStock('20');
    setNewProdAlert('5');
    setIsAddProductModalOpen(false);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setEditProdName(product.name);
    setEditProdSize(product.size || '');
    setEditProdPrice(product.price.toString());
    setEditProdStock(product.stock.toString());
    setEditProdAlert((product.lowStockAlert || 5).toString());
    setEditProdUnit(product.unit || 'piece');
  };

  // Submit Edit Product
  const handleEditProductSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct || !editProdName.trim()) return;

    updateProduct(editingProduct.id, {
      name: editProdName.trim(),
      size: editProdSize.trim(),
      price: parseFloat(editProdPrice) || 0,
      stock: parseInt(editProdStock) || 0,
      lowStockAlert: parseInt(editProdAlert) || 5,
      unit: editProdUnit
    });

    setEditingProduct(null);
  };

  // Delete Product
  const handleDeleteProduct = (product) => {
    if (window.confirm(`"${product.name}" (${product.size}) product-ai neekka venduma?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 pb-32">
      
      {/* Top Navigation: Back to Categories & Add Product Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
        
        {/* Back Button */}
        <button
          onClick={onBackToCategories}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600" />
          <span>⬅️ Categories List-ku Po (Back)</span>
        </button>

        {/* Shop Owner Control: Add Product inside this Category */}
        <button
          onClick={() => {
            // Default size prefix example for screws, bulbs etc.
            setNewProdName(`${category.name} `);
            setIsAddProductModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition active:scale-95 cursor-pointer"
        >
          <PackagePlus className="w-4 h-4" />
          <span>+ Pudhu Product Serka ({category.name})</span>
        </button>

      </div>

      {/* Category Header Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-r ${category.color || 'from-blue-600 to-indigo-700'} text-white shadow-lg mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
            <Icon className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black m-0 text-white leading-tight">
                {category.name}
              </h1>
              {category.tamilName && (
                <span className="text-sm font-bold text-white/80">
                  ({category.tamilName})
                </span>
              )}
            </div>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              Ellam {category.name} porutkalum sizes / inches-udan keezhe ulladhu
            </p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-bold text-white self-start sm:self-auto">
          {categoryProducts.length} Items Available
        </div>
      </div>

      {/* Search inside this category */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={`Search in ${category.name}... (e.g. 1 inch, 2 inch, 1/2", 9W)`}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Products List under this Category */}
      {categoryProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-slate-300">
          <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">Indha category-il porutkal yedhum illai</h3>
          <p className="text-xs text-slate-500 mt-1">
            Mela ulla "+ Pudhu Product Serka" button click panni product serunga.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {categoryProducts.map(product => {
            const inCartQty = getCartQty(product.id);
            const isLowStock = product.stock <= product.lowStockAlert;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl p-4 border-2 transition-all duration-200 flex flex-col justify-between ${
                  inCartQty > 0
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-500/10'
                    : isLowStock
                    ? 'border-rose-200 hover:border-rose-300 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  
                  {/* Top Row: Category tag, Low Stock Warning & Owner Edit/Delete Controls */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {category.name}
                      </span>

                      {/* Stock Alert Badge */}
                      {isOutOfStock ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          Stock Illai (0)
                        </span>
                      ) : isLowStock ? (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 animate-pulse flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Low Stock ({product.stock} left!)
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Stock: {product.stock}
                        </span>
                      )}
                    </div>

                    {/* Shop Owner Controls: Edit & Delete Product */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditProduct(product)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-700 transition cursor-pointer"
                        title="Product Vivaram Matra (Edit Product)"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 transition cursor-pointer"
                        title="Product-ai Neekka (Delete Product)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                  {/* Product Title (e.g. Screw 1 inch, Screw 2 inch) */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug mb-1">
                    {product.name}
                  </h3>

                  {/* SIZE / INCHES HIGHLIGHT (Primary Requirement) */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-950 border border-amber-200 mb-3 text-xs font-black">
                    <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="text-amber-700 font-semibold">Size / Inches:</span>
                    <span>{product.size}</span>
                  </div>

                </div>

                {/* Bottom Row: Rate & Add to Bill Controller */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">Vilai (Rate)</div>
                    <div className="text-lg sm:text-xl font-black text-slate-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Add to Bill Button */}
                  <div>
                    {inCartQty > 0 ? (
                      <div className="flex items-center bg-blue-50 border border-blue-200 rounded-xl p-0.5 shadow-2xs">
                        <button
                          onClick={() => updateCartQty(product.id, inCartQty - 1)}
                          className="w-8 h-8 rounded-lg bg-white text-blue-700 hover:bg-blue-100 flex items-center justify-center font-bold transition shadow-2xs cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-bold text-blue-900 text-sm">
                          {inCartQty}
                        </span>
                        <button
                          onClick={() => addToCart(product, 1)}
                          disabled={product.stock <= inCartQty}
                          className="w-8 h-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center font-bold transition shadow-2xs cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        disabled={isOutOfStock}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-blue-500/25 active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Bill-la Serka</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: ADD New Product under this Category */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-base font-bold m-0 flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-blue-400" />
                <span>Pudhu Product Serka ({category.name})</span>
              </h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="p-5 space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder={`e.g. ${category.name} 1 inch`}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Size / Inches (அளவு) *
                </label>
                <input
                  type="text"
                  required
                  value={newProdSize}
                  onChange={(e) => setNewProdSize(e.target.value)}
                  placeholder="e.g. 1 inch, 2 inch, 1/2 inch, 9W, 1 HP, 6201 ZZ"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vilai / Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unit Type
                  </label>
                  <select
                    value={newProdUnit}
                    onChange={(e) => setNewProdUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold"
                  >
                    <option value="piece">Piece (Pcs)</option>
                    <option value="box">Box</option>
                    <option value="pkt">Packet</option>
                    <option value="roll">Roll</option>
                    <option value="coil">Coil</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    placeholder="20"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-black text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Low Stock Alert Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProdAlert}
                    onChange={(e) => setNewProdAlert(e.target.value)}
                    placeholder="5"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  Product Save Pannu
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: UPDATE Product Details */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-base font-bold m-0 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Product Vivaram Matra (Update Product)</span>
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="p-5 space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Size / Inches (அளவு) *
                </label>
                <input
                  type="text"
                  required
                  value={editProdSize}
                  onChange={(e) => setEditProdSize(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vilai / Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editProdPrice}
                    onChange={(e) => setEditProdPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-black text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stock Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editProdStock}
                    onChange={(e) => setEditProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-black text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Low Stock Warning Alert Limit
                </label>
                <input
                  type="number"
                  min="1"
                  value={editProdAlert}
                  onChange={(e) => setEditProdAlert(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
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
                  Save Changes (மாற்றங்களை சேமி)
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Sticky Bottom Floating Bill Bar (Total Amount displayed at bottom) */}
      {cart.length > 0 && (
        <div className="fixed bottom-14 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-slate-950 text-white rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-800 backdrop-blur-md animate-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-xl bg-amber-400 text-slate-950">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-slate-950">
                  {cartTotalItems}
                </span>
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {cart.length} Items • Moththa Bill:
                </div>
                <div className="text-base sm:text-xl font-black text-amber-400">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenCheckout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
            >
              <span>Bill Podu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
