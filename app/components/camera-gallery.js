import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CameraGallery extends Component {
  @tracked mobile;

  constructor() {
    super(...arguments);
    this.mobile = this.isMobile();
  }
  @action
  handleCameraInput(event) {
    const file = event.target.files[0];
    if (file) {
      this.displayImage(file);
    }
  }

  @action
  handleGalleryInput(event) {
    const file = event.target.files;
    for (let key in file) {

      if (file[key]) {
        this.displayImage(file[key]);
      }
    }

  }

  displayImage(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageElement = document.createElement('img');
      imageElement.src = e.target.result;
      imageElement.style.maxWidth = '100%';
      imageElement.style.height = 'auto';
      // if this is 2nd + time the code is ran
      if (document.getElementById('image-preview-container'))
      {
        const container= document.getElementById('image-preview-container');
        container.appendChild(imageElement);
      }
      // if the this is the first time the code is ran change and set the id.
      else{
        const container = document.getElementById('image-preview-container');
        container.setAttribute("id", this.args.data);
        container.appendChild(imageElement);
      }

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
}
