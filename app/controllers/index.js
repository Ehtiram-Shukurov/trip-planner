import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { getOwner } from '@ember/application';

import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  signOut,
  onAuthStateChanged,
  authStateReady,
} from 'firebase/auth';
export default class IndexController extends Controller {
  @service firebase;
  @service auth;
}
