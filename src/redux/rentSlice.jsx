// hna kanjibo toolkit bach nkhdmo b redux
import {createSlice} from '@reduxjs/toolkit'
import { nanoid } from '@reduxjs/toolkit'

// hada state initial li ghadi nbdaw bih
const initialState = {ads:[]};

// hna fin kandefiniw slice dial les annonces
const rentSlice = createSlice({
    name: 'rent',
    initialState,
    reducers: {
        // fonction bach nzido annonce jdida
        addAds:(state,action) =>{
            const newAd= {
                id: nanoid(),  // kan generiw id unique
                title: action.payload.title,
                description: action.payload.description,
                price: action.payload.price,
                location: action.payload.location,
                image: action.payload.image
            }
            // kanzido l3lan l tableau
            state.ads.push(newAd)
        },
        // fonction bach n7eydo chi l3lan
        removeAds:(state,action) =>{
            state.ads = state.ads.filter(ad => ad.id !== action.payload)
        }
    }
})

// kansifto reducer o actions l barra
export default rentSlice.reducer    
export const {addAds,removeAds} = rentSlice.actions