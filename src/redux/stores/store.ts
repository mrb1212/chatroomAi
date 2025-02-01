// import { createStore, applyMiddleware } from "redux";
// import { HYDRATE, createWrapper } from "next-redux-wrapper";
// import thunkMiddleware from "redux-thunk";
// import reducers from "./index";

// const bindMiddleware = (middleware) => {
//   if (process.env.NODE_ENV !== "production") {
//     const { composeWithDevTools } = require("redux-devtools-extension");
//     return composeWithDevTools(applyMiddleware(...middleware));
//   }
//   return applyMiddleware(...middleware);
// };

// const reducer = (state, action) => {
//   if (action.type === HYDRATE) {
//     const nextState = {
//       ...state,
//       ...action.payload,
//     };
//     return nextState;
//   } else {
//     return reducers(state, action);
//   }
// };
// const initStore = () => {
//   return createStore(reducer, bindMiddleware([thunkMiddleware]));
// };

// export const wrapper = createWrapper(initStore);

// export default function StoreHOLO() {}

import { configureStore } from '@reduxjs/toolkit'
import reducers from "./index";



const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV !== 'production',
})
export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch