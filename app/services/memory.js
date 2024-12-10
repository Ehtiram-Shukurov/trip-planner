import Service, {service} from "@ember/service";

export default class Memory extends Service {
  @service database;
  images = [];
  journalEntry;

  setImages(files) {
    this.images = files;
  }

  save(tripId, date) {
    // save images
    this.images.forEach(async (image) => {
      await this.database.saveImage(image, tripId, date);
    })
    // save journal entry
    //this.database.saveJournalEntry(this.journalEntry, tripId, date);

    // reset images and journal entry
    this.images = [];
    this.journalEntry = '';
  }
}

