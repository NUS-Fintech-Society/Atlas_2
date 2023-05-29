// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAOUlACTtNKliBsPnGsWnCu0I_76eXDQ-U',
  authDomain: 'fintech-society.firebaseapp.com',
  projectId: 'fintech-society',
  storageBucket: 'fintech-society.appspot.com',
  messagingSenderId: '181597094279',
  appId: '1:181597094279:web:f5dd7ebab8e9750337d322',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
