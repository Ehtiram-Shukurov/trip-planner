import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class CameraGallery extends Component {
  @tracked mobile;
  @service memory;
  @tracked src;
  @tracked images = [];

  constructor() {
    super(...arguments);
    this.mobile = this.isMobile();
  }
  
  @action
  handleCameraInput(event) {
    this.images = [];
    let files = Array.from(event.target.files);
    this.memory.setImages(files);
    files.forEach((file) => {
      if (file) {
        this.displayImage(file);
      }
    });
  }

  @action
  handleGalleryInput(event) {
    this.images = [];
    let files = Array.from(event.target.files);
    this.memory.setImages(files);
    files.forEach((file) => {
      if (file) {
        this.displayImage(file);
      }
    });
  }

  displayImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.src = e.target.result;
      this.images = [
        ...this.images,
        {
          src: e.target.result,
        },
      ];
    };

    reader.readAsDataURL(file);
  }
  // Does not work with Ipad Air, Ipad Pro, Surface Pro 7, Asus Zenbook Fold
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

  @action 
  clearImages() {
    this.images = [];
  }
}
