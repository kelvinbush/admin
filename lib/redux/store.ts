import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './services/apiSlice'
import authReducer from './features/authSlice'
import topBarReducer from './features/top-bar.slice'
import loanProductFormReducer from './features/loan-product-form.slice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    topBar: topBarReducer,
    loanProductForm: loanProductFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
