
import { createSelector } from 'reselect';
import { ProductVariantType, ReduxStateType } from '@/constants/types';

const getVariants = (state: ReduxStateType) => state.currentProductData.variants;
const getSelectedColor = (state: ReduxStateType) => state.currentProductData.selectedColor;
const getSelectedVariantId = (state: ReduxStateType) => state.currentProductData.selectedVariantId;

const getDefaultPrice = (state: ReduxStateType) => {
  const { minPrice, maxPrice } = state.currentProductData;
  if(maxPrice > minPrice) {
    return `${minPrice} - ${maxPrice}`
  }
  return minPrice;
};

export const getSizeOptions = createSelector(
  [getVariants, getSelectedColor],
  (variants, selectedColor) => {
    return selectedColor 
      ? variants
          .filter(({ color }: ProductVariantType) => color === selectedColor)
          .map(({ id, size, quantity, price }: ProductVariantType) => ({ id, size, quantity, price }))
      : variants
          .map(({ id, size, quantity, price }: ProductVariantType) => ({ id, size, quantity, price }));
  }
);

export const getPrice = createSelector(
  [getVariants, getSelectedVariantId, getDefaultPrice],
  (variants, selectedVariantId, defaultPrice) => {
    if (!selectedVariantId) {
      return defaultPrice;
    }
    return Math.round(parseFloat(variants.find(({ id }: ProductVariantType) => id === selectedVariantId)!.price));
  }
);
