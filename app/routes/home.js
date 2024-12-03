import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeRoute extends Route {
  @service auth;
  beforeModel(_transition) {
    this.auth.ensureLoggedIn();
  }
}
