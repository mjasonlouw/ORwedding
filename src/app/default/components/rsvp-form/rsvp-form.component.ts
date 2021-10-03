import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../../../guest.service';
import { MealOption } from '../../models/MealOptions.models';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rsvp-form',
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.scss']
})

export class RsvpFormComponent {
  @Output() changePageTo = new EventEmitter<string>();
  @Output() finishedLoading = new EventEmitter<boolean>();

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

  submitedForm = false;

  inviteCount = 0;

  BigError = '';

  allDataLoaded = false;

  somethingNotFilledIn = true; 

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
      new MealOption("cauliflowerSteak", "Roasted cauli. steak",  "../../../../assets/images/meals/cauliflower_steak.jpg")
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
      const rsvp = new FormGroup({
        name: new FormControl(personData.name),
        meal: new FormControl(personData.meal),
        coming: new FormControl(personData && personData.coming),
        vaccinated: new FormControl(personData && personData.vaccinated),
        isPlusOne: new FormControl(personData && personData.isPlusOne)
      })

      if(personData.meal == '' || personData.name == ''){
        personData['error'] = 'X'
      }else{
        personData['error'] = '';
      }
      
      this.personsData.push(personData)
      this.rsvps.push(rsvp);
    });

    this.finishedLoading.emit(true)
  }

  plusOneAddition() {
    this.validationCheck(); 
  }

  validationCheck(submit = false) {
    let convertedRsvps = []
    convertedRsvps = this.rsvps.controls.map
    ((group,index) => {
      let rsvp = {
        coming: group.get('coming').value,
        isPlusOne: group.get('isPlusOne').value,
        meal: group.get('meal').value,
        name: group.get('name').value,
        vaccinated: group.get('vaccinated').value
      }
      
      this.personsData[index].error = ''
      if(group.get('meal').value == '' && group.get('coming').value){
        this.personsData[index].error = 'X';

        if(this.personsData[index].name == "") {
          this.BigError = `No meal option has been picked for your plus one.`
        } else {
          this.BigError = `No meal option has been picked for ${this.personsData[index].name}.`
        }
      }

      if(group.get('isPlusOne').value && group.get('coming').value && group.get('name').value == ''){
        this.personsData[index].error = 'X';
        this.BigError = `Please provide a name for your plus one.`
      }

      this.personsData[index].name = group.get('name').value;

      return rsvp;
    });

    for(var i = 0; i<this.personsData.length; i++) {
      if(this.personsData[i].error == 'X'){
        this.somethingNotFilledIn = true;
        break;
      } else {
        this.somethingNotFilledIn = false;
      }
    }

    if(true) {
      return convertedRsvps;
    }
  }

  submitRSVP(){
    this.BigError = ''
    let errors: Array<any> = []
    let convertedRsvps = []
    convertedRsvps = this.validationCheck(true); 

    if(this.BigError != ''){
      return
    }

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
            this.GuestService.updatePersonById(person.id, rsvp, this.guest.id)
          }
        });
      });

      this.submitedForm = true;
    } else {
      this.errorList = errors;
    }
    

    this.submitted(); 
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

  }

  addPlusOne(){
    this.showPlusOne = true;
  }

  public toggleComingControl(state: boolean, rsvpControl: any): void {
    rsvpControl.controls['coming'].setValue(state);
    this.validationCheck(); 
  }

  public toggleVaccineControl(state: boolean, rsvpControl: any): void {
    rsvpControl.controls['vaccinated'].setValue(state);
  } 

  public selectMeal(selectedMeal: string, rsvpControl: any): void {
    rsvpControl.controls['meal'].setValue(selectedMeal);
    this.validationCheck(); 
  }

  scroll = false;
  timeout;
  scrollContainerScrolling(e){
 

    // el.scrollLeft = 300;
    // el.scrollTop = 500;


    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.scroll = false;
      this.setScrollPostion()
    }, 300);

  }

  setScrollPostion(){
    const el = document.querySelector('.scrollContainer');
    let containerWidth = el.clientWidth
    let currentScrollLeft = el.scrollLeft

    for(var i = 0; i < this.inviteCount; i++){

        let goto = i * containerWidth;
        let min = (i * containerWidth) - (containerWidth/2);
        let max = (i * containerWidth) + (containerWidth/2);

        if(currentScrollLeft > min && currentScrollLeft < max){
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

  changePage(page){
    this.changePageTo.emit(page)
  }

  submitted(){
    var popup = document.getElementsByClassName("added_popup_wrapper")[0];

    popup.classList.remove("hidden");
    popup.classList.add("show");

    this.removePopUp(popup);
  }

  removePopUp(popup) {
    setTimeout(function () {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 3000);
  }
  
}
