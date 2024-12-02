import Modifier from 'ember-modifier';
import { service } from '@ember/service';

export default class OnAuthChangeModifier extends Modifier {
  @service auth;

  modify(element, [handler]) {
    handler(this.auth.user);
  }
}
