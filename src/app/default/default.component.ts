import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../guest.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  guestName = '';
  guest = null;
  persons = null;
  personsData = []
  daysLeft = 0;
  hoursLeft = 0;
  minsLeft = 0;
  rsvps = new FormArray([]);
  showPlusOne = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private GuestService: GuestService) {
    this.GuestService.setUserDetailsFromActivatedRoute(this.activatedRoute);
    this.getGuestDetails()
    this.countDown();
  }

  ngOnInit(): void {

  }

  async getGuestDetails() {
    this.guestName = await this.GuestService.getGuestName();
    this.guest = await this.GuestService.guestGuestByName(this.guestName);
    this.persons = await this.GuestService.getPersonByName(this.guestName);
    await this.createRSVPs();
  }

  createRSVPs(){
    this.personsData = []

    this.persons.forEach(person => {
      const personData = person.data()
      const rsvp = new FormGroup({
        name: new FormControl(personData.name),
        meal: new FormControl(personData.meal),
        coming: new FormControl(personData.coming),
        vaccinated: new FormControl(personData.vaccinated),
        isPlusOne: new FormControl(personData.isPlusOne)
      })

      this.personsData.push(person.data())
      this.rsvps.push(rsvp);
    });
  }

  submitRSVP(){
    console.log('submit rsvp')

    this.rsvps.controls.forEach((group, index) => {
      let rsvp = {
        coming: group.get('coming').value,
        isPlusOne: group.get('isPlusOne').value,
        meal: group.get('meal').value,
        name: group.get('name').value,
        vaccinated: group.get('vaccinated').value
      }

      let count = 0
      this.persons.forEach((person) => {
        if(count++ == index){
          console.log('update id',person.id, rsvp, this.guest.id)
          this.GuestService.updatePersonById(person.id, rsvp, this.guest.id)
        }
      });
    })
  }

  removePlusOne(rsvpp, index){
    this.showPlusOne = false;

    rsvpp.controls['coming'].setValue('')
    rsvpp.controls['meal'].setValue('')
    rsvpp.controls['name'].setValue('')
    rsvpp.controls['vaccinated'].setValue('')

    this.personsData[index].coming = ''
    this.personsData[index].meal = ''
    this.personsData[index].name = ''
    this.personsData[index].coming = ''

    console.log('remove plus one',rsvpp.get('coming').value)
  }

  addPlusOne(){
    this.showPlusOne = true;
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
