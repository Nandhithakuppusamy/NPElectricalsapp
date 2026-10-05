import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true
    },
    tamilName: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'Package'
    },
    sizesPreview: {
      type: String,
      default: 'All Sizes Available'
    },
    color: {
      type: String,
      default: 'from-blue-600 to-indigo-700'
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

// Auto-populate custom string id if omitted
CategorySchema.pre('save', function () {
  if (!this.id) {
    this.id = this.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  }
});

export default mongoose.model('Category', CategorySchema);
