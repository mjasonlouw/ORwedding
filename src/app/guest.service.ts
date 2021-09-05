import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  GuestName = '';

  constructor(private firestore: AngularFirestore, private router: Router) { }

  async setUserDetailsFromActivatedRoute(activatedRoute: ActivatedRoute){
    activatedRoute.params.forEach(x =>{
      this.GuestName = x.name;
    })
    document.cookie = this.GuestName;
    // let users = await this.firestore.collection('Users').get()//this should work but it doesnt lol
    // console.log('usersss',users)
    
    let allUsers = []
    /* The following code is wack there must be a better way to get the Users */
    let reponse:[any] = await new Promise((ret:any) => {
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

    if(newAll.length == 0){
      console.log('This user doesnt exist', this.GuestName)
      this.GuestName == ''
      this.router.navigate(['']);
    }
  }

  getGuestName(){
    return this.GuestName;
  }
}
