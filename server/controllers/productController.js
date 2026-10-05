import Product from '../models/Product.js';

// @desc    Get all products (with optional search and low stock filter)
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { category, lowStock, search } = req.query;
    let query = {};

    if (category) {
      query.categoryId = category;
    }

    if (lowStock === 'true') {
      query.$expr = { $lte: ['$stockCount', '$lowStockAlert'] };
    }

    if (search) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { size: { $regex: q, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ categoryId: 1, name: 1 });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
export const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ categoryId }).sort({ name: 1 });
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add new product
// @route   POST /api/products
export const addProduct = async (req, res, next) => {
  try {
    const { categoryId, category, name, size, price, stockCount, stock, lowStockAlert, unit, imageUrl } = req.body;

    const assignedCategory = categoryId || category;

    if (!assignedCategory || !name || !size) {
      return res.status(400).json({
        success: false,
        message: 'Category, Product Name, and Size/Inches are required'
      });
    }

    const finalStock = stockCount !== undefined ? parseInt(stockCount) : (stock !== undefined ? parseInt(stock) : 0);
    const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : (imageUrl ? imageUrl.trim() : '');

    const product = await Product.create({
      id: `prod_${assignedCategory}_${Date.now()}`,
      categoryId: assignedCategory,
      name: name.trim(),
      size: size.trim(),
      price: parseFloat(price) || 0,
      stockCount: isNaN(finalStock) ? 0 : finalStock,
      lowStockAlert: parseInt(lowStockAlert) || 5,
      unit: unit || 'piece',
      imageUrl: finalImageUrl
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product details
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, size, price, stockCount, stock, lowStockAlert, unit, categoryId, imageUrl } = req.body;

    let product = await Product.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (name) product.name = name.trim();
    if (size) product.size = size.trim();
    if (price !== undefined) product.price = parseFloat(price) || 0;
    if (stockCount !== undefined) product.stockCount = parseInt(stockCount) || 0;
    else if (stock !== undefined) product.stockCount = parseInt(stock) || 0;
    if (lowStockAlert !== undefined) product.lowStockAlert = parseInt(lowStockAlert) || 5;
    if (unit) product.unit = unit;
    if (categoryId) product.categoryId = categoryId;
    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl !== undefined) {
      product.imageUrl = imageUrl.trim();
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product image specifically
// @route   PATCH /api/products/:id/image
export const updateProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      product.imageUrl = req.body.imageUrl.trim();
    } else {
      return res.status(400).json({
        success: false,
        message: 'No image file or URL provided'
      });
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product image updated successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update product stock (quick restock or manual set)
// @route   PATCH /api/products/:id/stock
export const updateStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { delta, newStock } = req.body;

    let product = await Product.findOne({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (newStock !== undefined) {
      product.stockCount = Math.max(0, parseInt(newStock) || 0);
    } else if (delta !== undefined) {
      product.stockCount = Math.max(0, product.stockCount + parseInt(delta));
    }

    await product.save();

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
      data: { id: product.id }
    });
  } catch (err) {
    next(err);
  }
};
