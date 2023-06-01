import firebase from "firebase";
import '@firebase/storage';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD7qa1mpqRDpHwKbLUv4pNGmkoJzCxbSMc",
    authDomain: "antoan-data.firebaseapp.com",
    projectId: "antoan-data",
    storageBucket: "antoan-data.appspot.com",
    messagingSenderId: "206272901359",
    appId: "1:206272901359:web:955af0fb8fcbfc95abeb1a"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const db = firebase.firestore();


export { storage, db, firebase as default };