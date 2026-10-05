import Category from '../models/Category.js';
import Product from '../models/Product.js';

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json({
      success: true,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new category
// @route   POST /api/categories
export const addCategory = async (req, res, next) => {
  try {
    const { name, tamilName, icon, sizesPreview, color, imageUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const rawId = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    
    // Check if category ID or name already exists
    const existing = await Category.findOne({
      $or: [{ id: rawId }, { name: new RegExp(`^${name.trim()}$`, 'i') }]
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // Determine imageUrl if file uploaded directly or provided in body
    const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : (imageUrl ? imageUrl.trim() : '');

    const category = await Category.create({
      id: rawId || `cat_${Date.now()}`,
      name: name.trim(),
      tamilName: tamilName ? tamilName.trim() : name.trim(),
      icon: icon || 'Package',
      sizesPreview: sizesPreview ? sizesPreview.trim() : 'All Sizes Available',
      color: color || 'from-blue-600 to-indigo-700',
      imageUrl: finalImageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Category added successfully',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category details/name/image
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, tamilName, sizesPreview, icon, color, imageUrl } = req.body;

    let category = await Category.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name) category.name = name.trim();
    if (tamilName !== undefined) category.tamilName = tamilName.trim();
    if (sizesPreview !== undefined) category.sizesPreview = sizesPreview.trim();
    if (icon) category.icon = icon;
    if (color) category.color = color;
    if (req.file) {
      category.imageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      category.imageUrl = imageUrl.trim();
    }

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category image specifically
// @route   PATCH /api/categories/:id/image
export const updateCategoryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let category = await Category.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (req.file) {
      category.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      category.imageUrl = req.body.imageUrl.trim();
    } else {
      return res.status(400).json({
        success: false,
        message: 'No image file or URL provided'
      });
    }

    await category.save();

    res.json({
      success: true,
      message: 'Category image updated successfully',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category and associated products
// @route   DELETE /api/categories/:id
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const catId = category.id;
    await Category.deleteOne({ _id: category._id });

    // Also cascade delete products under this category
    const deleteResult = await Product.deleteMany({ categoryId: catId });

    res.json({
      success: true,
      message: `Category deleted successfully along with ${deleteResult.deletedCount} products`,
      data: { id: catId }
    });
  } catch (err) {
    next(err);
  }
};
