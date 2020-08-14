import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import userReducer, { restoreSessionAction } from './userDuck';
import charactersReducer, { getCharactersAction, restoreFavsAction } from './charsDuck';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  user: userReducer,
  characters: charactersReducer,
});

const composeEnhacers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
  const store = createStore(
    rootReducer,
    composeEnhacers(applyMiddleware(thunk)),
  );
  getCharactersAction()(store.dispatch, store.getState);
  restoreSessionAction()(store.dispatch);
  restoreFavsAction()(store.dispatch);
  return store;
}
