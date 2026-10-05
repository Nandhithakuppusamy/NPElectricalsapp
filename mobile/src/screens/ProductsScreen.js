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
import { getProductDefaultImage } from '../data/initialData';
import ResponsiveContainer from '../components/ResponsiveContainer';
import Header from '../components/Header';
import { COLORS, SIZES, SHADOWS } from '../styles/theme';

export default function ProductsScreen({ route, navigation }) {
  const { categoryId } = route.params || { categoryId: 'bulb' };
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

  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 2 : 1;

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Add Product Form
  const [newName, setNewName] = useState('');
  const [newSize, setNewSize] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('20');
  const [newLowAlert, setNewLowAlert] = useState('5');
  const [newUnit, setNewUnit] = useState('piece');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Edit Product Form
  const [editName, setEditName] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editLowAlert, setEditLowAlert] = useState('5');
  const [editUnit, setEditUnit] = useState('piece');
  const [editImageUrl, setEditImageUrl] = useState('');

  const currentCategory = categories.find((c) => c.id === categoryId) || {
    id: categoryId,
    name: categoryId,
    tamilName: ''
  };

  const categoryProducts = products.filter((p) => {
    const isCat = p.category === categoryId || p.categoryId === categoryId;
    const q = search.toLowerCase().trim();
    const isSearchMatch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.size && p.size.toLowerCase().includes(q));
    return isCat && isSearchMatch;
  });

  const lowStockItems = categoryProducts.filter(
    (p) => (p.stock ?? p.stockCount ?? 0) <= (p.lowStockAlert || 5)
  );

  const getCartQty = (productId) => {
    const item = cart.find((i) => i.product.id === productId);
    return item ? item.qty : 0;
  };

  const handleAddSubmit = async () => {
    if (!newName.trim() || !newSize.trim()) {
      Alert.alert('Details Thevai', 'Product Peyar matrum Size / Inches kandippa podanum!');
      return;
    }
    await addNewProduct({
      name: newName.trim(),
      category: categoryId,
      categoryId,
      size: newSize.trim(),
      price: parseFloat(newPrice) || 0,
      stock: parseInt(newStock) || 0,
      stockCount: parseInt(newStock) || 0,
      lowStockAlert: parseInt(newLowAlert) || 5,
      unit: newUnit,
      imageUrl: newImageUrl.trim()
    });

    setNewName('');
    setNewSize('');
    setNewPrice('');
    setNewStock('20');
    setNewLowAlert('5');
    setNewImageUrl('');
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
      category: categoryId,
      categoryId,
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
      'Product Neekka Venduma?',
      `"${product.name}" (${product.size}) product neekkappadum!`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Neekku (Delete)', style: 'destructive', onPress: () => deleteProduct(product.id) }
      ]
    );
  };

  const renderProductItem = ({ item }) => {
    const inCartQty = getCartQty(item.id);
    const currentStock = item.stock ?? item.stockCount ?? 0;
    const isLow = currentStock <= (item.lowStockAlert || 5);
    const isOutOfStock = currentStock <= 0;
    const displayImg = item.imageUrl || getProductDefaultImage(item, categoryId);

    return (
      <View style={[styles.cardWrapper, numColumns === 2 && styles.cardWrapperTwoCol]}>
        <View style={[styles.card, inCartQty > 0 && styles.cardInCart, isLow && styles.cardLowStock]}>
          {/* Product Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: displayImg }}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Stock Badge Overlay */}
            <View style={styles.stockBadge}>
              {isOutOfStock ? (
                <View style={[styles.pill, styles.pillDanger]}>
                  <Text style={styles.pillDangerText}>Stock Illai (0)</Text>
                </View>
              ) : isLow ? (
                <View style={[styles.pill, styles.pillWarning]}>
                  <Ionicons name="warning-outline" size={12} color="#b45309" />
                  <Text style={styles.pillWarningText}>Low Stock ({currentStock})</Text>
                </View>
              ) : (
                <View style={[styles.pill, styles.pillSuccess]}>
                  <Ionicons name="checkmark-outline" size={12} color="#047857" />
                  <Text style={styles.pillSuccessText}>Stock: {currentStock}</Text>
                </View>
              )}
            </View>

            {/* Unit Badge */}
            <View style={styles.unitBadge}>
              <Text style={styles.unitText}>{(item.unit || 'piece').toUpperCase()}</Text>
            </View>
          </View>

          {/* Product Info */}
          <View style={styles.cardBody}>
            <View style={styles.titleRow}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.actionIconRow}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleOpenEdit(item)}>
                  <Ionicons name="pencil" size={15} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => handleDelete(item)}>
                  <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Size / Inches Badge */}
            <View style={styles.sizeTag}>
              <Ionicons name="resize-outline" size={14} color="#92400e" />
              <Text style={styles.sizeText}>
                Size / அளவு: <Text style={{ fontWeight: '900' }}>{item.size}</Text>
              </Text>
            </View>

            {/* Price & Add to Bill Row */}
            <View style={styles.priceRow}>
              <View>
                <Text style={styles.priceLabel}>Vilai (Rate)</Text>
                <Text style={styles.priceValue}>₹{(item.price || 0).toLocaleString('en-IN')}</Text>
              </View>

              {/* Cart Counter or Add to Bill Button */}
              {inCartQty > 0 ? (
                <View style={styles.counterBox}>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => updateCartQty(item.id, inCartQty - 1)}
                  >
                    <Ionicons name="remove" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.counterNumber}>{inCartQty}</Text>
                  <TouchableOpacity
                    style={[styles.counterBtn, styles.counterBtnAdd]}
                    disabled={currentStock <= inCartQty}
                    onPress={() => addToCart(item, 1)}
                  >
                    <Ionicons name="add" size={16} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.addToBillBtn, isOutOfStock && styles.btnDisabled]}
                  disabled={isOutOfStock}
                  onPress={() => addToCart(item, 1)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={16} color="#ffffff" />
                  <Text style={styles.addToBillText}>+ Bill-la Ser</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ResponsiveContainer>
      <Header navigation={navigation} />

      {/* Navigation Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color={COLORS.text} />
          <Text style={styles.backText}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setNewName(`${currentCategory.name} `);
            setIsAddModalOpen(true);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#ffffff" />
          <Text style={styles.addText}>+ Pudhu Product</Text>
        </TouchableOpacity>
      </View>

      {/* Category Banner */}
      <View style={styles.categoryBanner}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>
            {currentCategory.name}{' '}
            {currentCategory.tamilName ? `(${currentCategory.tamilName})` : ''}
          </Text>
          <Text style={styles.bannerSub}>
            Ellam sizes / inches porutkalum keezhe ulladhu
          </Text>
        </View>
        <View style={styles.bannerPill}>
          <Text style={styles.bannerPillText}>{categoryProducts.length} Items</Text>
        </View>
      </View>

      {/* Low Stock Warning Alert Banner */}
      {lowStockItems.length > 0 && (
        <View style={styles.alertBanner}>
          <Ionicons name="warning" size={20} color="#b45309" />
          <Text style={styles.alertText}>
            Low Stock Warning Alert! Indha category-il{' '}
            <Text style={{ fontWeight: '900' }}>{lowStockItems.length} items</Text> stock kuraindhadhu!
          </Text>
        </View>
      )}

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${currentCategory.name}... (e.g. 1 inch, 2 inch, 9W)`}
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Products FlatList */}
      <FlatList
        data={categoryProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="cube-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Indha category-il porutkal illai</Text>
            <Text style={styles.emptySub}>"+ Pudhu Product" button click seiyavum</Text>
          </View>
        }
      />

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <View style={styles.floatingBar}>
          <View style={styles.floatingInfo}>
            <View style={styles.cartIconBadge}>
              <Ionicons name="cart" size={20} color="#0f172a" />
              <View style={styles.badgeCount}>
                <Text style={styles.badgeCountText}>{cartTotalItems}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.floatingSub}>{cart.length} Items • Total Bill:</Text>
              <Text style={styles.floatingTotal}>₹{cartSubtotal.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.billNowBtn}
            onPress={() => navigation.navigate('Billing')}
            activeOpacity={0.85}
          >
            <Text style={styles.billNowText}>Bill Podu</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      {/* ADD PRODUCT MODAL */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pudhu Product Serka ({currentCategory.name})</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Product Name (e.g. Screw 1 inch) *"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Size / Inches / அளவு (e.g. 1 inch, 2 inch, 9W) *"
              value={newSize}
              onChangeText={setNewSize}
            />

            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Vilai / Price (₹) *"
                keyboardType="numeric"
                value={newPrice}
                onChangeText={setNewPrice}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Unit (piece / box / pkt)"
                value={newUnit}
                onChangeText={setNewUnit}
              />
            </View>

            <View style={styles.rowInputs}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Initial Stock *"
                keyboardType="numeric"
                value={newStock}
                onChangeText={setNewStock}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Low Stock Alert"
                keyboardType="numeric"
                value={newLowAlert}
                onChangeText={setNewLowAlert}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Image URL (Unsplash / web image link)"
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
                <Text style={styles.saveText}>Product Save Pannu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT PRODUCT MODAL */}
      <Modal visible={Boolean(editingProduct)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Product Vivaram Matra (Edit)</Text>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: SIZES.radiusMd,
  },
  backText: {
    fontSize: SIZES.fontXs,
    fontWeight: '800',
    color: COLORS.text,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.small,
  },
  addText: {
    color: '#ffffff',
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  categoryBanner: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SIZES.lg,
    marginTop: 6,
    padding: SIZES.lg,
    borderRadius: SIZES.radiusLg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.small,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: SIZES.fontXl,
    fontWeight: '900',
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: SIZES.fontXs,
    marginTop: 3,
  },
  bannerPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  bannerPillText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: SIZES.fontXs,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde047',
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.sm,
    padding: SIZES.md,
    borderRadius: SIZES.radiusMd,
  },
  alertText: {
    color: '#92400e',
    fontSize: SIZES.fontXs,
    fontWeight: '700',
    flex: 1,
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
  listContent: {
    padding: SIZES.md,
    paddingBottom: 130,
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
  cardInCart: {
    borderColor: COLORS.primaryLight,
    borderWidth: 2,
  },
  cardLowStock: {
    borderColor: '#fda4af',
  },
  imageContainer: {
    height: 155,
    backgroundColor: '#f1f5f9',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  stockBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  unitBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
  },
  unitText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
    ...SHADOWS.small,
  },
  pillSuccess: {
    backgroundColor: 'rgba(209, 250, 229, 0.95)',
  },
  pillSuccessText: {
    color: '#047857',
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  pillWarning: {
    backgroundColor: 'rgba(254, 243, 199, 0.95)',
  },
  pillWarningText: {
    color: '#b45309',
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  pillDanger: {
    backgroundColor: 'rgba(254, 226, 226, 0.95)',
  },
  pillDangerText: {
    color: '#b91c1c',
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
    gap: 6,
  },
  productName: {
    flex: 1,
    fontSize: SIZES.fontMd,
    fontWeight: '900',
    color: COLORS.text,
  },
  actionIconRow: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 5,
    backgroundColor: '#f1f5f9',
    borderRadius: SIZES.radiusSm,
  },
  sizeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fde68a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: SIZES.radiusSm,
    alignSelf: 'flex-start',
    marginVertical: 6,
  },
  sizeText: {
    fontSize: SIZES.fontXs,
    color: '#92400e',
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  priceLabel: {
    fontSize: SIZES.fontXs,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: SIZES.fontLg,
    fontWeight: '900',
    color: COLORS.text,
  },
  addToBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: SIZES.radiusMd,
  },
  btnDisabled: {
    backgroundColor: COLORS.border,
  },
  addToBillText: {
    color: '#ffffff',
    fontSize: SIZES.fontXs,
    fontWeight: '800',
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: SIZES.radiusMd,
    padding: 2,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: SIZES.radiusSm,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnAdd: {
    backgroundColor: COLORS.primary,
  },
  counterNumber: {
    width: 26,
    textAlign: 'center',
    fontWeight: '900',
    color: COLORS.primary,
    fontSize: SIZES.fontSm,
  },
  emptyBox: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: SIZES.fontMd,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 10,
  },
  emptySub: {
    fontSize: SIZES.fontSm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  floatingBar: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: COLORS.primaryDark,
    borderRadius: SIZES.radiusLg,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    ...SHADOWS.large,
  },
  floatingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fbbf24',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badgeCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCountText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  floatingSub: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  floatingTotal: {
    color: '#fbbf24',
    fontSize: SIZES.fontLg,
    fontWeight: '900',
  },
  billNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: SIZES.radiusMd,
  },
  billNowText: {
    color: '#ffffff',
    fontSize: SIZES.fontSm,
    fontWeight: '900',
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
