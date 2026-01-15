import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IProductData } from "../../types/product_types";

interface ProductState {
  products: IProductData[];
}

const initialState: ProductState = {
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<IProductData[]>) {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
