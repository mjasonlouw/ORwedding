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
}
