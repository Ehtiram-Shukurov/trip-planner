import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import {onSnapshot, query, where} from "firebase/firestore";

export default class IndexController extends Controller {
  @service firebase;
  @service auth;
  @service database;

  @action
  refreshHomeListener(user) {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    if (user) {
      const q = query(
        this.database.tripsRef,
        where('owner', '==', this.auth.user.uid),
      );

      this.unsubscribe = onSnapshot(q, (querySnapshot) => {
        // for lists, each "change" has a bunch of data elements in it.
        // loop over them and pull the data out.
        this.trips = [];
        querySnapshot.forEach((doc) => {
          const trip  = {"id": doc.id, data: doc.data()};
          this.trips.push(trip);
        });
      });
    }
  }
}
