import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: 'AIzaSyAd7TuTcwG2CrWIlW1-tcCBdmKZ12zqDCY',
  authDomain: 'general-testing-70f4c.firebaseapp.com',
  databaseURL: 'https://general-testing-70f4c.firebaseio.com',
  projectId: 'general-testing-70f4c',
  storageBucket: 'general-testing-70f4c.appspot.com',
  messagingSenderId: '811145834175',
  appId: '1:811145834175:web:8c8affceeac056fa5fe00a',
  measurementId: 'G-K8XZJB3KB8',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore().collection('favs');

export const getFavsByUser = (uid) => {
  return db
    .doc(uid)
    .get()
    .then((snap) => {
      return snap.data().array;
    });
};

export const updateFavs = (array, uid) => {
  return db.doc(uid).set({ array });
};

export const signOutGoogle = () => {
  firebase.auth().signOut();
};

export const loginWithGoogle = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then((snap) => snap.user);
};
