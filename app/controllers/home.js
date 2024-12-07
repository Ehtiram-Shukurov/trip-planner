import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { onSnapshot, query, where } from 'firebase/firestore';

export default class HomeController extends Controller {
  @service firebase;
  @service auth;
  @service router;
  @service database;

  trips = [];

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
        this.trips = [];
        querySnapshot.forEach((doc) => {
          const trip = { id: doc.id, data: doc.data() };
          this.trips.push(trip);
        });
      });
    }
  }

  @action
  async createTrip() {
    const tripId = await this.database.createTrip();
    this.router.transitionTo('destination', tripId);
  }

  @action
  async deleteTrip(tripId) {
    if (confirm('Are you sure you want to delete this trip?')) {
      await this.database.deleteTrip(tripId);
      this.router.refresh();
    }
  }
}
