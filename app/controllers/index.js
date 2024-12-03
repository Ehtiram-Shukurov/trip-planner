import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { onSnapshot, query, where } from 'firebase/firestore';

export default class IndexController extends Controller {
  @service firebase;
  @service auth;
  @service database;
  @service router;
  @action
  signIn() {
    this.auth
      .sign_in_with_popup()
      .then(() => this.router.transitionTo('home'))
      .catch((error) => console.log('error logging in' + error));
  }
}
