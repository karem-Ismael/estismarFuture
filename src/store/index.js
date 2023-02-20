import { createStore, applyMiddleware, compose } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import { routerMiddleware } from "connected-react-router";
import createSagaMiddleware from "redux-saga";
import history from "Util/history";
import storage from "redux-persist/lib/storage/session"; // defaults to localStorage for web
import reducers from "../reducers";
import rootSaga from "../sagas";

const saga = createSagaMiddleware();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authUser", "settings"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const initialState = {};
let composeEnhancers = compose;

if (process.env.NODE_ENV !== "production" && typeof window === "object") {
  if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({});
}

const middlewares = [saga, routerMiddleware(history)];

const enhancer = composeEnhancers(applyMiddleware(...middlewares));
const store = createStore(persistedReducer, initialState, enhancer);
const persistor = persistStore(store);

saga.run(rootSaga);

export default store;
export { store, persistor };
