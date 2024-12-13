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

    return trips;
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

    while (currentDate <= end) {
      const dayRef = collection(this.db, `user/${this.uid}/trips/${tripId}/days`);
      await addDoc(dayRef, {
        date: currentDate.toISOString(),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  async getDays(tripId) {
    const daysRef = await collection(
      this.db,
      `user/${this.uid}/trips/${tripId}/days`,
    );
    const querySnapshot = await getDocs(daysRef);
    const dates = []
    querySnapshot.forEach((doc) => {
      dates.push({ id: doc.id, data: doc.data() });
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
    // day.date = new Date(day.date).toLocaleDateString('en-US');
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

  async getActivities(trip_id, date_id){
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

  async addActivity(tripId, date_id, activity) {
    const activitiesRef = collection(
      this.db,
      `user/${this.uid}/trips/${tripId}/days/${date_id}/activities`,
    );
    await addDoc(activitiesRef, activity);
  }

  async deleteActivity(tripId, date_id, activity_id) {
    await deleteDoc(
      doc(this.db, `user/${this.uid}/trips/${tripId}/days/${date_id}/activities`, activity_id),
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
        console.log(dateRef);
        await updateDoc(dateRef, {
          images: arrayUnion(imageData),
        }).then(() => {
          console.log('saved image info to db');
        });
      });
    });
  }
}
