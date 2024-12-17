import Service, { service } from '@ember/service';

export default class Memory extends Service {
  @service database;
  images = [];
  journalEntry;

  setImages(files) {
    this.images = files;
  }

  async save(trip_id, date_id) {
    // save images
    try{
      await Promise.all(this.images.map(async (image) => {
        await this.database.saveImage(image, trip_id, date_id);
      }));
      this.images = [];
      this.journalEntry = '';
    }
    catch (error){
      console.error('Error saving images', error);
    }

  }
}
