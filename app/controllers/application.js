import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @service firebase;
  @service auth;
  @tracked mobile;
  @tracked isActive = false;

  constructor() {
    super(...arguments);
    this.mobile = this.isMobile();
  }

  @action
  burgerMenue() {
    if (this.isActive) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }
  }

  isMobile() {
    // code below from https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      )
    ) {
      return true;
    } else {
      return false;
    }
  }
}
