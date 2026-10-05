import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { getProductDefaultImage } from '../../data/initialData';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  AlertTitle,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Tooltip,
  ButtonGroup,
  Avatar
} from '@mui/material';
import {
  Inventory2 as StockIcon,
  Search as SearchIcon,
  Add as AddIcon,
  WarningAmber as WarningIcon,
  CheckCircle as CheckIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';

export default function StockManagementView() {
  const { 
    categories,
    products, 
    lowStockProducts, 
    quickAddStock, 
    updateProductStock, 
    addNewProduct, 
    updateProduct, 
    deleteProduct 
  } = useShop();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Dialog States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'bulb',
    size: '',
    price: '',
    stock: '',
    lowStockAlert: '5',
    unit: 'piece',
    imageUrl: ''
  });
  const [addImgFile, setAddImgFile] = useState(null);
  const [addImgPreview, setAddImgPreview] = useState('');

  // Edit Product Form Image State
  const [editImgFile, setEditImgFile] = useState(null);
  const [editImgPreview, setEditImgPreview] = useState('');

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory || p.categoryId === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      (p.size && p.size.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));
    const currentStock = p.stock ?? p.stockCount ?? 0;
    const matchesLowStock = !showLowStockOnly || currentStock <= (p.lowStockAlert || 5);
    return matchesCategory && matchesSearch && matchesLowStock;
  });

  // Handle Add Image File Selection
  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddImgFile(file);
      setAddImgPreview(URL.createObjectURL(file));
    }
  };

  // Handle Edit Image File Selection
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImgFile(file);
      setEditImgPreview(URL.createObjectURL(file));
    }
  };

  // Handle Add Product Submit
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.size.trim()) {
      alert('Product name matrum Size/Inches kandippa enter pannanum!');
      return;
    }

    await addNewProduct({
      ...formData,
      imageFile: addImgFile,
      imageUrl: formData.imageUrl.trim()
    });

    setFormData({
      name: '',
      category: 'bulb',
      size: '',
      price: '',
      stock: '',
      lowStockAlert: '5',
      unit: 'piece',
      imageUrl: ''
    });
    setAddImgFile(null);
    setAddImgPreview('');
    setIsAddDialogOpen(false);
  };

  // Open Edit Product
  const handleOpenEdit = (product) => {
    setEditingProduct({
      ...product,
      stock: (product.stock ?? product.stockCount ?? 0).toString(),
      imageUrl: product.imageUrl || ''
    });
    setEditImgFile(null);
    setEditImgPreview(product.imageUrl || getProductDefaultImage(product, product.category));
  };

  // Handle Edit Product Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    await updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category || editingProduct.categoryId,
      categoryId: editingProduct.category || editingProduct.categoryId,
      size: editingProduct.size,
      price: parseFloat(editingProduct.price) || 0,
      stock: parseInt(editingProduct.stock) || 0,
      stockCount: parseInt(editingProduct.stock) || 0,
      lowStockAlert: parseInt(editingProduct.lowStockAlert) || 5,
      unit: editingProduct.unit || 'piece',
      imageUrl: (editingProduct.imageUrl || '').trim(),
      imageFile: editImgFile
    });

    setEditingProduct(null);
    setEditImgFile(null);
    setEditImgPreview('');
  };

  return (
    <Box sx={{ py: { xs: 2.5, sm: 4 }, pb: { xs: 16, sm: 12 }, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        
        {/* Top Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StockIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h1" sx={{ color: '#0f172a', m: 0 }}>
                Sarakku & Stock Nilavaram (Stock Management)
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Sarakku iruppu kanakku, real product images, low stock warnings, matrum pudhu sarakku serkkum idam
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setAddImgFile(null);
              setAddImgPreview('');
              setIsAddDialogOpen(true);
            }}
            sx={{
              borderRadius: 3,
              fontWeight: 800,
              fontSize: '0.85rem',
              px: 2.5,
              py: 1,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              alignSelf: { xs: 'flex-start', sm: 'center' }
            }}
          >
            + Pudhu Sarakku Serka
          </Button>
        </Box>

        {/* ⚠️ Low Stock Alert Banner (using Material UI Alert component) */}
        {lowStockProducts.length > 0 && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3, borderRadius: 3, border: '1px solid #fde047' }}
            action={
              <Button 
                color="warning" 
                size="small" 
                variant="outlined"
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                sx={{ fontWeight: 800 }}
              >
                {showLowStockOnly ? 'Ellam Kaattu' : 'Low Stock Mattum Paaru'}
              </Button>
            }
          >
            <AlertTitle sx={{ fontWeight: 800 }}>Low Stock Warning Alert!</AlertTitle>
            Kadaisi nilavaram: <strong>{lowStockProducts.length} porutkal</strong> stock limit-ai vida kuraindhadhu. Udane re-order seiyavum!
          </Alert>
        )}

        {/* Filter & Search Bar */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Product name, size, category thedu (Search)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button
                  size="small"
                  variant={showLowStockOnly ? 'contained' : 'outlined'}
                  color="warning"
                  startIcon={<FilterIcon />}
                  onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                  sx={{ borderRadius: 2.5, fontWeight: 700 }}
                >
                  Low Stock Mattum ({lowStockProducts.length})
                </Button>
                {selectedCategory && (
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    onClick={() => setSelectedCategory(null)}
                    sx={{ fontWeight: 700 }}
                  >
                    Clear Filter
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Category Horizontal Filter Pills */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 2, mb: 2 }}>
          <Chip
            label="All Categories (Ellam)"
            clickable
            color={!selectedCategory ? 'primary' : 'default'}
            variant={!selectedCategory ? 'filled' : 'outlined'}
            onClick={() => setSelectedCategory(null)}
            sx={{ fontWeight: 700 }}
          />
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              label={`${cat.name} (${cat.tamilName})`}
              clickable
              color={selectedCategory === cat.id ? 'primary' : 'default'}
              variant={selectedCategory === cat.id ? 'filled' : 'outlined'}
              onClick={() => setSelectedCategory(cat.id)}
              sx={{ fontWeight: 700 }}
            />
          ))}
        </Box>

        {/* Products Stock Table with Product Avatar / Image */}
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 4, bgcolor: '#ffffff', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 800 }}>Product & Padam</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Size / Inches</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Vilai (Rate)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800 }}>Current Stock</TableCell>
                <TableCell align="center" sx={{ fontWeight: 800 }}>Stock Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Quick Restock</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => {
                const currentStock = product.stock ?? product.stockCount ?? 0;
                const isLow = currentStock <= (product.lowStockAlert || 5);
                const isZero = currentStock <= 0;
                const displayImg = product.imageUrl || getProductDefaultImage(product, product.category || product.categoryId);

                return (
                  <TableRow key={product.id} hover>
                    
                    {/* Real Product Thumbnail & Name */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          variant="rounded"
                          src={displayImg}
                          alt={product.name}
                          sx={{ 
                            width: 44, 
                            height: 44, 
                            borderRadius: 2, 
                            bgcolor: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                          }}
                          imgProps={{
                            onError: (e) => { e.target.src = getProductDefaultImage(product, product.category || product.categoryId); }
                          }}
                        />
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                            {product.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                            {(product.category || product.categoryId || '').replace('_', ' ')}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Size / Inches */}
                    <TableCell>
                      <Chip
                        label={product.size}
                        size="small"
                        sx={{ fontWeight: 800, bgcolor: '#fef3c7', color: '#92400e', fontSize: '0.72rem' }}
                      />
                    </TableCell>

                    {/* Rate */}
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 900, color: '#0f172a', fontSize: '0.95rem' }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>

                    {/* Current Stock (Inline Input) */}
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        value={currentStock}
                        onChange={(e) => updateProductStock(product.id, e.target.value)}
                        inputProps={{ min: 0, style: { textAlign: 'center', fontWeight: 900, width: 50, padding: '4px 6px' } }}
                        sx={{
                          bgcolor: isLow ? '#fee2e2' : '#f8fafc',
                          borderRadius: 2,
                          '& fieldset': { borderColor: isLow ? '#f87171' : '#cbd5e1' }
                        }}
                      />
                    </TableCell>

                    {/* Stock Status Badge */}
                    <TableCell align="center">
                      {isZero ? (
                        <Chip label="Stock Illai (0)" color="error" size="small" sx={{ fontWeight: 800, fontSize: '0.68rem' }} />
                      ) : isLow ? (
                        <Chip
                          icon={<WarningIcon sx={{ fontSize: '13px !important' }} />}
                          label="Low Stock Warning!"
                          color="warning"
                          size="small"
                          sx={{ fontWeight: 800, fontSize: '0.68rem' }}
                        />
                      ) : (
                        <Chip
                          icon={<CheckIcon sx={{ fontSize: '13px !important' }} />}
                          label="Stock Nalla Irukku"
                          color="success"
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                        />
                      )}
                    </TableCell>

                    {/* Quick Restock (+5, +10, +25) */}
                    <TableCell align="right">
                      <ButtonGroup size="small" variant="outlined">
                        <Button onClick={() => quickAddStock(product.id, 5)} sx={{ fontWeight: 800, fontSize: '0.7rem' }}>+5</Button>
                        <Button onClick={() => quickAddStock(product.id, 10)} sx={{ fontWeight: 800, fontSize: '0.7rem' }}>+10</Button>
                        <Button onClick={() => quickAddStock(product.id, 25)} variant="contained" sx={{ fontWeight: 800, fontSize: '0.7rem' }}>+25</Button>
                      </ButtonGroup>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Tooltip title="Product Vivaram & Padam Matra (Edit)">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenEdit(product)}
                            sx={{ color: '#64748b', '&:hover': { color: 'primary.main', bgcolor: '#eff6ff' } }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (window.confirm(`"${product.name}"-ai neekka venduma?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            sx={{ color: '#64748b', '&:hover': { color: 'error.main', bgcolor: '#fef2f2' } }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* DIALOG 1: Add New Product with Image Upload */}
        <Dialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
        >
          <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
              Pudhu Sarakku / Item Serka
            </Typography>
            <IconButton onClick={() => setIsAddDialogOpen(false)} sx={{ color: '#94a3b8' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Box component="form" onSubmit={handleAddSubmit}>
            <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
              
              <FormControl fullWidth size="small">
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.category}
                  label="Category *"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name} ({c.tamilName})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                required
                fullWidth
                label="Product Name *"
                placeholder="e.g. Philips LED Batten Light"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                size="small"
              />

              <TextField
                required
                fullWidth
                label="Size / Inches (அளவு) *"
                placeholder="e.g. 1/2 Inch, 3/4 Inch, 9W, 1 HP"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                size="small"
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Vilai (Price ₹) *"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Alavu Unit</InputLabel>
                    <Select
                      value={formData.unit}
                      label="Alavu Unit"
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <MenuItem value="piece">Piece (Pcs)</MenuItem>
                      <MenuItem value="box">Box</MenuItem>
                      <MenuItem value="roll">Roll</MenuItem>
                      <MenuItem value="coil">Coil</MenuItem>
                      <MenuItem value="pkt">Packet</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    label="Initial Stock Count *"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    size="small"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Low Stock Warning Limit"
                    value={formData.lowStockAlert}
                    onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.value })}
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

                  {addImgFile && (
                    <Chip
                      label={addImgFile.name}
                      onDelete={() => {
                        setAddImgFile(null);
                        setAddImgPreview('');
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
                  label="Alladhu Padam URL Link (Web URL)"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    if (!addImgFile) setAddImgPreview(e.target.value);
                  }}
                />

                {/* Live Preview Box */}
                {addImgPreview && (
                  <Box sx={{ mt: 1.5, position: 'relative', width: '100%', height: 140, borderRadius: 2.5, overflow: 'hidden', border: '1.5px solid #cbd5e1' }}>
                    <Box
                      component="img"
                      src={addImgPreview}
                      alt="Product preview"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setAddImgFile(null);
                        setFormData({ ...formData, imageUrl: '' });
                        setAddImgPreview('');
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
                Sarakku Serka (Save Product)
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* DIALOG 2: Edit Product with Image Change */}
        {editingProduct && (
          <Dialog
            open={Boolean(editingProduct)}
            onClose={() => setEditingProduct(null)}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
          >
            <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>
                Sarakku & Padam Matra (Edit Product)
              </Typography>
              <IconButton onClick={() => setEditingProduct(null)} sx={{ color: '#94a3b8' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleEditSubmit}>
              <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                <TextField
                  required
                  fullWidth
                  label="Product Name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  size="small"
                />

                <TextField
                  required
                  fullWidth
                  label="Size / Inches"
                  value={editingProduct.size}
                  onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                  size="small"
                />

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      label="Price (₹)"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      size="small"
                    />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Stock Count"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      size="small"
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  type="number"
                  label="Low Stock Warning Limit"
                  value={editingProduct.lowStockAlert}
                  onChange={(e) => setEditingProduct({ ...editingProduct, lowStockAlert: e.target.value })}
                  size="small"
                />

                {/* EDIT IMAGE UPLOAD & IMAGE URL SECTION */}
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px dashed #cbd5e1' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#334155', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageIcon sx={{ fontSize: 18, color: '#2563eb' }} />
                    Product Padam Matra (Change Photo)
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

                    {editImgFile && (
                      <Chip
                        label={editImgFile.name}
                        onDelete={() => {
                          setEditImgFile(null);
                          setEditImgPreview(editingProduct.imageUrl || getProductDefaultImage(editingProduct, editingProduct.category));
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
                    value={editingProduct.imageUrl || ''}
                    onChange={(e) => {
                      setEditingProduct({ ...editingProduct, imageUrl: e.target.value });
                      if (!editImgFile) setEditImgPreview(e.target.value);
                    }}
                  />

                  {/* Preview Box */}
                  {editImgPreview && (
                    <Box sx={{ mt: 1.5, position: 'relative', width: '100%', height: 140, borderRadius: 2.5, overflow: 'hidden', border: '1.5px solid #cbd5e1' }}>
                      <Box
                        component="img"
                        src={editImgPreview}
                        alt="Product preview"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditImgFile(null);
                          setEditingProduct({ ...editingProduct, imageUrl: '' });
                          setEditImgPreview('');
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
                  Save Changes
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )}

      </Container>
    </Box>
  );
}
