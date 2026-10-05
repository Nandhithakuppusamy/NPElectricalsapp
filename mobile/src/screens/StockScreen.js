import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
  useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useShop } from '../context/ShopContext';
import { getProductDefaultImage } from '../data/initialData';
import ResponsiveContainer from '../components/ResponsiveContainer';
import Header from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

export default function StockScreen({ navigation }) {
  const {
    categories,
    products,
    lowStockProducts,
    updateProductStock,
    quickAddStock,
    addNewProduct,
    updateProduct,
    deleteProduct
  } = useShop();

  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 2 : 1;

  const [search, setSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Dialog / Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Add Product Form
  const [addCat, setAddCat] = useState('bulb');
  const [addName, setAddName] = useState('');
  const [addSize, setAddSize] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addStock, setAddStock] = useState('20');
  const [addLowAlert, setAddLowAlert] = useState('5');
  const [addUnit, setAddUnit] = useState('piece');
  const [addImageUrl, setAddImageUrl] = useState('');

  // Edit Product Form
  const [editName, setEditName] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editLowAlert, setEditLowAlert] = useState('5');
  const [editUnit, setEditUnit] = useState('piece');
  const [editImageUrl, setEditImageUrl] = useState('');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const isCatMatch =
      !selectedCatFilter ||
      p.category === selectedCatFilter ||
      p.categoryId === selectedCatFilter;
    const q = search.toLowerCase().trim();
    const isSearchMatch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.size && p.size.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));
    const currentStock = p.stock ?? p.stockCount ?? 0;
    const isLowMatch = !showLowStockOnly || currentStock <= (p.lowStockAlert || 5);
    return isCatMatch && isSearchMatch && isLowMatch;
  });

  const handleAddSubmit = async () => {
    if (!addName.trim() || !addSize.trim()) {
      Alert.alert('Details Thevai', 'Product Name matrum Size kandippa podanum!');
      return;
    }
    await addNewProduct({
      category: addCat,
      categoryId: addCat,
      name: addName.trim(),
      size: addSize.trim(),
      price: parseFloat(addPrice) || 0,
      stock: parseInt(addStock) || 0,
      stockCount: parseInt(addStock) || 0,
      lowStockAlert: parseInt(addLowAlert) || 5,
      unit: addUnit,
      imageUrl: addImageUrl.trim()
    });

    setAddName('');
    setAddSize('');
    setAddPrice('');
    setAddStock('20');
    setAddLowAlert('5');
    setAddImageUrl('');
    setIsAddModalOpen(false);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditSize(product.size || '');
    setEditPrice((product.price || 0).toString());
    setEditStock((product.stock ?? product.stockCount ?? 0).toString());
    setEditLowAlert((product.lowStockAlert || 5).toString());
    setEditUnit(product.unit || 'piece');
    setEditImageUrl(product.imageUrl || '');
  };

  const handleEditSubmit = async () => {
    if (!editingProduct || !editName.trim()) return;
    await updateProduct(editingProduct.id, {
      name: editName.trim(),
      category: editingProduct.category || editingProduct.categoryId,
      categoryId: editingProduct.category || editingProduct.categoryId,
      size: editSize.trim(),
      price: parseFloat(editPrice) || 0,
      stock: parseInt(editStock) || 0,
      stockCount: parseInt(editStock) || 0,
      lowStockAlert: parseInt(editLowAlert) || 5,
      unit: editUnit,
      imageUrl: editImageUrl.trim()
    });
    setEditingProduct(null);
  };

  const handleDelete = (product) => {
    Alert.alert(
      'Sarakku Neekka Venduma?',
      `"${product.name}"-ai inventory-il irundhu neekkalaama?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Neekku (Delete)', style: 'destructive', onPress: () => deleteProduct(product.id) }
      ]
    );
  };

  const renderStockItem = ({ item }) => {
    const currentStock = item.stock ?? item.stockCount ?? 0;
    const isLow = currentStock <= (item.lowStockAlert || 5);
    const isZero = currentStock <= 0;
    const displayImg = item.imageUrl || getProductDefaultImage(item, item.category);

    return (
      <View style={[styles.cardWrapper, numColumns === 2 && styles.cardWrapperTwoCol]}>
        <View style={[styles.card, isLow && styles.cardLowStock]}>
          <View style={styles.cardTopRow}>
            {/* Thumbnail */}
            <Image
              source={{ uri: displayImg }}
              style={styles.thumbnail}
              resizeMode="cover"
            />

            {/* Info */}
            <View style={{ flex: 1 }}>
              <Text style={styles.prodName}>{item.name}</Text>
              <Text style={styles.prodCategory}>
                {(item.category || item.categoryId || '').replace('_', ' ').toUpperCase()}
              </Text>
              <View style={styles.sizePill}>
                <Text style={styles.sizeText}>{item.size}</Text>
              </View>
            </View>

            {/* Rate */}
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.rateLabel}>Vilai (Rate)</Text>
              <Text style={styles.rateValue}>₹{(item.price || 0).toLocaleString('en-IN')}</Text>

              {/* Status Badge */}
              <View style={{ marginTop: 6 }}>
                {isZero ? (
                  <View style={[styles.statusPill, styles.pillDanger]}>
                    <Text style={styles.pillDangerText}>Stock Illai (0)</Text>
                  </View>
                ) : isLow ? (
                  <View style={[styles.statusPill, styles.pillWarning]}>
                    <Text style={styles.pillWarningText}>Low Stock ({currentStock})</Text>
                  </View>
                ) : (
                  <View style={[styles.statusPill, styles.pillSuccess]}>
                    <Text style={styles.pillSuccessText}>Stock: {currentStock}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Quick Restock & Edit/Delete Row */}
          <View style={styles.cardBottomRow}>
            <View style={styles.quickRestockGroup}>
              <Text style={styles.restockLabel}>Restock:</Text>
              <TouchableOpacity
                style={styles.restockBtn}
                onPress={() => quickAddStock(item.id, 5)}
              >
                <Text style={styles.restockBtnText}>+5</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.restockBtn}
                onPress={() => quickAddStock(item.id, 10)}
              >
                <Text style={styles.restockBtnText}>+10</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.restockBtn, styles.restockBtnHeavy]}
                onPress={() => quickAddStock(item.id, 25)}
              >
                <Text style={styles.restockBtnHeavyText}>+25</Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.actionsGroup}>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleOpenEdit(item)}>
                <Ionicons name="pencil" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item)}>
                <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ResponsiveContainer>
      <Header navigation={navigation} />

      {/* Top Banner */}
      <View style={styles.bannerRow}>
        <View>
          <Text style={styles.pageTitle}>Sarakku & Stock Nilavaram</Text>
          <Text style={styles.pageSubtitle}>
            Stock iruppu kanakku, low stock warnings, matrum restock
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#ffffff" />
          <Text style={styles.addText}>+ Pudhu Sarakku</Text>
        </TouchableOpacity>
      </View>

      {/* Low Stock Warning Banner */}
      {lowStockProducts.length > 0 && (
        <View style={styles.alertBanner}>
          <Ionicons name="warning" size={20} color="#b45309" />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>Low Stock Warning Alert!</Text>
            <Text style={styles.alertSub}>
              {lowStockProducts.length} porutkal stock limit-ai vida kuraindhadhu. Sarakku stock seiyavum!
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.filterAlertBtn,
              showLowStockOnly && styles.filterAlertBtnActive
            ]}
            onPress={() => setShowLowStockOnly(!showLowStockOnly)}
          >
            <Text
              style={[
                styles.filterAlertText,
                showLowStockOnly && styles.filterAlertTextActive
              ]}
            >
              {showLowStockOnly ? 'Ellam Kaattu' : 'Low Stock Mattum'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Product name, size, category thedu (Search)..."
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Pills Horizontal Scroll */}
      <View style={styles.pillsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              selectedCatFilter === null && styles.filterPillActive
            ]}
            onPress={() => setSelectedCatFilter(null)}
          >
            <Text
              style={[
                styles.filterPillText,
                selectedCatFilter === null && styles.filterPillTextActive
              ]}
            >
              All ({products.length})
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterPill,
                selectedCatFilter === cat.id && styles.filterPillActive
              ]}
              onPress={() => setSelectedCatFilter(cat.id)}
            >
              <Text
                style={[
                  styles.filterPillText,
                  selectedCatFilter === cat.id && styles.filterPillTextActive
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products FlatList */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderStockItem}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* ADD SARAKKU MODAL */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pudhu Sarakku / Item Serka</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Category selection */}
            <Text style={styles.inputSubLabel}>Category Select Pannunga:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.catPickPill, addCat === c.id && styles.catPickPillActive]}
                  onPress={() => setAddCat(c.id)}
                >
                  <Text style={[styles.catPickText, addCat === c.id && styles.catPickTextActive]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={styles.input}
              placeholder="Product Name *"
              value={addName}
              onChangeText={setAddName}
            />
            <TextInput
              style={styles.input}
              placeholder="Size / Inches / அளவு *"
              value={addSize}
              onChangeText={setAddSize}
            />

            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Vilai / Price (₹) *"
                keyboardType="numeric"
                value={addPrice}
                onChangeText={setAddPrice}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Unit (piece / box / pkt)"
                value={addUnit}
                onChangeText={setAddUnit}
              />
            </View>

            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Stock Count *"
                keyboardType="numeric"
                value={addStock}
                onChangeText={setAddStock}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Low Stock Warning Limit"
                keyboardType="numeric"
                value={addLowAlert}
                onChangeText={setAddLowAlert}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Image URL (Unsplash / web image)"
              value={addImageUrl}
              onChangeText={setAddImageUrl}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsAddModalOpen(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddSubmit}>
                <Text style={styles.saveText}>Sarakku Serka</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT SARAKKU MODAL */}
      <Modal visible={Boolean(editingProduct)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sarakku Matra (Edit Product)</Text>
              <TouchableOpacity onPress={() => setEditingProduct(null)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Product Name *"
              value={editName}
              onChangeText={setEditName}
            />
            <TextInput
              style={styles.input}
              placeholder="Size / Inches *"
              value={editSize}
              onChangeText={setEditSize}
            />

            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Price (₹) *"
                keyboardType="numeric"
                value={editPrice}
                onChangeText={setEditPrice}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Stock Count"
                keyboardType="numeric"
                value={editStock}
                onChangeText={setEditStock}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Low Stock Alert Limit"
              keyboardType="numeric"
              value={editLowAlert}
              onChangeText={setEditLowAlert}
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
                onPress={() => setEditingProduct(null)}
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
    paddingTop: SIZES.md,
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.small,
  },
  addText: {
    color: '#ffffff',
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    marginHorizontal: SIZES.lg,
    marginTop: 6,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
  },
  alertTitle: {
    color: '#92400e',
    fontSize: SIZES.fontSm,
    fontWeight: '900',
  },
  alertSub: {
    color: '#b45309',
    fontSize: SIZES.fontXs,
    marginTop: 2,
  },
  filterAlertBtn: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: SIZES.radiusSm,
  },
  filterAlertBtnActive: {
    backgroundColor: '#f59e0b',
  },
  filterAlertText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400e',
  },
  filterAlertTextActive: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: SIZES.radiusMd,
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.fontSm,
    color: COLORS.text,
  },
  pillsContainer: {
    paddingHorizontal: SIZES.lg,
    marginTop: 8,
  },
  filterPill: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: SIZES.radiusFull,
    marginRight: 6,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterPillText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    color: COLORS.text,
  },
  filterPillTextActive: {
    color: '#ffffff',
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
    padding: SIZES.md,
    ...SHADOWS.small,
  },
  cardLowStock: {
    borderColor: '#fda4af',
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: SIZES.radiusSm,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  prodName: {
    fontSize: SIZES.fontSm,
    fontWeight: '800',
    color: COLORS.text,
  },
  prodCategory: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    marginTop: 2,
  },
  sizePill: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  sizeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400e',
  },
  rateLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  rateValue: {
    fontSize: SIZES.fontMd,
    fontWeight: '900',
    color: COLORS.text,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pillSuccess: {
    backgroundColor: COLORS.successLight,
  },
  pillSuccessText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
  pillWarning: {
    backgroundColor: COLORS.warningLight,
  },
  pillWarningText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
  pillDanger: {
    backgroundColor: COLORS.dangerLight,
  },
  pillDangerText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.danger,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 10,
    paddingTop: 8,
  },
  quickRestockGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  restockLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  restockBtn: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
  },
  restockBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  restockBtnHeavy: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  restockBtnHeavyText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  actionsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    padding: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: SIZES.radiusSm,
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
  inputSubLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  catPickPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: SIZES.radiusFull,
    marginRight: 6,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  catPickPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catPickText: {
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    color: COLORS.text,
  },
  catPickTextActive: {
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: SIZES.fontSm,
    marginBottom: 10,
    color: COLORS.text,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
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
