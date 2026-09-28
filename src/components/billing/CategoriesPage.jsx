import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Lightbulb,
  Zap,
  Wrench,
  CornerUpRight,
  Cpu,
  ToggleRight,
  Droplets,
  Disc,
  CircleDot,
  Package,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShoppingCart,
  Plus,
  Edit2,
  Trash2,
  X,
  Settings,
  ShieldCheck
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

export default function CategoriesPage({ onSelectCategory, onOpenCheckout }) {
  const { 
    categories, 
    products, 
    cart, 
    cartSubtotal, 
    cartTotalItems,
    addNewCategory,
    updateCategory,
    deleteCategory 
  } = useShop();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states for Add Category
  const [newCatName, setNewCatName] = useState('');
  const [newCatTamilName, setNewCatTamilName] = useState('');
  const [newCatSizesPreview, setNewCatSizesPreview] = useState('');

  // Form states for Edit Category
  const [editName, setEditName] = useState('');
  const [editTamilName, setEditTamilName] = useState('');
  const [editSizesPreview, setEditSizesPreview] = useState('');

  // Handle Add Category
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      alert('Category Name kandippa podanum!');
      return;
    }

    addNewCategory({
      name: newCatName.trim(),
      tamilName: newCatTamilName.trim() || newCatName.trim(),
      sizesPreview: newCatSizesPreview.trim() || 'All Sizes Available',
      icon: 'Package',
      color: 'from-blue-600 to-indigo-700'
    });

    setNewCatName('');
    setNewCatTamilName('');
    setNewCatSizesPreview('');
    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (e, cat) => {
    e.stopPropagation(); // prevent navigating to category products
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditTamilName(cat.tamilName || '');
    setEditSizesPreview(cat.sizesPreview || '');
  };

  // Handle Edit Category Submit
  const handleEditCategorySubmit = (e) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;

    updateCategory(editingCategory.id, {
      name: editName.trim(),
      tamilName: editTamilName.trim(),
      sizesPreview: editSizesPreview.trim()
    });

    setEditingCategory(null);
  };

  // Handle Delete Category
  const handleDelete = (e, cat) => {
    e.stopPropagation(); // prevent navigating
    const productCount = products.filter(p => p.category === cat.id).length;
    const confirmMsg = productCount > 0
      ? `"${cat.name}" category-ai neekka venduma? Idharkul ulla ${productCount} products-um delete aagum!`
      : `"${cat.name}" category-ai delete panna venduma?`;

    if (window.confirm(confirmMsg)) {
      deleteCategory(cat.id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 pb-32">
      
      {/* Top Banner with Shop Owner Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>NP Electricals • Categories Page (No Products Here)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight m-0">
            Porul Categories (பிரிவுகள்)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Category-ai click pannunga product list paarka, illana pudhu category serka/manage pannunga:
          </p>
        </div>

        {/* Shop Owner Control: ADD New Category */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-600/25 transition cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Pudhu Category Serka</span>
        </button>
      </div>

      {/* 10+ Categories Grid ONLY - Clean, No products on this page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {categories.map((cat, index) => {
          const Icon = iconMap[cat.icon] || Package;
          const count = products.filter(p => p.category === cat.id).length;
          
          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative p-4 sm:p-5 bg-white hover:bg-slate-50/80 rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99]"
            >
              {/* Category Icon & Info */}
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
                <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${cat.color || 'from-blue-600 to-indigo-700'} text-white flex items-center justify-center shadow-md shadow-slate-300/50 shrink-0 group-hover:scale-105 transition duration-200`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-slate-400 shrink-0">
                      #{index + 1}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 m-0 group-hover:text-blue-600 transition truncate">
                      {cat.name}
                    </h2>
                    {cat.tamilName && (
                      <span className="text-xs font-bold text-slate-500 truncate">
                        ({cat.tamilName})
                      </span>
                    )}
                  </div>

                  {/* Sizes Preview */}
                  <div className="text-xs text-amber-700 font-semibold mt-0.5 truncate">
                    Sizes: <span className="text-slate-600 font-medium">{cat.sizesPreview}</span>
                  </div>

                  {/* Product Count Badge */}
                  <div className="text-[11px] text-slate-400 mt-1">
                    {count} products available
                  </div>
                </div>
              </div>

              {/* Action Buttons: Shop Owner Controls (Edit & Delete) + View Arrow */}
              <div className="flex items-center gap-1.5 shrink-0">
                
                {/* Shop Owner Control: UPDATE Category Name */}
                <button
                  type="button"
                  onClick={(e) => handleOpenEdit(e, cat)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition cursor-pointer"
                  title="Category Peyarai Matra (Update Category)"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                {/* Shop Owner Control: DELETE Category */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, cat)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition cursor-pointer"
                  title="Category-ai Neekka (Delete Category)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Right Arrow (Click to open products page) */}
                <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition ml-1 text-blue-600">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL 1: ADD New Category */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-base font-bold m-0 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <span>Pudhu Category Serka (Add Category)</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="p-5 space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Capacitor, Fan Blade, Water Tank"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tamil Name (தமிழ் பெயர்)
                </label>
                <input
                  type="text"
                  value={newCatTamilName}
                  onChange={(e) => setNewCatTamilName(e.target.value)}
                  placeholder="e.g. கெபாசிட்டர் / மின் தேக்கி"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sizes / Inches Preview (அளவுகள்)
                </label>
                <input
                  type="text"
                  value={newCatSizesPreview}
                  onChange={(e) => setNewCatSizesPreview(e.target.value)}
                  placeholder="e.g. 2.5 MFD, 3.15 MFD, 36 MFD"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

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
                  Category Save Pannu
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: UPDATE Category Name */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-base font-bold m-0 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Category Peyarai Matra (Update Category)</span>
              </h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditCategorySubmit} className="p-5 space-y-3.5">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tamil Name (தமிழ் பெயர்)
                </label>
                <input
                  type="text"
                  value={editTamilName}
                  onChange={(e) => setEditTamilName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sizes / Inches Preview
                </label>
                <input
                  type="text"
                  value={editSizesPreview}
                  onChange={(e) => setEditSizesPreview(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
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

      {/* Floating Bottom Cart / Bill Total Bar (if items added) */}
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
