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
      console.log('This user doesnt exist', this.GuestName)
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
    console.log('creating guest with name', name)
    this.firestore.collection("Users").add({ name }).then(res => {
      console.log('created new guest')
    }, err => {
      console.log('ERROR: couldnt create new guestt')
    });
  }

  deleteGuest(guest) {
    this.firestore.collection("Users").doc(guest.payload.doc.id).delete();
  }

  async guestGuestByName(name){
    return new Promise<QueryDocumentSnapshot<unknown>>((res, ref) => {
      this.firestore.collection('UsersDev', ref => ref.where('name', '==', name))
        .get().subscribe(data => {
          data.forEach(el => {
            console.log(el.id, el.data())
            res(el)
          })
        })
    })
  }

  async getPersonByName(name){
    console.log("getting person")
   return new Promise((res, err) => {
     this.firestore.collection('UsersDev', ref => ref.where('name', '==', name))
      .get().subscribe(querySnapshot => {
        console.log("where my things",querySnapshot)
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            this.firestore.collection('UsersDev').doc(doc.id).collection('persons')
            .get().subscribe(persons => {
              res(persons);
            })
        });
      })
   }) 
  }

  async updatePersonById(id, rsvp, guestID){
    this.firestore.collection('UsersDev')
    this.firestore.doc(`UsersDev/${guestID}/persons/${id}`).update(rsvp);
  }
}
