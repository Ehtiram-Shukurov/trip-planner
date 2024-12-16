import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { onSnapshot, query, where, orderBy } from 'firebase/firestore';

export default class HomeController extends Controller {
  @service firebase;
  @service auth;
  @service router;
  @service database;

  @tracked trips = [];

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
        orderBy('lastEdited', 'desc'),
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

  @action
  async continueSetup(tripId) {
    const trip = await this.database.getTripItem(tripId);
    if (!trip.destination) {
      this.router.transitionTo('destination', tripId);
    } else if (trip.days.length === 0) {
      this.router.transitionTo('date-picker', tripId);
    } else {
      this.router.transitionTo('date', tripId);
    }

  }

  @action
  async deleteMemory(memoryId) {
    if (confirm('Are you sure you want to delete this memory?')) {
      await this.database.deleteTrip(memoryId);
      this.router.refresh();
    }
  }
}
