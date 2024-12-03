import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action, computed } from '@ember/object';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { tracked } from '@glimmer/tracking';
import { onSnapshot, query, where } from 'firebase/firestore';

export default class TestController extends Controller {}
