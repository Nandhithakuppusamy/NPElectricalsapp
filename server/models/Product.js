import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true
    },
    categoryId: {
      type: String,
      required: [true, 'Category ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    size: {
      type: String,
      required: [true, 'Size or inches is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      default: 0
    },
    stockCount: {
      type: Number,
      required: true,
      default: 0
    },
    lowStockAlert: {
      type: Number,
      default: 5
    },
    unit: {
      type: String,
      default: 'piece'
    },
    imageUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Virtual alias 'stock' <-> 'stockCount' for seamless compatibility
ProductSchema.virtual('stock').get(function () {
  return this.stockCount;
}).set(function (v) {
  this.stockCount = v;
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

ProductSchema.pre('save', function () {
  if (!this.id) {
    this.id = `prod_${this.categoryId}_${Date.now()}`;
  }
});

export default mongoose.model('Product', ProductSchema);
