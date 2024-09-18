import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import { getDatabase } from "@react-native-firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDv2AK0I_FoHJgP0c80ejqycVPwcmCY-BM",
  authDomain: "cyberpathshala-21293.firebaseapp.com",
  databaseURL: "https://cyberpathshala-21293-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cyberpathshala-21293",
  storageBucket: "cyberpathshala-21293.appspot.com",
  messagingSenderId: "231618173133",
  appId: "1:231618173133:web:d28344ced593c0733ff184"
};

export const firebase = initializeApp(firebaseConfig);
// export const auth = getAuth(firebase);
export const firestore = getFirestore(firebase);
export {  database };
export const auth = initializeAuth(firebase, {
  persistence: getReactNativePersistence(AsyncStorage)
});
// export const database = getDatabase()
// adminjaishglobal