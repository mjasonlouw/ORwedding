import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../../../guest.service';
import { MealOption } from '../../models/MealOptions.models';

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

  showErrors: boolean = true;
  errorList = new Array();

  inviteCount = 0

  constructor(
    private activatedRoute: ActivatedRoute,
    private GuestService: GuestService) {
    this.GuestService.setUserDetailsFromActivatedRoute(this.activatedRoute);
    this.getGuestDetails()
  }

  ngOnInit(): void {    
    this.mealOptions = [
      new MealOption("chorizoSausage", "Chorizo sausage and Prawn gnocchi",  "../../../../assets/images/meals/chorizo_sausage.jpg"),
      new MealOption("lambShank", "Slow Braised lamb shank",  "../../../../assets/images/meals/lamb_shank.jpg"),
      new MealOption("porkBelly", "Crispy Pork belly",  "../../../../assets/images/meals/pork_belly.jpg"),
      new MealOption("cauliflowerSteak", "Roasted cauliflower steak",  "../../../../assets/images/meals/cauliflower_steak.jpg")
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
      this.inviteCount++
      const personData = person.data()
      console.log('person data:',personData);
      const rsvp = new FormGroup({
        name: new FormControl(personData.name),
        meal: new FormControl(personData.meal),
        coming: new FormControl(personData && personData.coming),
        vaccinated: new FormControl(personData && personData.vaccinated),
        isPlusOne: new FormControl(personData && personData.isPlusOne)
      })

      this.personsData.push(person.data())
      this.rsvps.push(rsvp);
    });
  }

  submitRSVP(){
    console.log('submit rsvp')
    let errors: Array<any> = []
    let convertedRsvps = []
    convertedRsvps = this.rsvps.controls.map
    (group => {
      let rsvp = {
        coming: group.get('coming').value,
        isPlusOne: group.get('isPlusOne').value,
        meal: group.get('meal').value,
        name: group.get('name').value,
        vaccinated: group.get('vaccinated').value
      }
      errors.push(...this.validateRSVP(rsvp));
      return rsvp;
    });

    convertedRsvps = convertedRsvps.map(e => {
      if (!e.coming) {
        e.meal = "";
        e.vaccinated = "";
      }

      return e;
    });

    if (errors.length === 0) {
      this.errorList = [];

      convertedRsvps
      .forEach((rsvp, index) => {
        let count = 0
        this.persons.forEach((person) => {
          if(count++ == index){
            console.log('update id',person.id, rsvp, this.guest.id)
            this.GuestService.updatePersonById(person.id, rsvp, this.guest.id)
          }
        });
      });
    } else {
      this.errorList = errors;
    }
    
  }

  private validateRSVP(rsvp: any): Array<any> {
    let result: Array<any> = [];
    if (rsvp.coming) {
      this.appendIf(result, {name: rsvp.name, error: "has not selected a meal"}, rsvp.meal === null || rsvp.meal === undefined);
      this.appendIf(result, {name: rsvp.name, error: "has not stated their vaccination status"}, rsvp.vaccinated === null || rsvp.vaccinated == undefined);
    }
    return result;
  }

  private appendIf(array: Array<any>, element: any, condition: boolean): void {
    if (condition) {
      array.push(element)
    }
  }

  removePlusOne(rsvpp, index){
    this.showPlusOne = false;

    rsvpp.controls['coming'].setValue('')
    rsvpp.controls['meal'].setValue('')
    rsvpp.controls['name'].setValue('')
    rsvpp.controls['vaccinated'].setValue('')

    this.personsData[index].coming = false
    this.personsData[index].meal = ''
    this.personsData[index].name = ''
    this.personsData[index].vaccinated = false

    console.log('remove plus one',rsvpp.get('coming').value)
  }

  addPlusOne(){
    this.showPlusOne = true;
  }

  public toggleComingControl(state: boolean, rsvpControl: any): void {
    rsvpControl.controls['coming'].setValue(state);
  }

  public toggleVaccineControl(state: boolean, rsvpControl: any): void {
    rsvpControl.controls['vaccinated'].setValue(state);
  } 

  public selectMeal(selectedMeal: string, rsvpControl: any): void {
    rsvpControl.controls['meal'].setValue(selectedMeal);
  }

  scroll = false;
  timeout;
  scrollContainerScrolling(e){
 

    // el.scrollLeft = 300;
    // el.scrollTop = 500;


    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.scroll = false;
      console.log('stopped scrolling')
      this.setScrollPostion()
    }, 300);

  }

  setScrollPostion(){
    const el = document.querySelector('.scrollContainer');
    let containerWidth = el.clientWidth
    let currentScrollLeft = el.scrollLeft

    console.log('currentScrollLeft: ',currentScrollLeft)

    for(var i = 0; i < this.inviteCount; i++){

        let goto = i * containerWidth;
        let min = (i * containerWidth) - (containerWidth/2);
        let max = (i * containerWidth) + (containerWidth/2);

        if(currentScrollLeft > min && currentScrollLeft < max){
          console.log('goto',i,goto)
          // el.scrollLeft = goto;
          // el.scrollIntoView()
          const per = document.querySelector(`.rsvpPerson0`);
          // per.scrollIntoView({behavior: 'smooth'})
          this.currentStep = i;
          el.scrollTo({
            top: 0,
            left: goto,
            behavior: 'smooth'
          });

          //192.168.58.198
        }

    }
  }

  scrollTo(i){
    console.log(i);

    const el = document.querySelector('.scrollContainer');
    let containerWidth = el.clientWidth
    let currentScrollLeft = el.scrollLeft

    let goto = i * containerWidth;
    let min = (i * containerWidth) - (containerWidth/2);
    let max = (i * containerWidth) + (containerWidth/2);

      const per = document.querySelector(`.rsvpPerson0`);
      // per.scrollIntoView({behavior: 'smooth'})
      this.currentStep = i;
      el.scrollTo({
        top: 0,
        left: goto,
        behavior: 'smooth'
      });

      //192.168.58.198

  }
}
