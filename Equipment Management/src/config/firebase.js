import firebase from "firebase/compat/app";


let firebaseConfig = {
  apiKey: "AIzaSyBGbkr9APCpRjKyR99XkcyILVCsVXv5iyc",
  authDomain: "equipment-management-1726d.firebaseapp.com",
  databaseURL: "https://equipment-management-1726d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "equipment-management-1726d",
  storageBucket: "equipment-management-1726d.appspot.com",
  messagingSenderId: "24480812686",
  appId: "1:24480812686:web:9117747d04497c6a4203df"
};


export let appFB   = firebase.initializeApp(firebaseConfig);
