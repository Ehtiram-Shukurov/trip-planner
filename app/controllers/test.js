import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action, computed } from '@ember/object';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { tracked } from '@glimmer/tracking';
import { onSnapshot, query, where } from 'firebase/firestore';


export default class TestController extends Controller {
    //TODO: fine tune the data storage/strucuture that is revelant to peoples part


    @action
    async newTrip() {
      const docRef = doc(this.auth.doc, 'users', this.auth.user.uid);
      const docData = {
        id: Date.now().toString(),      //trip ID using date creation for id
        tripName: this.tripName,        // date page info
        tripDates: {                    // creates as many elements in the dictionary object as the number of dates user selects
                                        // might have the dictionary key be more unique such as -->120124
                                        // for 12/01/24
            0: {time:"12:00 p.m.", budget: 100, location: "some location"},  // day details page info where it is updated
            1: {time:"12:00 p.m.", budget: 100, location: "some location"},
            2: {time:"12:00 p.m.", budget: 100, location: "some location"},
            3: {time:"12:00 p.m.", budget: 100, location: "some location"},
            4: {time:"12:00 p.m.", budget: 100, location: "some location"},
        },                  
        tripLocation: this.tripLocation, //destination page info
      };
      
      // update database info
      setDoc(
        docRef,
        {
          name: this.auth.user.displayName,
          trips: arrayUnion(docData),
        },
        { merge: true },
      );
    }
}
