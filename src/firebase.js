// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAJrqEGozUlbKIaDCUsAKmrLsuqEqlZXeo",
    authDomain: "instagram-clone-44b97.firebaseapp.com",
    databaseURL: "https://instagram-clone-44b97.firebaseio.com",
    projectId: "instagram-clone-44b97",
    storageBucket: "instagram-clone-44b97.appspot.com",
    messagingSenderId: "1065916519664",
    appId: "1:1065916519664:web:418b792df062a83455de35",
    measurementId: "G-PGKTYS04YD"
  });

  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const storage=firebase.storage();

export {db,auth,storage};
