import Service from '@ember/service';
import { service } from '@ember/service';
import { getFirestore, collection, doc, addDoc } from 'firebase/firestore';

export default class TodoService extends Service {
  @service firebase;
  @service auth;

  db = getFirestore(this.firebase.app);
  tripsRef = collection(this.db, 'trips');

  getTrip(id) {
    return doc(this.db, 'trips', id);
  }

  createTrip() {
    addDoc(this.tripsRef, {
      owner: this.auth.user.uid,
      complete: false,
    });
  }
}
