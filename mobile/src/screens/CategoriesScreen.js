import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { getCategoryDefaultImage } from '../data/initialData';
import ResponsiveContainer from '../components/ResponsiveContainer';
import Header from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

export default function CategoriesScreen({ navigation }) {
  const { categories, products, addNewCategory, updateCategory, deleteCategory } = useShop();
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 2 : 1;

  // Dialog / Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Add Form State
  const [newName, setNewName] = useState('');
  const [newTamilName, setNewTamilName] = useState('');
  const [newSizesPreview, setNewSizesPreview] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editTamilName, setEditTamilName] = useState('');
  const [editSizesPreview, setEditSizesPreview] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  const handleAddSubmit = async () => {
    if (!newName.trim()) {
      Alert.alert('Category Name Thevai', 'Category Peyar kandippa enter pannanum!');
      return;
    }
    await addNewCategory({
      name: newName.trim(),
      tamilName: newTamilName.trim() || newName.trim(),
      sizesPreview: newSizesPreview.trim() || 'All Sizes Available',
      imageUrl: newImageUrl.trim()
    });
    setNewName('');
    setNewTamilName('');
    setNewSizesPreview('');
    setNewImageUrl('');
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditTamilName(cat.tamilName || '');
    setEditSizesPreview(cat.sizesPreview || '');
    setEditImageUrl(cat.imageUrl || '');
  };

  const handleEditSubmit = async () => {
    if (!editingCategory || !editName.trim()) return;
    await updateCategory(editingCategory.id, {
      name: editName.trim(),
      tamilName: editTamilName.trim() || editName.trim(),
      sizesPreview: editSizesPreview.trim() || 'All Sizes Available',
      imageUrl: editImageUrl.trim()
    });
    setEditingCategory(null);
  };

  const handleDelete = (cat) => {
    Alert.alert(
      'Category Neekka Venduma?',
      `"${cat.name}" category matrum adhan porutkal neekkappadum!`,
      [
        { text: 'Vendaam (Cancel)', style: 'cancel' },
        { text: 'Neekku (Delete)', style: 'destructive', onPress: () => deleteCategory(cat.id) }
      ]
    );
  };

  const renderCategoryItem = ({ item, index }) => {
    const count = products.filter(
      (p) => p.category === item.id || p.categoryId === item.id
    ).length;
    const displayImg = item.imageUrl || getCategoryDefaultImage(item.id);

    return (
      <View style={[styles.cardWrapper, numColumns === 2 && styles.cardWrapperTwoCol]}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Products', { categoryId: item.id })}
        >
          {/* Real Category Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: displayImg }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            {/* Category Number Tag */}
            <View style={styles.numberBadge}>
              <Text style={styles.numberText}>#{index + 1}</Text>
            </View>
            {/* Item Count Badge */}
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{count} Items</Text>
            </View>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryName}>{item.name}</Text>
                {item.tamilName ? (
                  <Text style={styles.tamilName}>({item.tamilName})</Text>
                ) : null}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionIconRow}>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleOpenEdit(item)}
                >
                  <Ionicons name="pencil" size={16} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => handleDelete(item)}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sizes Preview */}
            <View style={styles.sizesPill}>
              <Ionicons name="pricetag-outline" size={14} color="#d97706" />
              <Text style={styles.sizesText} numberOfLines={1}>
                {item.sizesPreview || 'All sizes / inches'}
              </Text>
            </View>

            {/* View Products Button */}
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => navigation.navigate('Products', { categoryId: item.id })}
            >
              <Text style={styles.viewBtnText}>Porutkal Paaru (View Products)</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ResponsiveContainer>
      <Header navigation={navigation} />

      {/* Top Banner & Add Category Button */}
      <View style={styles.bannerRow}>
        <View>
          <Text style={styles.pageTitle}>Categories (பிரிவுகள்)</Text>
          <Text style={styles.pageSubtitle}>
            Porutkal paarkka category-ai click seiyavum
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addCategoryBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#ffffff" />
          <Text style={styles.addCategoryText}>+ Pudhu Category</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList of Categories */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        numColumns={numColumns}
        key={numColumns} // Re-render when layout changes
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ADD CATEGORY MODAL */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pudhu Category Serka</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Category Name (e.g. Bulb, Screw, Motor) *"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Tamil Name (e.g. பல்பு, ஸ்க்ரூ)"
              value={newTamilName}
              onChangeText={setNewTamilName}
            />
            <TextInput
              style={styles.input}
              placeholder="Sizes Preview (e.g. 1 inch, 2 inch, 9W)"
              value={newSizesPreview}
              onChangeText={setNewSizesPreview}
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL (Unsplash / Web photo link)"
              value={newImageUrl}
              onChangeText={setNewImageUrl}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsAddModalOpen(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddSubmit}>
                <Text style={styles.saveText}>Save Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT CATEGORY MODAL */}
      <Modal visible={Boolean(editingCategory)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Category Matra (Edit)</Text>
              <TouchableOpacity onPress={() => setEditingCategory(null)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Category Name *"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.input}
              placeholder="Tamil Name"
              value={editTamilName}
              onChangeText={setEditTamilName}
            />
            <TextInput
              style={styles.input}
              placeholder="Sizes Preview"
              value={editSizesPreview}
              onChangeText={setEditSizesPreview}
            />
            <TextInput
              style={styles.input}
              placeholder="Image URL"
              value={editImageUrl}
              onChangeText={setEditImageUrl}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditingCategory(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleEditSubmit}>
                <Text style={styles.saveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.lg,
    paddingBottom: SIZES.sm,
  },
  pageTitle: {
    fontSize: SIZES.fontXl,
    fontWeight: '900',
    color: COLORS.text,
  },
  pageSubtitle: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.small,
  },
  addCategoryText: {
    color: '#ffffff',
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  listContent: {
    padding: SIZES.md,
    paddingBottom: 110,
  },
  cardWrapper: {
    flex: 1,
    padding: SIZES.xs,
  },
  cardWrapperTwoCol: {
    maxWidth: '50%',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  imageContainer: {
    position: 'relative',
    height: 155,
    backgroundColor: '#f1f5f9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  numberBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
  },
  numberText: {
    color: '#fbbf24',
    fontSize: SIZES.fontXs,
    fontWeight: '900',
  },
  countBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
  },
  countText: {
    color: COLORS.primaryDark,
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  cardBody: {
    padding: SIZES.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: SIZES.fontLg,
    fontWeight: '900',
    color: COLORS.text,
  },
  tamilName: {
    fontSize: SIZES.fontSm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  actionIconRow: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    padding: 6,
    borderRadius: SIZES.radiusSm,
    backgroundColor: '#f1f5f9',
  },
  sizesPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSm,
    marginVertical: 8,
  },
  sizesText: {
    fontSize: SIZES.fontXs,
    fontWeight: '800',
    color: '#92400e',
    flex: 1,
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: SIZES.radiusMd,
    marginTop: 4,
  },
  viewBtnText: {
    color: '#ffffff',
    fontSize: SIZES.fontSm,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.lg,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.xl,
    width: '100%',
    maxWidth: 450,
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  modalTitle: {
    fontSize: SIZES.fontLg,
    fontWeight: '900',
    color: COLORS.text,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: SIZES.fontSm,
    marginBottom: 12,
    color: COLORS.text,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: SIZES.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.radiusMd,
    backgroundColor: '#f1f5f9',
  },
  cancelText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSm,
    fontWeight: '800',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.radiusMd,
    backgroundColor: COLORS.primary,
  },
  saveText: {
    color: '#ffffff',
    fontSize: SIZES.fontSm,
    fontWeight: '800',
  },
});
