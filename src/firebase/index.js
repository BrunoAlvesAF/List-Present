import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBzvLDreURIh0ESbpnnPxoWc43hoxdtYC0",
  authDomain: "present-list-b75c4.firebaseapp.com",
  projectId: "present-list-b75c4",
  storageBucket: "present-list-b75c4.appspot.com",
  messagingSenderId: "201158280804",
  appId: "1:201158280804:web:6e9475432a8499f2a08171",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
