import Service from '@ember/service';
import { service } from '@ember/service';
import { action } from '@ember/object';
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { tracked } from '@glimmer/tracking';

export default class AuthService extends Service {
  @service firebase;
  @service router;

  auth = getAuth(this.firebase.app);
  @tracked user = null;

  constructor() {
    super(...arguments);
    this.initializeAuthState();
  }
  initializeAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
      if (user) {
        console.log('User signed in:', user.email);
      } else {
        console.log('No user signed in.');
      }
    });
  }

  async ensureInitialized() {
    if (this.auth.currentUser === null) {
      return new Promise((resolve) =>
        onAuthStateChanged(this.auth, () => resolve()),
      );
    }
  }

  async ensureLoggedIn() {
    await this.ensureInitialized();
    if (!this.user) {
      this.router.transitionTo('login');
    }
  }

  @action
  async sign_in_with_popup() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      const result = await signInWithPopup(this.auth, provider);

      console.log('User signed in:', result.user);
      return result;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  }

  @action
  async sign_out() {
    try {
      await signOut(this.auth);
      this.user = null;
      this.router.transitionTo('index');
      console.log('User signed out.');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  }
}
