import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CameraGallery extends Component {

  @action
  handleCameraInput(event) {
    const file = event.target.files[0];
    if (file) {
      this.displayImage(file);
    }
  }

  @action
  handleGalleryInput(event) {
    const file = event.target.files[0];
    if (file) {
      this.displayImage(file);
    }
  }

  displayImage(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageElement = document.createElement('img');
      imageElement.src = e.target.result;
      imageElement.style.maxWidth = '100%';
      imageElement.style.height = 'auto';

      const container = document.getElementById('image-preview-container');
      container.innerHTML = '';
      container.appendChild(imageElement);
    };

    reader.readAsDataURL(file);
  }
  
}
