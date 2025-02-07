import { createSlice, nanoid } from "@reduxjs/toolkit";
const initialState = {
  ads: [],
};
const rentSlice = createSlice({
  name: "rent",
  initialState,
  reducers: {
    addAds: (state, action) => {
      const newAd = {
        id: nanoid(),
        title: action.payload.title,
        description: action.payload.description,
        price: action.payload.price,
        location: action.payload.location,
        image: action.payload.image,
      };
      state.ads.push(newAd);
    },
  },
  deleteAds: (state, action) => {
    state.ads = state.ads.filter((ad) => ad.id !== action.payload.id);
  },
});
export default rentSlice.reducer; 
export const { addAds, deleteAds } = rentSlice.actions;
