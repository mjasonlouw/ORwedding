import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {

  constructor(private firestore: AngularFirestore) { 

  }

  getRegistry(){
    return this.firestore.collection('Registry').snapshotChanges()
  }

  assignGuestToItem(item, name){
    return this.firestore.collection('Registry').doc(item.payload.doc.id).set({guest: name}, {merge: true});
  }

  removeGuestFromItem(item){
    return this.firestore.collection('Registry').doc(item.payload.doc.id).set({guest: ''}, {merge: true});
  }
}
