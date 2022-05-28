import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../../../guest.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {
  @Output() changePageTo = new EventEmitter<string>();

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

  pageToShow = 'landing';

  changePage(pageName) {
    this.changePageTo.emit(pageName);
  }

  async getGuestDetails() {
    this.guestName = await this.GuestService.getGuestName();
    this.guest = await this.GuestService.guestGuestByName(this.guestName);
  }

  countDown() {
    let currentDate = new Date();
    let dateOfWedding = new Date('2022-07-30');
    dateOfWedding.setHours(15, 30)


    let dif = dateOfWedding.getTime() - currentDate.getTime();

    this.daysLeft = Math.floor(dif / (1000 * 3600 * 24));
    this.hoursLeft = Math.floor((dif / (1000 * 3600)) % 24);
    this.minsLeft = Math.floor((dif / (1000 * 60)) % 60);

    setInterval(function () {
      let currentDate = new Date();
      let dateOfWedding = new Date('2021-11-06');
      dateOfWedding.setHours(15, 30)

      let dif = dateOfWedding.getTime() - currentDate.getTime();

      this.daysLeft = Math.floor(dif / (1000 * 3600 * 24));
      this.hoursLeft = Math.floor((dif / (1000 * 3600)) % 24);
      this.minsLeft = Math.floor((dif / (1000 * 60)) % 60);
    }, 10 * 1000);
  }

  openMainMenu() {
    var menu = document.getElementsByClassName("menu_dropdown_wrapper")[0]; 
    var menu_items = document.getElementsByClassName("main_menu_item"); 

    if (menu.classList.contains("closed")) {
      menu.classList.remove("closed");
      menu.classList.add("open");

      for(var i = 0; i<menu_items.length; i++) {
        menu_items[i].classList.remove("fade_out");
      }

      for(var i = 0; i<menu_items.length; i++) {
        menu_items[i].classList.add("fade_in");
      }

      document.getElementsByClassName("open_menu")[0].classList.add("fade_out");
      document.getElementsByClassName("close_menu")[0].classList.add("fade_in");

      document.getElementsByClassName("open_menu")[0].classList.remove("fade_in");
      document.getElementsByClassName("close_menu")[0].classList.remove("fade_out");

    } else {
      menu.classList.remove("open");
      menu.classList.add("closed");

      for(var i = 0; i<menu_items.length; i++) {
        menu_items[i].classList.remove("fade_in");
      }

      for(var i = 0; i<menu_items.length; i++) {
        menu_items[i].classList.add("fade_out");
      }

      document.getElementsByClassName("open_menu")[0].classList.add("fade_in");
      document.getElementsByClassName("close_menu")[0].classList.add("fade_out");

      document.getElementsByClassName("open_menu")[0].classList.remove("fade_out");
      document.getElementsByClassName("close_menu")[0].classList.remove("fade_in");
    }
  }
}
