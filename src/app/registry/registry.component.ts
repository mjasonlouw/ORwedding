import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../guest.service';
import { RegistryService } from '../registry.service';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent implements OnInit {

  finalRegistry;
  searchRegistry;
  registry;
  categories = [];
  activeCategories = [];
  guestsItems = [];
  searchTerm = '';
  categoryFilter: FormGroup

  constructor(
    private activatedRoute: ActivatedRoute,
    private RegistryService: RegistryService,
    private GuestService: GuestService,
    private formBuilder: FormBuilder) {

      this.categoryFilter = this.formBuilder.group({
        categories: new FormArray([])
      });

     }

  ngOnInit(): void {
    this.GuestService.setUserDetailsFromActivatedRoute(this.activatedRoute);
    this.getRegistry();
    this.GuestService.getGuestName()
    this.filterCategories()
  }

  get ordersFormArray() {
    return this.categoryFilter.controls.categories as FormArray;
  }

  sortCategories(){
    this.registry.forEach(item => {
      item.payload.doc.data().category.forEach(cat => {
        this.categories.push(cat) //get each category
      });
    });
    
    this.categories = [...new Set(this.categories)]; //remove duplicates
    console.log(this.categories)

    this.categoryFilter = this.formBuilder.group({
      categories: new FormArray([])
    });

    this.categories.forEach(() => {
      this.ordersFormArray.push(new FormControl(false));
    })
  }

  getRegistry(){
    this.RegistryService
      .getRegistry()
      .subscribe(res => {
        this.registry = res;
        this.sortCategories();
        this.filterCategories();
        this.searchThroughRegistry();
        this.sortMyItems();
      });
  }

  checkCategory(index, values){
    console.log(index, values.currentTarget.checked);
    console.log(this.categories[index])
    let io = this.activeCategories.indexOf(this.categories[index])
    if(io >= 0){
      this.activeCategories.splice(io, 1);
    }else{
      this.activeCategories.push(this.categories[index])
    }

    console.log("active", this.activeCategories)

    this.filterCategories()
    this.searchThroughRegistry()
  }

  filterCategories(){
    this.searchRegistry = [];
    this.registry.forEach(item => {
      let data = item.payload.doc.data();
      const intersection = data.category.filter(element => this.activeCategories.includes(element));
      console.log("this.activeCategories.length",this.activeCategories.length)
      if(intersection.length > 0){
        this.searchRegistry.push(item)
      }else if(this.activeCategories.length == 0){
        this.searchRegistry.push(item)
      }

      if(this.searchTerm != ''){
        this.searchThroughRegistry()
      }
      console.log("intesection",intersection)
    })
  }

  searchThroughRegistry(){
    console.log("0------------searching through registry")
    this.finalRegistry = [];
    this.searchRegistry.forEach(item => {
      let data = item.payload.doc.data();

      let allSearchableTerms = this.searchTerm.split(' ');

      let allSearchableWords = [...data.name.split(' ')]

      data.category.forEach(cat => {
        allSearchableWords = [...allSearchableWords, ...cat.split(' ')]
      });

      console.log("allSearchableWords",allSearchableWords)
      console.log("allSearchableTerms",allSearchableTerms)

      let intersection = [];
      allSearchableWords.forEach(word => {
        allSearchableTerms.forEach(term => {
          word = word.toLowerCase()
          term = term.toLowerCase()
          console.log(word,term,word.indexOf(term))
          if(word.indexOf(term) != -1){
            intersection.push(word)

          }
        })
      })

      console.log("INTERSECTION: ", intersection)
      if(intersection.length > 0){
        this.finalRegistry.push(item)
      }else if(this.searchTerm == ''){
        this.finalRegistry.push(item)
      }
    });
  }

  onSearchKeyUp(event){
    console.log(event.target.value);
    this.searchTerm = event.target.value;
    this.searchThroughRegistry()
  }

  selectItem(item){
   this.RegistryService.assignGuestToItem(item, this.GuestService.getGuestName())
   this.sortMyItems()
  }

  sortMyItems(){
    console.log("sort guests items")
    this.guestsItems = [];
    let guestName = this.GuestService.getGuestName();
    this.searchRegistry.forEach(item => {
      let data = item.payload.doc.data();
      console.log(data.name, guestName)
      if(data.guest == guestName){
        this.guestsItems.push(item);
      }
    })
  }
      

}
