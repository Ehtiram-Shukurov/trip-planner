import Service from '@ember/service';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAz9oh7invUxuh8G6Ua2swxClDqhI6Rbjw',
  authDomain: 'big-chungus-project2.firebaseapp.com',
  projectId: 'big-chungus-project2',
  storageBucket: 'big-chungus-project2.firebasestorage.app',
  messagingSenderId: '580741361506',
  appId: '1:580741361506:web:0a8d89ddbf9205a558863b',
};

export default class FirebaseService extends Service {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(this.app);
  firestore = getFirestore();
}
