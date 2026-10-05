import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import CategoriesPage from './CategoriesPage';
import CategoryProductsPage from './CategoryProductsPage';
import BillCheckoutModal from './BillCheckoutModal';

import { Box } from '@mui/material';

export default function BillingView() {
  const { selectedCategory, setSelectedCategory } = useShop();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <Box>
      {/* 1. First Page: ONLY Categories List (No products here) */}
      {!selectedCategory ? (
        <CategoriesPage
          onSelectCategory={(catId) => setSelectedCategory(catId)}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />
      ) : (
        /* 2. Category Products Page: All products under selected category */
        <CategoryProductsPage
          categoryId={selectedCategory}
          onBackToCategories={() => setSelectedCategory(null)}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
        />
      )}

      {/* 3. Checkout & Payment Modal */}
      {isCheckoutOpen && (
        <BillCheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </Box>
  );
}
