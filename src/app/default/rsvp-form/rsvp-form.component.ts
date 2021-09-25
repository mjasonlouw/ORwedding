import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../../guest.service';
import { MealOption } from '../interfaces/MealOptions.interface';

@Component({
  selector: 'app-rsvp-form',
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.scss']
})

export class RsvpFormComponent {
  guestName = '';
  guest = null;
  persons = null;
  personsData = []
  rsvps = new FormArray([]);
  showPlusOne = false;

  mealOptions = new Array();

  currentStep: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private GuestService: GuestService) {
    this.GuestService.setUserDetailsFromActivatedRoute(this.activatedRoute);
    this.getGuestDetails()
  }

  ngOnInit(): void {    
    this.mealOptions = [
      new MealOption("chorizoSausage", "Chorizo sausage and Prawn gnocchi",  "../../assets/images/meals/chorizo_sausage.jpg"),
      new MealOption("lambShank", "Slow Braised lamb shank",  "../../assets/images/meals/lamb_shank.jpg"),
      new MealOption("porkBelly", "Crispy Pork belly",  "../../assets/images/meals/pork_belly.jpg"),
      new MealOption("cauliflowerSteak", "Roasted cauliflower steak",  "../../assets/images/meals/cauliflower_steak.jpg")
    ];
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


  comingControlFlag: boolean = true;
  vaccinatedControlFlag: boolean = false;

  public toggleComingControl(state: boolean): void {
   
    this.comingControlFlag = state;
  }

  public toggleVaccineControl(state: boolean): void {
    this.vaccinatedControlFlag = state;
  } 

  currentMealOption: MealOption
  public selectMeal(selectedMeal: MealOption): void {
    console.log(this.currentMealOption);
    this.currentMealOption = selectedMeal;
    console.log(this.currentMealOption);
  }
}
