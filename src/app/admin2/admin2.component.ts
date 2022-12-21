import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';

@Component({
  selector: 'app-admin2',
  templateUrl: './admin2.component.html',
  styleUrls: ['./admin2.component.scss']
})
export class Admin2Component implements OnInit {

  rsvps = []
  allGuests = []

  constructor(private guestService: GuestService) { }

  ngOnInit(): void {
    this.getGuests()
  }

  getGuests() {
    this.guestService
      .getAllGuests()
      .subscribe(res => {
        this.rsvps = []
  
        this.allGuests = res;

        res.forEach((p) => {
          p.payload.doc.ref.collection('persons').get().then((x) => {
            x.forEach(rsvp => {

              this.rsvps.push({
                data: rsvp.data(),
                id: rsvp.ref.parent.parent.id
              })
            })
          })

        });
      });
  }

}
