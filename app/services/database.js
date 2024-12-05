import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
} from 'firebase/firestore';

export default class TripService extends Service {
  @service firebase;
  @service auth;

  db = getFirestore(this.firebase.app);
  uid = this.auth.user.uid;

  getUserRef() {
    return doc(this.db, `user/${this.uid}`);
  }

  get tripsRef() {
    return collection(this.db, `user/${this.uid}/trips`);
  }

  async getTrip(id) {
    return doc(this.db, `user/${this.uid}/trips/${id}`);
  }

  async getUserTrips() {
    const trips = [];
    const querySnapshot = await getDocs(this.tripsRef);
    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });

    return trips;
  }

  async createTrip() {
    const docRef = await addDoc(this.tripsRef, {
      owner: this.auth.user.uid,
      complete: false,
    });

    return docRef.id;
  }

  async setDestination(tripId, destination) {
    const tripRef = await this.getTrip(tripId);
    await setDoc(tripRef, { destination: destination }, { merge: true });
  }

  async addDays(startDate, endDate, tripId) {
    const tripRef = await this.getTrip(tripId);
    const start = new Date(startDate);
    const end = new Date(endDate);

    const days = {};
    let currentDate = new Date(start);
    let dayCounter = 1;

    while (currentDate <= end) {
      const key = `day${dayCounter}`;
      days[key] = {
        date: currentDate.toISOString(),
        activities: [],
      };

      currentDate.setDate(currentDate.getDate() + 1);
      dayCounter++;
    }

    await updateDoc(tripRef, { days: days });
  }

  async getDays(tripId) {
    const tripRef = await this.getTrip(tripId);
    const snap = await getDoc(tripRef);
    const tripSnap = snap.data();

    //transfer days to MM/DD/YYYY format and sort
    const days = Object.keys(tripSnap.days)
      .map((key) => {
        const day = tripSnap.days[key];
        return {
          date: new Date(day.date),
        };
      })
      .sort((a, b) => a.date - b.date)
      .map((day) => {
        return {
          date: day.date.toLocaleDateString('en-US'),
        };
      });

    return days;
  }

  async getDay(tripId, index) {
    const tripRef = await this.getTrip(tripId);
    const snap = await getDoc(tripRef);
    const tripSnap = snap.data();

    const key = `day${index}`;
    const day = tripSnap.days[key];

    day.date = new Date(day.date).toLocaleDateString('en-US');
    return day;
  }

  async addActivity(tripId, dateIndex, activity) {
    const tripRef = await this.getTrip(tripId);
    const snap = await getDoc(tripRef);
    const tripSnap = snap.data();

    const key = `day${dateIndex}`;
    const day = tripSnap.days[key];
    day.activities.push(activity);

    await setDoc(tripRef, { days: tripSnap.days }, { merge: true });
  }
}
