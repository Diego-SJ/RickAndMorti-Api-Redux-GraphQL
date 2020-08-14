// import axios from 'axios';
import { updateFavs, getFavsByUser } from '../Firebase';
import ApolloClient, { gql } from 'apollo-boost';

// * constants
const initialData = {
  fetching: false,
  array: [],
  current: {},
  favorites: [],
  nextPage: 33,
};
// const URL = 'https://rickandmortyapi.com/api/character';
const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
});
const GET_CHARACTERS = 'GET_CHARACTERS';
const GET_CHARACTERS_SUCCESS = 'GET_CHARACTERS_SUCCESS';
const GET_CHARACTERS_ERROR = 'GET_CHARACTERS_ERROR';

const REMOVE_CHARACTER = 'REMOVE_CHARACTER';

const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
const GET_FAVS = 'GET_FAVS';
const GET_FAVS_SUCCESS = 'GET_FAVS_SUCCESS';
const GET_FAVS_ERROR = 'GET_FAVS_ERROR';

const UPDATE_PAGE = 'UPDATE_PAGE';

// * reducers
export default function reducer(state = initialData, action) {
  switch (action.type) {
    case UPDATE_PAGE:
      return { ...state, nextPage: action.payload };
    case GET_FAVS:
      return { ...state, fetching: true };
    case GET_FAVS_ERROR:
      return { ...state, fetching: false, error: action.payload };
    case GET_FAVS_SUCCESS:
      return { ...state, fetching: false, favorites: action.payload };
    case ADD_TO_FAVORITES:
      return { ...state, ...action.payload };
    case GET_CHARACTERS:
      return { ...state, fetching: true };
    case GET_CHARACTERS_SUCCESS:
      return { ...state, array: action.payload, fetching: false };
    case GET_CHARACTERS_ERROR:
      return { ...state, fetching: false, error: action.payload };
    case REMOVE_CHARACTER:
      return { ...state, array: action.payload };
    default:
      return state;
  }
}

// aux
const saveFavsStorage = (favs) => {
  localStorage.storage = JSON.stringify(favs);
};

// * actions o thunk
export const restoreFavsAction = () => (dispatch) => {
  let storage = localStorage.getItem('storage');
  storage = JSON.parse(storage);
  if (storage) {
    const { characters } = storage;
    if (characters.favorites) {
      dispatch({
        type: GET_FAVS_SUCCESS,
        payload: [...characters.favorites],
      });
    }
  }
};

export const retreiveFavoritesActions = () => (dispatch, getState) => {
  dispatch({
    type: GET_FAVS,
  });
  const { uid } = getState().user;
  return getFavsByUser(uid)
    .then((array) => {
      dispatch({
        type: GET_FAVS_SUCCESS,
        payload: [...array],
      });
      saveFavsStorage(getState());
    })
    .catch((error) => {
      dispatch({
        type: GET_FAVS_ERROR,
        payload: error.message,
      });
    });
};

export const addToFavoritesAction = () => (dispatch, getState) => {
  const { array, favorites } = getState().characters;
  const { uid } = getState().user;
  const char = array.shift();
  favorites.push(char);
  updateFavs(favorites, uid);
  dispatch({
    type: ADD_TO_FAVORITES,
    payload: { array: [...array], favorites: [...favorites] },
  });
};

export const removeCharacterAction = () => (dispatch, getState) => {
  const { array } = getState().characters;
  array.shift();
  if (!array.length) {
    getCharactersAction()(dispatch, getState);
    return;
  }
  dispatch({
    type: REMOVE_CHARACTER,
    payload: [...array],
  });
};

export const getCharactersAction = () => async (dispatch, getState) => {
  const query = gql`
    query($pages: Int) {
      characters(page: $pages) {
        info {
          pages
          next
          prev
        }
        results {
          name
          image
        }
      }
    }
  `;

  dispatch({
    type: GET_CHARACTERS,
  });

  const { nextPage } = getState().characters;

  return client
    .query({
      query,
      variables: {
        pages: nextPage,
      },
    })
    .then(({ data, error }) => {
      if (error) {
        dispatch({
          type: GET_CHARACTERS_ERROR,
          payload: error,
        });
        return;
      }
      dispatch({
        type: GET_CHARACTERS_SUCCESS,
        payload: data.characters.results,
      });
      dispatch({
        type: UPDATE_PAGE,
        payload: data.characters.info.next ? data.characters.info.next : 1,
      });
    });

  // return axios
  //   .get(URL)
  //   .then((res) => {
  //     dispatch({
  //       type: GET_CHARACTERS_SUCCESS,
  //       payload: res.data.results,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     dispatch({
  //       type: GET_CHARACTERS_ERROR,
  //       payload: err.response.message,
  //     });
  //   });
};
