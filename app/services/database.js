import Service from '@ember/service';
import { service } from '@ember/service';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  arrayUnion,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default class TripService extends Service {
  @service firebase;
  @service auth;

  db = getFirestore(this.firebase.app);
  uid = this.auth.user.uid;
  storage = getStorage();

  getUserRef() {
    return doc(this.db, `user/${this.uid}`);
  }

  get tripsRef() {
    return collection(this.db, `user/${this.uid}/trips`);
  }

  async getTrip(id) {
    return doc(this.db, `user/${this.uid}/trips/${id}`);
  }

  async getTripItem(id) {
    const tripRef = await this.getTrip(id);
    const tripSnap = await getDoc(tripRef);
    return tripSnap.data();
  }

  async getUserTrips() {
    const trips = [];
    const querySnapshot = await getDocs(this.tripsRef);
    querySnapshot.forEach((doc) => {
      trips.push({ id: doc.id, ...doc.data() });
    });

    trips.forEach((trip) => {
      if (!trip.started) {
        this.determineStarted(trip);
      }
      if (!trip.complete) {
        this.determineComplete(trip);
      }
    });

    return trips;
  }

  async determineComplete(trip) {
    const q = query(
      collection(this.db, `user/${this.uid}/trips/${trip.id}/days`),
      orderBy('date', 'desc'),
      limit(1),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (new Date(doc.data().date.seconds * 1000) < new Date()) {
        this.markTripComplete(trip.id);
      }
    });
  }

  async determineStarted(trip) {
    const q = query(
      collection(this.db, `user/${this.uid}/trips/${trip.id}/days`),
      orderBy('date'),
      limit(1),
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (new Date(doc.data().date.seconds * 1000) <= new Date()) {
        this.markTripStarted(trip.id);
      }
    });
  }

  async createTrip() {
    const docRef = await addDoc(this.tripsRef, {
      owner: this.auth.user.uid,
      complete: false,
      setup: false,
      lastEdited: new Date().getTime(),
    });
    return docRef.id;
  }

  async setDestination(tripId, destination) {
    const tripRef = await this.getTrip(tripId);
    await setDoc(tripRef, { destination: destination }, { merge: true });
  }

  async addDays(startDate, endDate, tripId) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let currentDate = new Date(start);

    // Reference to the collection
    const dayRef = collection(this.db, `user/${this.uid}/trips/${tripId}/days`);

    const existingDaysSnapshot = await getDocs(dayRef);
    const existingDays = existingDaysSnapshot.docs.map((doc) => ({
      id: doc.id, // Firestore document ID
      date: new Date(doc.data().date).toISOString(),
    }));

    const newDaysSet = new Set();
    const addPromises = [];

    while (currentDate <= end) {
      const isoDate = currentDate.toISOString();
      newDaysSet.add(isoDate);

      if (!existingDays.some((day) => day.date === isoDate)) {
        addPromises.push(
          addDoc(dayRef, {
            date: isoDate,
          }),
        );
      }
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    const deletePromises = existingDays
      .filter((day) => !newDaysSet.has(day.date))
      .map((day) => deleteDoc(doc(this.db, dayRef.path, day.id)));

    await Promise.all([...addPromises, ...deletePromises]);
  }

  async markTripStarted(tripId) {
    const tripRef = await this.getTrip(tripId);
    await updateDoc(tripRef, { started: true });
  }

  async markTripComplete(tripId) {
    const tripRef = await this.getTrip(tripId);
    await updateDoc(tripRef, { complete: true });
  }

  async getDays(tripId) {
    const daysRef = await collection(
      this.db,
      `user/${this.uid}/trips/${tripId}/days`,
    );
    const querySnapshot = await getDocs(daysRef);
    const dates = [];
    querySnapshot.forEach((doc) => {
      const formatter = new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });

      const date = formatter.format(new Date(doc.data().date));

      dates.push({ id: doc.id, date: date });
    });
    return dates;
  }

  async getTripTitle(tripId) {
    const tripRef = await this.getTrip(tripId);
    const snap = await getDoc(tripRef);
    const tripSnap = snap.data();
    return tripSnap.title;
  }

  async saveTripTitle(tripId, title) {
    const tripRef = await this.getTrip(tripId);

    await setDoc(tripRef, { title: title }, { merge: true });
  }

  async getDay(tripId, day_id) {
    const dayRef = await doc(
      this.db,
      `user/${this.uid}/trips/${tripId}/days/${day_id}`,
    );
    const snap = await getDoc(dayRef);
    return snap.data();
  }

  async deleteTrip(tripId) {
    const tripRef = await this.getTrip(tripId);
    await deleteDoc(tripRef);
  }

  async updateTrip(tripId, updatedFields) {
    const tripRef = await this.getTrip(tripId);
    await updateDoc(tripRef, updatedFields);
  }

  async getActivities(trip_id, date_id) {
    const activitiesRef = await collection(
      this.db,
      `user/${this.uid}/trips/${trip_id}/days/${date_id}/activities`,
    );
    const querySnapshot = await getDocs(activitiesRef);
    const activities = [];
    querySnapshot.forEach((doc) => {
      activities.push({ id: doc.id, data: doc.data() });
    });
    return activities;
  }

  async getActivity(trip_id, date_id, activity_id) {
    const activityDoc = await doc(
      this.db,
      `user/${this.uid}/trips/${trip_id}/days/${date_id}/activities/${activity_id}`,
    );
    const snap = await getDoc(activityDoc);
    return snap.data();
  }

  async saveJournal(trip_id, date_id, activity_id, journalEntry) {
    const activityDoc = await doc(
      this.db,
      `user/${this.uid}/trips/${trip_id}/days/${date_id}/activities/${activity_id}`,
    );
  
    await updateDoc(
      activityDoc,
      { journal: journalEntry},
    );
  }

  async addActivity(tripId, date_id, activity) {
    const activitiesRef = collection(
      this.db,
      `user/${this.uid}/trips/${tripId}/days/${date_id}/activities`,
    );
    await addDoc(activitiesRef, activity);
  }

  async deleteActivity(tripId, date_id, activity_id) {
    await deleteDoc(
      doc(
        this.db,
        `user/${this.uid}/trips/${tripId}/days/${date_id}/activities`,
        activity_id,
      ),
    );
  }

  async editActivity(tripId, dateIndex, activity_id, updatedActivity) {
    const activitiesRef = doc(
      this.db,
      `user/${this.uid}/trips/${tripId}/days/${dateIndex}/activities/${activity_id}`,
    );
    const tripRef = await this.getTrip(tripId);

    await updateDoc(activitiesRef, updatedActivity);
    await setDoc(
      tripRef,
      { lastEdited: new Date().getTime() },
      { merge: true },
    );
  }

  async finishSetup(tripId) {
    const tripRef = await this.getTrip(tripId);
    await updateDoc(tripRef, { setup: true });
  }

  async saveImage(image, tripId, date_id) {
    // saves to storage ref
    const tripsStorageRef = await ref(
      this.storage,
      `user/${this.uid}/trips/${tripId}/days/${date_id}/${image.name}`,
    );
    const dateRef = await doc(
      this.db,
      `user/${this.uid}/trips/${tripId}/days/${date_id}`,
    );
    // Uploads the image to the storage
    uploadBytes(tripsStorageRef, image).then(() => {
      // gets the download url for the image that was just uploaded
      getDownloadURL(tripsStorageRef).then(async (url) => {
        // saves the image data to the db for later retrieval
        const imageData = { id: image.name, url: url };
        await updateDoc(dateRef, {
          images: arrayUnion(imageData),
        }).then(() => {
          console.log('saved image info to db');
        });
      });
    });
  }
}
