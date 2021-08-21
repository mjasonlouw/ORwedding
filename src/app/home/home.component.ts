import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../guest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private guestService: GuestService) { }

  ngOnInit(): void {
    this.guestService.setUserDetailsFromActivatedRoute(this.activatedRoute);
  }
}
