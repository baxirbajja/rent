import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ads: JSON.parse(localStorage.getItem('ads')) || [],
  loading: false,
  error: null
};

const rentSlice = createSlice({
  name: 'rent',
  initialState,
  reducers: {
    setAds: (state, action) => {
      state.ads = action.payload;
      localStorage.setItem('ads', JSON.stringify(action.payload));
    },
    addAds: (state, action) => {
      const newAd = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      state.ads.push(newAd);
      localStorage.setItem('ads', JSON.stringify(state.ads));
    },
    removeAds: (state, action) => {
      state.ads = state.ads.filter(ad => ad.id !== action.payload);
      localStorage.setItem('ads', JSON.stringify(state.ads));
    },
    updateAd: (state, action) => {
      const index = state.ads.findIndex(ad => ad.id === action.payload.id);
      if (index !== -1) {
        state.ads[index] = {
          ...state.ads[index],
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('ads', JSON.stringify(state.ads));
      }
    }
  }
});

export const { setAds, addAds, removeAds, updateAd } = rentSlice.actions;

export default rentSlice.reducer;
