import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  GuestName = '';

  constructor() { }

  setUserDetailsFromActivatedRoute(activatedRoute: ActivatedRoute){
    activatedRoute.params.forEach(x =>{
      this.GuestName = x.name;
    })
  }
}
