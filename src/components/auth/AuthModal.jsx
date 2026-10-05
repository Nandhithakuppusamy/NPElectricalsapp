import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  Alert, 
  Box, 
  Typography, 
  Chip,
  IconButton
} from '@mui/material';
import { Close, LockOutlined, CheckCircle } from '@mui/icons-material';

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, loginUser, logoutUser } = useShop();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await loginUser(username, password);
      if (success) {
        onClose();
      } else {
        setError('Login thavaru! Username / Password check pannunga.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login panna mudiyavillai. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, p: 1 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: 3, 
            bgcolor: 'primary.light', 
            color: 'primary.contrastText',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <LockOutlined />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Shop Owner Login
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              NP Electricals Admin Control
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2, pt: 1 }}>
        {currentUser ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircle color="success" sx={{ fontSize: 50, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Logged in as {currentUser.name || currentUser.username}
            </Typography>
            <Chip 
              label={`Role: ${currentUser.role || 'Admin'}`} 
              color="primary" 
              size="small" 
              sx={{ my: 1.5, fontWeight: 700 }} 
            />
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Neenga category matrum product CRUD operations seiya authorized aagi irukeenga.
            </Typography>
            <Button 
              variant="outlined" 
              color="error" 
              fullWidth 
              onClick={logoutUser}
              sx={{ py: 1.2 }}
            >
              Logout (வெளியேறு)
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem' }}>
              Default Admin Login: <strong>admin</strong> / <strong>admin123</strong>
            </Alert>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              size="small"
              sx={{ mb: 1.5 }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              sx={{ mb: 2.5 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ py: 1.3, mb: 1, fontSize: '0.95rem' }}
            >
              {loading ? 'Logging in...' : 'Login Pannu (உள்நுழை)'}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
