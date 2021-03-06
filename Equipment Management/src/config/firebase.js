import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; 
import 'firebase/compat/analytics';
import 'firebase/compat/performance';
//import 'firebase/compat/database';

let firebaseConfig = {
  apiKey: "AIzaSyBGbkr9APCpRjKyR99XkcyILVCsVXv5iyc",
  authDomain: "equipment-management-1726d.firebaseapp.com",
  databaseURL: "https://equipment-management-1726d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "equipment-management-1726d",
  storageBucket: "equipment-management-1726d.appspot.com",
  messagingSenderId: "24480812686",
  appId: "1:24480812686:web:9117747d04497c6a4203df"
};

export const appFB        = firebase.initializeApp(firebaseConfig);
export const storeFB      = firebase.firestore();
export const storageRef   = firebase.storage().ref();
export const performance  = firebase.performance();
export const analytics    = firebase.analytics();
//export const dbFB = firebase.database();
