import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class IndexController extends Controller {
  @service auth;
  @service router;

  @action
  signIn() {
    this.auth
      .sign_in_with_popup()
      .then(() => this.router.transitionTo('home'))
      .catch((error) => console.log('error logging in' + error));
  }
}
