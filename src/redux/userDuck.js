import { loginWithGoogle, signOutGoogle } from '../Firebase';
import { retreiveFavoritesActions } from './charsDuck';

// constants
const initialData = {
  loggedIn: false,
  fetching: false,
};
const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_ERROR = 'LOGIN_ERROR';

const LOG_OUT = 'LOG_OUT';

// reducer
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case LOG_OUT:
      return { ...initialData };
    case LOGIN:
      return { ...state, fetching: true };
    case LOGIN_SUCCESS:
      return { ...state, ...action.payload, fetching: false, loggedIn: true };
    case LOGIN_ERROR:
      return { ...state, error: action.payload, fetching: false };
    default:
      return state;
  }
}

// aux
const saveStorage = (storage) => {
  localStorage.storage = JSON.stringify(storage);
};

//actions
export const logOutAction = () => (dispatch, getState) => {
  signOutGoogle();
  dispatch({
    type: LOG_OUT,
  });
  localStorage.removeItem('storage');
};

export const restoreSessionAction = () => (dispatch) => {
  let storage = localStorage.getItem('storage');
  storage = JSON.parse(storage);
  if (storage && storage.user) {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: storage.user,
    });
  }
};

export const doGoogleLoginAction = () => (dispatch, getState) => {
  dispatch({
    type: LOGIN,
  });
  return loginWithGoogle()
    .then((user) => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        },
      });
      saveStorage(getState());
      retreiveFavoritesActions()(dispatch, getState);
    })
    .catch((err) => {
      dispatch({
        type: LOGIN_ERROR,
        payload: err.message,
      });
    });
};
