import { createSlice } from '@reduxjs/toolkit';

// Helper function to safely parse localStorage data
const getInitialAds = () => {
  try {
    const savedAds = localStorage.getItem('ads');
    return savedAds ? JSON.parse(savedAds) : [];
  } catch (error) {
    console.error('Error loading initial ads:', error);
    localStorage.removeItem('ads'); // Clear invalid data
    return [];
  }
};

// Helper function to safely save to localStorage
const saveToLocalStorage = (ads) => {
  try {
    localStorage.setItem('ads', JSON.stringify(ads));
  } catch (error) {
    console.error('Error saving ads:', error);
  }
};

const initialState = {
  ads: getInitialAds(),
  loading: false,
  error: null
};

const rentSlice = createSlice({
  name: 'rent',
  initialState,
  reducers: {
    setAds: (state, action) => {
      state.ads = action.payload;
      saveToLocalStorage(action.payload);
    },
    addAds: (state, action) => {
      const newAd = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      state.ads.push(newAd);
      saveToLocalStorage(state.ads);
    },
    removeAds: (state, action) => {
      state.ads = state.ads.filter(ad => ad.id !== action.payload);
      saveToLocalStorage(state.ads);
    },
    updateAd: (state, action) => {
      const index = state.ads.findIndex(ad => ad.id === action.payload.id);
      if (index !== -1) {
        state.ads[index] = {
          ...state.ads[index],
          ...action.payload,
          updatedAt: new Date().toISOString()
        };
        saveToLocalStorage(state.ads);
      }
    },
    clearAds: (state) => {
      state.ads = [];
      localStorage.removeItem('ads');
    }
  }
});

export const { setAds, addAds, removeAds, updateAd, clearAds } = rentSlice.actions;

export default rentSlice.reducer;
