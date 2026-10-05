import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { getCategoryDefaultImage } from '../../data/initialData';
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
  Chip,
  Paper,
  Tooltip,
  Divider,
  Stack
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  FlashOn as BoltIcon,
  Build as BuildIcon,
  AltRoute as AltRouteIcon,
  SettingsSuggest as MotorIcon,
  ToggleOn as SwitchIcon,
  WaterDrop as TapIcon,
  RadioButtonChecked as ValveIcon,
  DonutLarge as BearingIcon,
  Category as CategoryIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  ShoppingCart as CartIcon,
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const getCategoryIcon = (iconName, catId) => {
  switch (iconName || catId) {
    case 'Lightbulb':
    case 'bulb':
      return <LightbulbIcon sx={{ fontSize: 20 }} />;
    case 'Zap':
    case 'holder':
      return <BoltIcon sx={{ fontSize: 20 }} />;
    case 'Wrench':
    case 'screw':
      return <BuildIcon sx={{ fontSize: 20 }} />;
    case 'CornerUpRight':
    case 'bend_elbow':
      return <AltRouteIcon sx={{ fontSize: 20 }} />;
    case 'Cpu':
    case 'motor':
      return <MotorIcon sx={{ fontSize: 20 }} />;
    case 'ToggleRight':
    case 'switch':
      return <SwitchIcon sx={{ fontSize: 22 }} />;
    case 'Droplets':
    case 'tap':
      return <TapIcon sx={{ fontSize: 20 }} />;
    case 'Disc':
    case 'ball_valve':
      return <ValveIcon sx={{ fontSize: 20 }} />;
    case 'CircleDot':
    case 'bearing':
      return <BearingIcon sx={{ fontSize: 20 }} />;
    default:
      return <CategoryIcon sx={{ fontSize: 20 }} />;
  }
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

  // Dialog States
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form State: Add Category
  const [newCatName, setNewCatName] = useState('');
  const [newCatTamilName, setNewCatTamilName] = useState('');
  const [newCatSizesPreview, setNewCatSizesPreview] = useState('');
  const [newCatImageUrl, setNewCatImageUrl] = useState('');
  const [newCatImageFile, setNewCatImageFile] = useState(null);
  const [newCatImagePreview, setNewCatImagePreview] = useState('');

  // Form State: Edit Category
  const [editName, setEditName] = useState('');
  const [editTamilName, setEditTamilName] = useState('');
  const [editSizesPreview, setEditSizesPreview] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');

  // Handle Add File Selection
  const handleAddFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCatImageFile(file);
      setNewCatImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Edit File Selection
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Add Category
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      alert('Category Name kandippa podanum!');
      return;
    }

    await addNewCategory({
      name: newCatName.trim(),
      tamilName: newCatTamilName.trim() || newCatName.trim(),
      sizesPreview: newCatSizesPreview.trim() || 'All Sizes Available',
      icon: 'Category',
      color: 'from-blue-600 to-indigo-700',
      imageUrl: newCatImageUrl.trim(),
      imageFile: newCatImageFile
    });

    setNewCatName('');
    setNewCatTamilName('');
    setNewCatSizesPreview('');
    setNewCatImageUrl('');
    setNewCatImageFile(null);
    setNewCatImagePreview('');
    setIsAddDialogOpen(false);
  };

  // Open Edit Dialog
  const handleOpenEdit = (e, cat) => {
    e.stopPropagation();
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditTamilName(cat.tamilName || '');
    setEditSizesPreview(cat.sizesPreview || '');
    setEditImageUrl(cat.imageUrl || '');
    setEditImageFile(null);
    setEditImagePreview(cat.imageUrl || getCategoryDefaultImage(cat.id));
  };

  // Submit Edit Category
  const handleEditCategorySubmit = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editName.trim()) return;

    await updateCategory(editingCategory.id, {
      name: editName.trim(),
      tamilName: editTamilName.trim(),
      sizesPreview: editSizesPreview.trim(),
      imageUrl: editImageUrl.trim(),
      imageFile: editImageFile
    });

    setEditingCategory(null);
    setEditImageFile(null);
    setEditImagePreview('');
  };

  // Delete Category
  const handleDelete = (e, cat) => {
    e.stopPropagation();
    const count = products.filter(p => p.category === cat.id || p.categoryId === cat.id).length;
    const confirmMsg = count > 0
      ? `"${cat.name}" category-ai neekka venduma? Idharkul ulla ${count} products-um delete aagum!`
      : `"${cat.name}" category-ai delete panna venduma?`;

    if (window.confirm(confirmMsg)) {
      deleteCategory(cat.id);
    }
  };

  return (
    <Box sx={{ py: { xs: 2.5, sm: 4 }, pb: { xs: 16, sm: 12 }, minHeight: '80vh' }}>
      <Container maxWidth="lg">
        
        {/* Top Header Banner */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2, mb: 4 }}>
          <Box>
            <Chip 
              label="NP Electricals • Categories Page (No Products Here)" 
              color="primary" 
              variant="outlined"
              size="small"
              sx={{ fontWeight: 800, mb: 1, bgcolor: 'rgba(37, 99, 235, 0.06)' }}
            />
            <Typography variant="h1" sx={{ color: '#0f172a', m: 0 }}>
              Porul Categories (பிரிவுகள்)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
              Category-ai click pannunga product list paarka, illana pudhu category serka/manage pannunga:
            </Typography>
          </Box>

          {/* Shop Owner Control: ADD New Category */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setNewCatName('');
              setNewCatTamilName('');
              setNewCatSizesPreview('');
              setNewCatImageUrl('');
              setNewCatImageFile(null);
              setNewCatImagePreview('');
              setIsAddDialogOpen(true);
            }}
            sx={{
              px: { xs: 2.5, sm: 3 },
              py: 1.2,
              borderRadius: 3,
              fontSize: '0.875rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              alignSelf: { xs: 'flex-start', sm: 'center' }
            }}
          >
            + Pudhu Category Serka
          </Button>
        </Box>

        {/* Categories Grid - Material UI Cards with CardMedia Image at Top */}
        <Grid container spacing={3}>
          {categories.map((cat, index) => {
            const count = products.filter(p => p.category === cat.id || p.categoryId === cat.id).length;
            const displayImg = cat.imageUrl || getCategoryDefaultImage(cat.id);

            return (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={cat.id}
                size={{ xs: 12, sm: 6, md: 4 }}
              >
                <Card
                  onClick={() => onSelectCategory(cat.id)}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderRadius: 4,
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: '#ffffff',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      borderColor: 'primary.main',
                      boxShadow: '0 14px 30px rgba(37, 99, 235, 0.16)'
                    }
                  }}
                >
                  {/* Real Image Displayed at the Top using Material UI CardMedia */}
                  <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#f1f5f9' }}>
                    <CardMedia
                      component="img"
                      image={displayImg}
                      alt={cat.name}
                      onError={(e) => {
                        e.target.src = getCategoryDefaultImage(cat.id);
                      }}
                      sx={{
                        height: { xs: 160, sm: 175 },
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.04)'
                        }
                      }}
                    />

                    {/* Category Index & Icon Pill Overlay */}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        left: 12, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.8,
                        bgcolor: 'rgba(15, 23, 42, 0.82)', 
                        backdropFilter: 'blur(4px)',
                        color: '#ffffff', 
                        px: 1.2, 
                        py: 0.4, 
                        borderRadius: 2 
                      }}
                    >
                      {getCategoryIcon(cat.icon, cat.id)}
                      <Typography sx={{ fontWeight: 800, fontSize: '0.75rem', color: '#fcd34d' }}>
                        #{index + 1}
                      </Typography>
                    </Box>

                    {/* Product count tag overlay */}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 10, 
                        right: 12, 
                        bgcolor: 'rgba(255, 255, 255, 0.92)', 
                        backdropFilter: 'blur(4px)',
                        px: 1.2, 
                        py: 0.3, 
                        borderRadius: 2,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: '0.72rem', color: '#1e293b' }}>
                        {count} Products
                      </Typography>
                    </Box>
                  </Box>

                  {/* CardContent: Title, Bilingual labels, Description / Sizes info */}
                  <CardContent sx={{ p: 2.5, pb: 1.5, flexGrow: 1 }}>
                    <Stack direction="column" spacing={1.2}>
                      <Stack direction="row" alignItems="baseline" spacing={1} flexWrap="wrap">
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
                          {cat.name}
                        </Typography>
                        {cat.tamilName && (
                          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 700 }}>
                            ({cat.tamilName})
                          </Typography>
                        )}
                      </Stack>

                      {/* Sizes / Description Preview */}
                      <Box sx={{ bgcolor: '#fef3c7', px: 1.2, py: 0.6, borderRadius: 2, border: '1px solid #fde68a' }}>
                        <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 800, display: 'block' }}>
                          Sizes / Inches:
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: '#78350f', fontSize: '0.75rem', lineHeight: 1.2, mt: 0.2 }}>
                          {cat.sizesPreview || 'All sizes available'}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>

                  <Divider sx={{ borderColor: '#f1f5f9' }} />

                  {/* CardActions: Shop Owner Controls (Edit/Delete) + View Button */}
                  <CardActions sx={{ px: 2, py: 1.2, bgcolor: '#fafafa' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                      <Stack direction="row" alignItems="center" spacing={0.8}>
                        {/* Shop Owner Edit Button */}
                        <Tooltip title="Category Peyar / Padam Matra (Edit Category & Image)">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon sx={{ fontSize: 15 }} />}
                            onClick={(e) => handleOpenEdit(e, cat)}
                            sx={{ 
                              fontSize: '0.72rem', 
                              fontWeight: 700, 
                              borderRadius: 2,
                              py: 0.4,
                              px: 1.2,
                              color: '#475569',
                              borderColor: '#cbd5e1',
                              bgcolor: '#ffffff',
                              '&:hover': { bgcolor: '#eff6ff', borderColor: 'primary.main', color: 'primary.main' }
                            }}
                          >
                            Edit
                          </Button>
                        </Tooltip>

                        {/* Shop Owner Delete Button */}
                        <Tooltip title="Category-ai Neekka (Delete)">
                          <IconButton
                            size="small"
                            onClick={(e) => handleDelete(e, cat)}
                            sx={{ color: '#64748b', bgcolor: '#ffffff', border: '1px solid #e2e8f0', '&:hover': { color: 'error.main', bgcolor: '#fef2f2' } }}
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      {/* View Products Button */}
                      <Button
                        size="small"
                        color="primary"
                        endIcon={<ArrowForwardIcon sx={{ fontSize: 15 }} />}
                        sx={{ fontWeight: 800, fontSize: '0.75rem', borderRadius: 2 }}
                      >
                        View
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* DIALOG 1: ADD New Category (with Image Upload) */}
        <Dialog 
          open={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
        >
          <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AddIcon sx={{ color: '#f59e0b' }} />
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                Pudhu Category Serka (Category Add pannunga)
              </Typography>
            </Box>
            <IconButton onClick={() => setIsAddDialogOpen(false)} sx={{ color: '#94a3b8' }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Box component="form" onSubmit={handleAddCategorySubmit}>
            <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              
              <TextField
                required
                fullWidth
                label="Category Name (English) *"
                placeholder="e.g. Capacitor, Fan Blade, Water Tank"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                size="small"
              />

              <TextField
                fullWidth
                label="Tamil Name (தமிழ் பெயர்)"
                placeholder="e.g. கெபாசிட்டர் / மின் தேக்கி"
                value={newCatTamilName}
                onChange={(e) => setNewCatTamilName(e.target.value)}
                size="small"
              />

              <TextField
                fullWidth
                label="Sizes / Inches Preview (அளவுகள்)"
                placeholder="e.g. 2.5 MFD, 3.15 MFD, 36 MFD"
                value={newCatSizesPreview}
                onChange={(e) => setNewCatSizesPreview(e.target.value)}
                size="small"
              />

              {/* IMAGE UPLOAD SECTION (DEVICE GALLERY / FILE PICKER ONLY) */}
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: '1.5px dashed #cbd5e1' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                  Category Padam / Image Upload (Device Gallery / Files)
                </Typography>
                
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mt: 1 }}>
                  {/* File Upload Button */}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ borderRadius: 2.5, fontWeight: 700, fontSize: '0.8rem', bgcolor: '#ffffff', borderColor: '#94a3b8' }}
                  >
                    📷 Gallery / Files-il irundhu Padam Select Pannu
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleAddFileChange}
                    />
                  </Button>

                  {newCatImageFile && (
                    <Chip
                      label={newCatImageFile.name}
                      onDelete={() => {
                        setNewCatImageFile(null);
                        setNewCatImagePreview('');
                      }}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />
                  )}
                </Stack>

                {/* Selected Image Preview with Remove Button */}
                {newCatImagePreview ? (
                  <Box sx={{ mt: 2, position: 'relative', width: '100%', maxHeight: 180, borderRadius: 2.5, overflow: 'hidden', border: '1.5px solid #cbd5e1' }}>
                    <Box
                      component="img"
                      src={newCatImagePreview}
                      alt="Selected Category Preview"
                      sx={{
                        width: '100%',
                        maxHeight: 180,
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                      onClick={() => {
                        setNewCatImageFile(null);
                        setNewCatImagePreview('');
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        py: 0.3,
                        px: 1,
                        borderRadius: 2,
                        bgcolor: 'rgba(220, 38, 38, 0.9)'
                      }}
                    >
                      Padam Neekka (Remove)
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                    Padam select seiyyavillai endral default category padam thaan kaattum.
                  </Typography>
                )}
              </Paper>

            </DialogContent>

            <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
              <Button onClick={() => setIsAddDialogOpen(false)} sx={{ color: '#64748b' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Category Add pannunga
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* DIALOG 2: UPDATE Category Details & Image */}
        {editingCategory && (
          <Dialog 
            open={Boolean(editingCategory)} 
            onClose={() => setEditingCategory(null)}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4, p: 0.5 } }}
          >
            <DialogTitle sx={{ m: 0, p: 2.5, bgcolor: '#0f172a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EditIcon sx={{ color: '#38bdf8' }} />
                <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                  Category & Padam Matra (Update Category & Image)
                </Typography>
              </Box>
              <IconButton onClick={() => setEditingCategory(null)} sx={{ color: '#94a3b8' }}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <Box component="form" onSubmit={handleEditCategorySubmit}>
              <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                
                <TextField
                  required
                  fullWidth
                  label="Category Name (English) *"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Tamil Name (தமிழ் பெயர்)"
                  value={editTamilName}
                  onChange={(e) => setEditTamilName(e.target.value)}
                  size="small"
                />

                <TextField
                  fullWidth
                  label="Sizes / Inches Preview"
                  value={editSizesPreview}
                  onChange={(e) => setEditSizesPreview(e.target.value)}
                  size="small"
                />

                {/* EDIT IMAGE UPLOAD SECTION (DEVICE GALLERY / FILE PICKER ONLY) */}
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: '1.5px dashed #cbd5e1' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ImageIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    Category Padam Matra (Change Image from Gallery / Files)
                  </Typography>

                  <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<CloudUploadIcon />}
                      sx={{ borderRadius: 2.5, fontWeight: 700, fontSize: '0.8rem', bgcolor: '#ffffff', borderColor: '#94a3b8' }}
                    >
                      📷 Pudhu Padam Select Pannu (Gallery / Files)
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleEditFileChange}
                      />
                    </Button>

                    {editImageFile && (
                      <Chip
                        label={editImageFile.name}
                        onDelete={() => {
                          setEditImageFile(null);
                          setEditImagePreview(editingCategory.imageUrl || getCategoryDefaultImage(editingCategory.id));
                        }}
                        color="primary"
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    )}
                  </Stack>

                  {/* Preview */}
                  {editImagePreview && (
                    <Box sx={{ mt: 2, position: 'relative', width: '100%', maxHeight: 180, borderRadius: 2.5, overflow: 'hidden', border: '1.5px solid #cbd5e1' }}>
                      <Box
                        component="img"
                        src={editImagePreview}
                        alt="Category Preview"
                        sx={{
                          width: '100%',
                          maxHeight: 180,
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<CloseIcon sx={{ fontSize: 14 }} />}
                        onClick={() => {
                          setEditImageFile(null);
                          setEditImageUrl('');
                          setEditImagePreview('');
                        }}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          py: 0.3,
                          px: 1,
                          borderRadius: 2,
                          bgcolor: 'rgba(220, 38, 38, 0.9)'
                        }}
                      >
                        Padam Neekka (Remove)
                      </Button>
                    </Box>
                  )}
                </Paper>

              </DialogContent>

              <DialogActions sx={{ p: 2.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Button onClick={() => setEditingCategory(null)} sx={{ color: '#64748b' }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Changes (மாற்றங்களை சேமி)
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        )}

        {/* Floating Bottom Cart / Bill Total Bar */}
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
