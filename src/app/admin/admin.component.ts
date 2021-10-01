import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';
import { RegistryService } from '../registry.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  guestName = '';
  allGuests = []
  registry = []
  greetingValue = ''
  selectGuestIndex = -1;
  selectedGuest = null;

  rsvpName = ''

  rsvps = []

  constructor(private guestService: GuestService,
    private RegistryService: RegistryService) { }

  ngOnInit(): void {
    this.getRegistry()
    this.getGuests()
  }

  createGuest(event): void {
    console.log("create new guest", this.guestName)
    this.guestService.createNewGuest(this.guestName)
    this.guestName = '';

  }

  getGuests() {
    this.guestService
      .getAllGuests()
      .subscribe(res => {
        console.log(res);
        this.allGuests = res;

        res.forEach((p) => {
          p.payload.doc.ref.collection('persons').get().then((x) => {
            x.forEach(rsvp => {
              console.log(rsvp.data())
              console.log('rsvp.ref.parent',rsvp.ref.parent.parent.id)

              this.rsvps.push({
                data: rsvp.data(),
                id: rsvp.ref.parent.parent.id
              })

              console.log(this.rsvps)
            })
          })

        });
      });
  }

  getRegistry() {
    this.RegistryService
      .getRegistry()
      .subscribe(res => {
        this.registry = res;
      });
  }

  deleteGuest(guest) {
    this.guestService.deleteGuest(guest);
    console.log('delete guest')
  }

  setGreeting() {
    console.log("create new greetingValue", this.greetingValue)

    let newData = this.selectedGuest.payload.doc.data();
    newData['greeting'] = this.greetingValue;
    console.log(newData, this.selectedGuest.payload.doc.id)
    this.guestService.updateInvite(newData, this.selectedGuest.payload.doc.id)
  }

  selectGuest(guest, i) {
    console.log(guest, i)
    this.selectGuestIndex = i;
    this.selectedGuest = guest
    console.log(guest.payload.doc.data())
    console.log(guest.payload.doc.id)
  }

  createRSVP() {
    console.log('rsvp name: ', this.rsvpName)

    let data = {
      coming: false,
      isPlusOne: this.rsvpName == '' ? true : false,
      meal: '',
      name: this.rsvpName,
      vaccinated: ''
    }

    this.guestService.createRSVP(data, this.selectedGuest.payload.doc.id)
    console.log('data: ', data)
  }

}
