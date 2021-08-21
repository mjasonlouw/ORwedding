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

  searchRegistry;
  registry;
  categories = [];
  activeCategories = [];
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
    console.log("searching through registry")
    this.searchRegistry.forEach(item => {
      console.log(item.payload.doc.data())
    });
  }

  onSearchKeyUp(event){
    console.log(event.target.value);
    this.searchTerm = event.target.value;
    if(this.searchTerm != ''){
      this.searchThroughRegistry()
    }
  }
      

}
