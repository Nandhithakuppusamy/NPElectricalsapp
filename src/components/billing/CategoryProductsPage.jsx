import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { getProductDefaultImage } from '../../data/initialData';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  AlertTitle,
  Chip,
  Paper,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory2 as InventoryIcon,
  WarningAmber as WarningIcon,
  Sell as TagIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';

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

  // Dialog States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Add Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdSize, setNewProdSize] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdAlert, setNewProdAlert] = useState('5');
  const [newProdUnit, setNewProdUnit] = useState('piece');
  const [newProdImageUrl, setNewProdImageUrl] = useState('');
  const [newProdImageFile, setNewProdImageFile] = useState(null);
  const [newProdImagePreview, setNewProdImagePreview] = useState('');

  // Edit Product Form State
  const [editProdName, setEditProdName] = useState('');
  const [editProdSize, setEditProdSize] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdStock, setEditProdStock] = useState('');
  const [editProdAlert, setEditProdAlert] = useState('5');
  const [editProdUnit, setEditProdUnit] = useState('piece');
  const [editProdImageUrl, setEditProdImageUrl] = useState('');
  const [editProdImageFile, setEditProdImageFile] = useState(null);
  const [editProdImagePreview, setEditProdImagePreview] = useState('');

  // Selected Category Info
  const category = categories.find(c => c.id === categoryId) || {
    id: categoryId,
    name: categoryId,
    tamilName: '',
    sizesPreview: ''
  };

  // Products under this category
  const categoryProducts = products.filter(p => {
    const isCat = p.category === categoryId || p.categoryId === categoryId;
    const q = localSearch.toLowerCase().trim();
    const isSearchMatch = !q || 
      p.name.toLowerCase().includes(q) || 
      (p.size && p.size.toLowerCase().includes(q));
    return isCat && isSearchMatch;
  });

  // Low stock products specifically in this category
  const categoryLowStock = categoryProducts.filter(p => (p.stock ?? p.stockCount ?? 0) <= (p.lowStockAlert || 5));

  const getCartQty = (productId) => {
    const item = cart.find(i => i.product.id === productId);
    return item ? item.qty : 0;
  };

  // Handle Add Image File Selection
  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProdImageFile(file);
      setNewProdImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Edit Image File Selection
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProdImageFile(file);
      setEditProdImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Add Product
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdSize.trim()) {
      alert('Product Name matrum Size / Inches kandippa thevai!');
      return;
    }

    await addNewProduct({
      name: newProdName.trim(),
      category: categoryId,
      categoryId: categoryId,
      size: newProdSize.trim(),
      price: parseFloat(newProdPrice) || 0,
      stock: parseInt(newProdStock) || 0,
      stockCount: parseInt(newProdStock) || 0,
      lowStockAlert: parseInt(newProdAlert) || 5,
      unit: newProdUnit,
      imageUrl: newProdImageUrl.trim(),
      imageFile: newProdImageFile
    });

    setNewProdName('');
    setNewProdSize('');
    setNewProdPrice('');
    setNewProdStock('20');
    setNewProdAlert('5');
    setNewProdImageUrl('');
    setNewProdImageFile(null);
    setNewProdImagePreview('');
    setIsAddDialogOpen(false);
  };

  // Open Edit Product
  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);
    setEditProdName(product.name);
    setEditProdSize(product.size || '');
    setEditProdPrice(product.price.toString());
    setEditProdStock((product.stock ?? product.stockCount ?? 0).toString());
    setEditProdAlert((product.lowStockAlert || 5).toString());
    setEditProdUnit(product.unit || 'piece');
    setEditProdImageUrl(product.imageUrl || '');
    setEditProdImageFile(null);
    setEditProdImagePreview(product.imageUrl || getProductDefaultImage(product, categoryId));
  };

  // Submit Edit Product
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct || !editProdName.trim()) return;

    await updateProduct(editingProduct.id, {
      name: editProdName.trim(),
      category: categoryId,
      categoryId: categoryId,
      size: editProdSize.trim(),
      price: parseFloat(editProdPrice) || 0,
      stock: parseInt(editProdStock) || 0,
      stockCount: parseInt(editProdStock) || 0,
      lowStockAlert: parseInt(editProdAlert) || 5,
      unit: editProdUnit,
      imageUrl: editProdImageUrl.trim(),
      imageFile: editProdImageFile
    });

    setEditingProduct(null);
    setEditProdImageFile(null);
    setEditProdImagePreview('');
  };

  // Delete Product
  const handleDeleteProduct = (product) => {
    if (window.confirm(`"${product.name}" (${product.size}) product-ai neekka venduma?`)) {
      deleteProduct(product.id);
    }
  };

  return (
    <Box sx={{ py: { xs: 2.5, sm: 4 }, pb: { xs: 16, sm: 12 }, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        
        {/* Navigation & Controls Top Bar */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBackToCategories}
            sx={{
              borderRadius: 3,
              borderColor: '#cbd5e1',
              color: '#1e293b',
              bgcolor: '#ffffff',
              fontWeight: 800,
              fontSize: '0.85rem',
              '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' }
            }}
          >
            ⬅️ Categories List-ku Po (Back)
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setNewProdName(`${category.name} `);
              setNewProdImageFile(null);
              setNewProdImageUrl('');
              setNewProdImagePreview('');
              setIsAddDialogOpen(true);
            }}
            sx={{
              borderRadius: 3,
              fontWeight: 800,
              fontSize: '0.85rem',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
            }}
          >
            + Pudhu Product Serka ({category.name})
          </Button>
        </Box>

        {/* Category Header Banner */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            mb: 3,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
            color: '#ffffff',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h2" sx={{ color: '#ffffff', m: 0 }}>
                {category.name}
              </Typography>
              {category.tamilName && (
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                  ({category.tamilName})
                </Typography>
              )}
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mt: 0.5 }}>
              Ellam {category.name} porutkalum sizes / inches-udan keezhe ulladhu
            </Typography>
          </Box>

          <Chip
            label={`${categoryProducts.length} Items Available`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.8rem',
              backdropFilter: 'blur(4px)'
            }}
          />
        </Paper>

        {/* ⚠️ Low Stock Alert Banner using Material UI Alert component */}
        {categoryLowStock.length > 0 && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3, borderRadius: 3, border: '1px solid #fde047' }}
            action={
              <Chip 
                label={`${categoryLowStock.length} Low Stock`} 
                color="warning" 
                size="small" 
                sx={{ fontWeight: 800 }} 
              />
            }
          >
            <AlertTitle sx={{ fontWeight: 800 }}>Low Stock Warning Alert!</AlertTitle>
            Indha category-il <strong>{categoryLowStock.length} porutkal</strong> stock limit kuraindhadhu. Sarakku stock seiyavum!
          </Alert>
        )}

        {/* Search within Category */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={`Search in ${category.name}... (e.g. 1 inch, 2 inch, 1/2", 9W)`}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              sx: { bgcolor: '#ffffff', borderRadius: 3 }
            }}
          />
        </Box>

        {/* Products Grid - Breakpoints: xs=12, sm=6, md=4 */}
        {categoryProducts.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 4,
              borderColor: '#cbd5e1',
              bgcolor: '#ffffff'
            }}
          >
            <InventoryIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#334155' }}>
              Indha category-il porutkal yedhum illai
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Mela ulla "+ Pudhu Product Serka" button click panni product serunga.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {categoryProducts.map((product) => {
              const inCartQty = getCartQty(product.id);
              const currentStock = product.stock ?? product.stockCount ?? 0;
              const isLowStock = currentStock <= (product.lowStockAlert || 5);
              const isOutOfStock = currentStock <= 0;
              const displayImg = product.imageUrl || getProductDefaultImage(product, categoryId);

              return (
                <Grid 
                  key={product.id}
                  size={{ xs: 12, sm: 6, md: 4 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 4,
                      border: inCartQty > 0 
                        ? '2px solid #2563eb' 
                        : isLowStock 
                        ? '1.5px solid #fda4af' 
                        : '1.5px solid #e2e8f0',
                      boxShadow: inCartQty > 0 
                        ? '0 8px 24px rgba(37, 99, 235, 0.18)' 
                        : '0 2px 8px rgba(15, 23, 42, 0.05)',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      bgcolor: '#ffffff',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    {/* Real Product Image Displayed at the Top using Material UI CardMedia */}
                    <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#f1f5f9' }}>
                      <CardMedia
                        component="img"
                        image={displayImg}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = getProductDefaultImage(product, categoryId);
                        }}
                        sx={{
                          height: { xs: 160, sm: 175 },
                          width: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.35s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />

                      {/* Stock Status Badge on Top-Left of Image */}
                      <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                        {isOutOfStock ? (
                          <Chip 
                            label="Stock Illai (0)" 
                            color="error" 
                            size="small" 
                            sx={{ fontWeight: 800, height: 24, fontSize: '0.68rem', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} 
                          />
                        ) : isLowStock ? (
                          <Chip 
                            icon={<WarningIcon sx={{ fontSize: '13px !important' }} />}
                            label={`Low Stock (${currentStock})`} 
                            color="warning" 
                            size="small" 
                            sx={{ fontWeight: 800, height: 24, fontSize: '0.68rem', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} 
                          />
                        ) : (
                          <Chip 
                            icon={<CheckIcon sx={{ fontSize: '13px !important' }} />}
                            label={`Stock: ${currentStock}`} 
                            color="success" 
                            size="small" 
                            sx={{ fontWeight: 800, height: 24, fontSize: '0.68rem', bgcolor: 'rgba(16, 185, 129, 0.95)', color: '#fff', backdropFilter: 'blur(4px)' }} 
                          />
                        )}
                      </Box>

                      {/* Unit Pill on Top-Right of Image */}
                      <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                        <Chip
                          label={product.unit ? product.unit.toUpperCase() : 'PCS'}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(15, 23, 42, 0.75)',
                            backdropFilter: 'blur(4px)',
                            color: '#ffffff',
                            fontWeight: 800,
                            height: 22,
                            fontSize: '0.65rem'
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Card Content: Title, Size / Inches info, Shop owner edit/delete */}
                    <CardContent sx={{ p: 2.5, pb: 1.5, flexGrow: 1 }}>
                      
                      {/* Product Title and Owner action icons */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.3, fontSize: '1rem' }}>
                          {product.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                          <Tooltip title="Product Vivaram & Padam Matra (Edit)">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditProduct(product)}
                              sx={{ color: '#64748b', '&:hover': { color: 'primary.main', bgcolor: '#eff6ff' } }}
                            >
                              <EditIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Product-ai Neekka (Delete)">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteProduct(product)}
                              sx={{ color: '#64748b', '&:hover': { color: 'error.main', bgcolor: '#fef2f2' } }}
                            >
                              <DeleteIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* SIZE / INCHES HIGHLIGHT */}
                      <Box sx={{ bgcolor: '#fffbeb', border: '1px solid #fde68a', p: 1, px: 1.5, borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <TagIcon sx={{ fontSize: 16, color: '#d97706' }} />
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#92400e' }}>
                          Size / Inches: <Typography component="span" sx={{ fontWeight: 900, color: '#78350f', fontSize: '0.82rem' }}>{product.size}</Typography>
                        </Typography>
                      </Box>

                    </CardContent>

                    <Divider sx={{ borderColor: '#f1f5f9' }} />

                    {/* Card Actions: Vilai (Rate) & Add to Bill / Qty Counter */}
                    <CardActions sx={{ p: 2, px: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fafafa' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1 }}>
                          Vilai (Rate)
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: '#0f172a', mt: 0.3, fontSize: '1.25rem' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </Typography>
                      </Box>

                      {/* Cart Add / Quantity Selector */}
                      <Box>
                        {inCartQty > 0 ? (
                          <Paper
                            elevation={0}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              bgcolor: 'primary.light',
                              border: '1px solid #93c5fd',
                              borderRadius: 2.5,
                              p: 0.3
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => updateCartQty(product.id, inCartQty - 1)}
                              sx={{ bgcolor: '#ffffff', color: 'primary.dark', p: 0.5, '&:hover': { bgcolor: '#f1f5f9' } }}
                            >
                              <RemoveIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <Typography sx={{ width: 32, textAlign: 'center', fontWeight: 900, fontSize: '0.9rem', color: '#1e3a8a' }}>
                              {inCartQty}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => addToCart(product, 1)}
                              disabled={currentStock <= inCartQty}
                              sx={{ bgcolor: 'primary.main', color: '#ffffff', p: 0.5, '&:hover': { bgcolor: 'primary.dark' } }}
                            >
                              <AddIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Paper>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            disabled={isOutOfStock}
                            onClick={() => addToCart(product, 1)}
                            sx={{
                              borderRadius: 2.5,
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              px: 2,
                              py: 0.8,
                              boxShadow: 'none'
                            }}
                          >
                            + Bill-la Serka
                          </Button>
                        )}
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* MODAL 1: ADD New Product Dialog with Image Upload */}
        <Dialog 
          open={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
        >
          <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddIcon sx={{ color: '#38bdf8' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                Pudhu Product Serka ({category.name})
              </Typography>
            </Box>
            <IconButton onClick={() => setIsAddDialogOpen(false)} sx={{ color: '#94a3b8' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Box component="form" onSubmit={handleAddProductSubmit}>
            <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                required
                fullWidth
                label="Product Name *"
                placeholder={`e.g. ${category.name} 1 inch`}
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                size="small"
              />

              <TextField
                required
                fullWidth
                label="Size / Inches (அளவு) *"
                placeholder="e.g. 1 inch, 2 inch, 1/2 inch, 9W, 1 HP, 6201 ZZ"
                value={newProdSize}
                onChange={(e) => setNewProdSize(e.target.value)}
                size="small"
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Vilai / Price (₹) *"
                    placeholder="70"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Unit Type</InputLabel>
                    <Select
                      value={newProdUnit}
                      label="Unit Type"
                      onChange={(e) => setNewProdUnit(e.target.value)}
                    >
                      <MenuItem value="piece">Piece (Pcs)</MenuItem>
                      <MenuItem value="box">Box</MenuItem>
                      <MenuItem value="pkt">Packet</MenuItem>
                      <MenuItem value="roll">Roll</MenuItem>
                      <MenuItem value="coil">Coil</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Initial Stock Count"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Low Stock Warning Limit"
                    value={newProdAlert}
                    onChange={(e) => setNewProdAlert(e.target.value)}
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* IMAGE UPLOAD & IMAGE URL SECTION */}
              <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px dashed #cbd5e1' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon sx={{ fontSize: 18, color: '#2563eb' }} />
                  Product Padam / Image (Real Photo)
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 1.5 }}>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      borderRadius: 2.5,
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      borderColor: '#94a3b8',
                      color: '#1e293b'
                    }}
                  >
                    Padam Upload Pannu (Choose File)
                    <input
                      type="file"
                      hidden
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleAddFileChange}
                    />
                  </Button>

                  {newProdImageFile && (
                    <Chip
                      label={newProdImageFile.name}
                      onDelete={() => {
                        setNewProdImageFile(null);
                        setNewProdImagePreview('');
                      }}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  )}
                </Box>

                <TextField
                  fullWidth
                  size="small"
                  label="Alladhu Padam URL Link (Unsplash / Web URL)"
                  placeholder="https://images.unsplash.com/..."
                  value={newProdImageUrl}
                  onChange={(e) => {
                    setNewProdImageUrl(e.target.value);
                    if (!newProdImageFile) setNewProdImagePreview(e.target.value);
                  }}
                  helperText="Device file upload alladhu direct image link renderil ondrai select pannalam."
                />

                {/* Live Preview Box */}
                {newProdImagePreview && (
                  <Box sx={{ mt: 1.5, position: 'relative', width: '100%', height: 140, borderRadius: 2.5, overflow: 'hidden', border: '1.5px solid #cbd5e1' }}>
                    <Box
                      component="img"
                      src={newProdImagePreview}
                      alt="Product preview"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setNewProdImageFile(null);
                        setNewProdImageUrl('');
                        setNewProdImagePreview('');
                      }}
                      sx={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        bgcolor: 'rgba(0,0,0,0.65)',
                        color: '#ffffff',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' }
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                )}
              </Box>

            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <Button onClick={() => setIsAddDialogOpen(false)} sx={{ color: '#64748b' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 800 }}>
                Product Save Pannu
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* MODAL 2: UPDATE Product Dialog with Image Change */}
        {editingProduct && (
          <Dialog 
            open={Boolean(editingProduct)} 
            onClose={() => setEditingProduct(null)}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
          >
            <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EditIcon sx={{ color: '#38bdf8' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                  Product Vivaram & Padam Matra (Update)
                </Typography>
              </Box>
              <IconButton onClick={() => setEditingProduct(null)} sx={{ color: '#94a3b8' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleEditProductSubmit}>
              <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="Product Name *"
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  size="small"
                />

                <TextField
                  required
                  fullWidth
                  label="Size / Inches (அளவு) *"
                  value={editProdSize}
                  onChange={(e) => setEditProdSize(e.target.value)}
                  size="small"
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      label="Vilai / Price (₹) *"
                      value={editProdPrice}
                      onChange={(e) => setEditProdPrice(e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Unit Type</InputLabel>
                      <Select
                        value={editProdUnit}
                        label="Unit Type"
                        onChange={(e) => setEditProdUnit(e.target.value)}
                      >
                        <MenuItem value="piece">Piece (Pcs)</MenuItem>
                        <MenuItem value="box">Box</MenuItem>
                        <MenuItem value="pkt">Packet</MenuItem>
                        <MenuItem value="roll">Roll</MenuItem>
                        <MenuItem value="coil">Coil</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Stock Count"
                      value={editProdStock}
                      onChange={(e) => setEditProdStock(e.target.value)}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Low Stock Warning Limit"
                      value={editProdAlert}
                      onChange={(e) => setEditProdAlert(e.target.value)}
                      size="small"
                    />
                  </Grid>
                </Grid>

                {/* EDIT IMAGE UPLOAD & IMAGE URL SECTION */}
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px dashed #cbd5e1' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageIcon sx={{ fontSize: 18, color: '#2563eb' }} />
                    Product Padam Matra (Change Image / Photo)
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', mb: 1.5 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        borderRadius: 2.5,
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        borderColor: '#94a3b8',
                        color: '#1e293b'
                      }}
                    >
                      Pudhu Padam Upload (Choose File)
                      <input
                        type="file"
                        hidden
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleEditFileChange}
                      />
                    </Button>

                    {editProdImageFile && (
                      <Chip
                        label={editProdImageFile.name}
                        onDelete={() => {
                          setEditProdImageFile(null);
                          setEditProdImagePreview(editProdImageUrl || getProductDefaultImage(editingProduct, categoryId));
                        }}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </Box>

                  <TextField
                    fullWidth
                    size="small"
                    label="Padam URL Link"
                    placeholder="https://images.unsplash.com/..."
                    value={editProdImageUrl}
                    onChange={(e) => {
                      setEditProdImageUrl(e.target.value);
                      if (!editProdImageFile) setEditProdImagePreview(e.target.value);
                    }}
                  />

                  {/* Preview Box */}
                  {editProdImagePreview && (
                    <Box sx={{ mt: 1.5, position: 'relative', width: '100%', height: 140, borderRadius: 2.5, overflow: 'hidden', border: '1.5px solid #cbd5e1' }}>
                      <Box
                        component="img"
                        src={editProdImagePreview}
                        alt="Product preview"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditProdImageFile(null);
                          setEditProdImageUrl('');
                          setEditProdImagePreview('');
                        }}
                        sx={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          bgcolor: 'rgba(0,0,0,0.65)',
                          color: '#ffffff',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' }
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </DialogContent>

              <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Button onClick={() => setEditingProduct(null)} sx={{ color: '#64748b' }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" sx={{ fontWeight: 800 }}>
                  Save Changes (மாற்றங்களை சேமி)
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )}

        {/* Floating Bottom Cart / Bill Total Bar (Material UI Paper) */}
        {cart.length > 0 && (
          <Paper
            elevation={10}
            sx={{
              position: 'fixed',
              bottom: { xs: 70, sm: 24 },
              left: { xs: 16, sm: 'auto' },
              right: { xs: 16, sm: 28 },
              maxWidth: { sm: 420 },
              width: { xs: 'calc(100% - 32px)', sm: 'auto' },
              zIndex: 40,
              bgcolor: '#0f172a',
              color: '#ffffff',
              borderRadius: 4,
              p: 2,
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ position: 'relative', width: 44, height: 44, borderRadius: 3, bgcolor: '#f59e0b', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CartIcon />
                <Chip
                  label={cartTotalItems}
                  color="error"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    height: 20,
                    minWidth: 20,
                    fontWeight: 900,
                    fontSize: '0.65rem'
                  }}
                />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1.1 }}>
                  {cart.length} Items • Moththa Bill:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#fbbf24', lineHeight: 1.2 }}>
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="success"
              endIcon={<ArrowForwardIcon />}
              onClick={onOpenCheckout}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 3,
                fontWeight: 900,
                fontSize: '0.875rem',
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' }
              }}
            >
              Bill Podu
            </Button>
          </Paper>
        )}

      </Container>
    </Box>
  );
}
