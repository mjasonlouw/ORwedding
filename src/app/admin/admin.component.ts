import { Component, OnInit } from '@angular/core';
import { GuestService } from '../guest.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  guestName = '';
  allGuests = []

  constructor(private guestService: GuestService) { }

  ngOnInit(): void {
    this.getRegistry()
  }

  createGuest(event): void {
    console.log("create new guest", this.guestName)
    this.guestService.createNewGuest(this.guestName)
    this.guestName = '';

  }

  getRegistry() {
    this.guestService
      .getAllGuests()
      .subscribe(res => {
        console.log(res);
        this.allGuests = res;
      });
  }

  deleteGuest(guest){
    this.guestService.deleteGuest(guest);
    console.log('delete guest')    
  }

}
