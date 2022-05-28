import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class GuestService {

  GuestName = '';

  constructor(
    private firestore: AngularFirestore,
    private router: Router) { }

  async setUserDetailsFromActivatedRoute(activatedRoute: ActivatedRoute) {
    activatedRoute.params.forEach(x => {
      this.GuestName = x.name;
    })

    if(this.GuestName == null) {

    }
    
    document.cookie = this.GuestName;
    // let users = await this.firestore.collection('Users').get()//this should work but it doesnt lol
    // console.log('usersss',users)

    let allUsers = []
    /* The following code is wack there must be a better way to get the Users */
    let reponse: [any] = await new Promise((ret: any) => {
      this.firestore.collection("Users").snapshotChanges().subscribe(res => {
        ret(res)
      })
    })

    reponse.forEach(element => {
      allUsers.push(element.payload.doc.data().name)
    });


    let newAll = allUsers.filter(user => {
      return user.toLowerCase() == this.GuestName.toLowerCase()
    })

    if (newAll.length == 0) {
      this.GuestName == ''
      this.router.navigate(['']);
    }
  }

  getAllGuests() {
    return this.firestore.collection("Users").snapshotChanges()
  }

  getGuestName() {
    return this.GuestName;
  }

  createNewGuest(name) {
    this.firestore.collection("Users").add({ name }).then(res => {
    }, err => {
    });
  }

  deleteGuest(guest) {
    this.firestore.collection("Users").doc(guest.payload.doc.id).delete();
  }

  async guestGuestByName(name){
    return new Promise<QueryDocumentSnapshot<unknown>>((res, ref) => {
      this.firestore.collection('Users', ref => ref.where('name', '==', name))
        .get().subscribe(data => {
          data.forEach(el => {
            res(el)
          })
        })
    })
  }

  async getPersonByName(name){
   return new Promise((res, err) => {
     this.firestore.collection('Users', ref => ref.where('name', '==', name))
      .get().subscribe(querySnapshot => {
        querySnapshot.forEach((doc) => {
            this.firestore.collection('Users').doc(doc.id).collection('persons')
            .get().subscribe(persons => {
              res(persons);
            })
        });
      })
   }) 
  }

  async updatePersonById(id, rsvp, guestID){
    this.firestore.collection('Users')
    rsvp.rsvp = true; 

    console.log(rsvp);
    this.firestore.doc(`Users/${guestID}/persons/${id}`).update(rsvp);
  }

  async updateInvite(invite, guestID){
    // this.firestore.collection('UsersDev',invite, guestID)

    this.firestore.doc(`Users/${guestID}`).set(invite);
  }

  async createRSVP(data, guestID){
    this.firestore.collection(`Users/${guestID}/persons`).add(data)
  }
}
