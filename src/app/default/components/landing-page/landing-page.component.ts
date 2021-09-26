import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../../../guest.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  guestName = '';
  guest = null;

  daysLeft = 0;
  hoursLeft = 0;
  minsLeft = 0;

  showMenu: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private GuestService: GuestService) {
    this.GuestService.setUserDetailsFromActivatedRoute(this.activatedRoute);
    this.getGuestDetails()
    this.countDown();
  }

  ngOnInit(): void{
  }

  async getGuestDetails() {
    this.guestName = await this.GuestService.getGuestName();
    this.guest = await this.GuestService.guestGuestByName(this.guestName);
  }

  countDown() {
    let currentDate = new Date();
    let dateOfWedding = new Date('2021-11-06');

    let dif = dateOfWedding.getTime() - currentDate.getTime();

    this.daysLeft = Math.floor(dif / (1000 * 3600 * 24));
    this.hoursLeft = Math.floor((dif / (1000 * 3600)) % 24);
    this.minsLeft = Math.floor((dif / (1000 * 60)) % 60);

    setInterval(function () {
      let currentDate = new Date();
      let dateOfWedding = new Date('2021-11-06');

      let dif = dateOfWedding.getTime() - currentDate.getTime();

      this.daysLeft = Math.floor(dif / (1000 * 3600 * 24));
      this.hoursLeft = Math.floor((dif / (1000 * 3600)) % 24);
      this.minsLeft = Math.floor((dif / (1000 * 60)) % 60);
    }, 10 * 1000);
  }

}
