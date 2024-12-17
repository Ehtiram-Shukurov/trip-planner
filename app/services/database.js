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
import { setup } from 'qunit-dom';

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

    const days = await this.getDays(id);
    const trip = { id: tripSnap.id, ...tripSnap.data(), days: days };

    return trip;
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
      if (new Date(doc.data().date) < new Date()) {
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
      if (new Date(doc.data().date) <= new Date()) {
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

  async getTripDestination(tripId) {
    const tripRef = await this.getTrip(tripId);
    const snap = await getDoc(tripRef);
    return snap.data().destination;
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
    const deleteDays = existingDays.filter((day) => !newDaysSet.has(day.date));

    const deletePromises = deleteDays.map(async (day) => {
      const activitiesRef = collection(
        this.db,
        `user/${this.uid}/trips/${tripId}/days/${day.id}/activities`
      );
      const activitiesSnapshot = await getDocs(activitiesRef);

      const activityDeletePromises = activitiesSnapshot.docs.map((activityDoc) =>
        deleteDoc(activityDoc.ref)
      );

      await Promise.all(activityDeletePromises);
      return deleteDoc(doc(this.db, dayRef.path, day.id));
    });

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
      //activiies is the collection udnreneath the days
      const isEmpty = doc.data().activities === undefined;
      dates.push({ id: doc.id, date: date, empty: isEmpty, images: doc.data().images });
    });

    return dates;
  }

  async getTripTitle(tripId) {
    const tripRef = await this.getTrip(tripId);
    const snap = await getDoc(tripRef);
    const tripSnap = snap.data();
    return {title: tripSnap.title, setup: tripSnap.setup};
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

    const daysRef = collection(this.db, `user/${this.uid}/trips/${tripId}/days`);
    const daysSnapshot = await getDocs(daysRef);

    const deleteDaysPromises = daysSnapshot.docs.map(async (dayDoc) => {
      const dayId = dayDoc.id;

      const activitiesRef = collection(this.db, `user/${this.uid}/trips/${tripId}/days/${dayId}/activities`);
      const activitiesSnapshot = await getDocs(activitiesRef);
      const deleteActivitiesPromises = activitiesSnapshot.docs.map((activityDoc) =>
        deleteDoc(activityDoc.ref)
      );
      await Promise.all(deleteActivitiesPromises);
      return deleteDoc(dayDoc.ref);
    });
    await Promise.all(deleteDaysPromises);
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

  async saveJournal(trip_id, date_id, journalEntry) {
    const dayDoc = await doc(
      this.db,
      `user/${this.uid}/trips/${trip_id}/days/${date_id}`,
    );

    await updateDoc(dayDoc, { journal: journalEntry });
  }

  async getJournal(trip_id, date_id) {
    const dayDoc = await doc(
      this.db,
      `user/${this.uid}/trips/${trip_id}/days/${date_id}`,
    );
    const snap = await getDoc(dayDoc);
    return snap.data().journal;
  }

  async addActivity(tripId, date_id, activity) {
  const daysRef = collection(this.db, `user/${this.uid}/trips/${tripId}/days`);
  const daySnapshot = await getDocs(daysRef);
  const validDates = daySnapshot.docs.map((doc) => doc.id);

  if (!validDates.includes(date_id)) {
    throw new Error(`Invalid date_id: ${date_id} is not part of the trip.`);
  }
    const activitiesRef = collection(
      this.db,
      `user/${this.uid}/trips/${tripId}/days/${date_id}/activities`
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

  async editActivity(tripId, date_id, activity_id, updatedActivity) {
    const daysRef = collection(this.db, `user/${this.uid}/trips/${tripId}/days`);
    const daySnapshot = await getDocs(daysRef);
    const validDates = daySnapshot.docs.map((doc) => doc.id);

    if (!validDates.includes(date_id)) {
      throw new Error(`Invalid date_id: ${date_id} is not part of the trip.`);
    }

    const activitiesRef = doc(
      this.db,
      `user/${this.uid}/trips/${tripId}/days/${date_id}/activities/${activity_id}`
    );
    await updateDoc(activitiesRef, updatedActivity);
  }

  async finishSetup(tripId) {
    const tripRef = await this.getTrip(tripId);
    await updateDoc(tripRef, { setup: true });
  }

  async getImages(trip_id, date_id) {
    const dateRef = await doc(
      this.db,
      `user/${this.uid}/trips/${trip_id}/days/${date_id}`,
    );
    const dateSnap = await getDoc(dateRef);
    return dateSnap.data();
  }

  async saveImage(image, tripId, date_id) {
    try{
      const tripsStorageRef = await ref(
        this.storage,
        `user/${this.uid}/trips/${tripId}/days/${date_id}/${image.name}`,
      );
      const dateRef = await doc(
        this.db,
        `user/${this.uid}/trips/${tripId}/days/${date_id}`,
      );
      // Uploads the image to the storage
      await uploadBytes(tripsStorageRef, image);
      const url = await getDownloadURL(tripsStorageRef);
      // saves to storage reference
      const imageData = { id: image.name, url: url };
      await updateDoc(dateRef, {
        images: arrayUnion(imageData),
      });
    }
    catch (error) {
      console.error("Error uploading image: ", error);
    }
  }

  async deleteImage(tripId, date_id, index) {
    const dateRef = await doc(
      this.db,
      `user/${this.uid}/trips/${tripId}/days/${date_id}`,
    );
    const dateSnap = await getDoc(dateRef);
    const images = dateSnap.data().images;
    images.splice(index, 1);

    await updateDoc(dateRef, {images: images});
  }
}
