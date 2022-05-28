import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuestService } from '../guest.service';
import { RegistryService } from '../registry.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss']
})
export class RegistryComponent {
  finalRegistry;
  searchRegistry;
  registry = [];
  categories = [];
  activeCategories = [];
  guestsItems = [];
  searchTerm = '';
  categoryFilter: FormGroup;

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

  sortCategories() {
    if (this.categories.length == 0) {
      this.registry.forEach(item => {
        //console.log(item);

        item.payload.doc.data().category.forEach(cat => {
          this.categories.push(cat) //get each category
        });
      });

      this.categories = [...new Set(this.categories)]; //remove duplicates

      this.categoryFilter = this.formBuilder.group({
        categories: new FormArray([])
      });

      this.categories.forEach(() => {
        this.ordersFormArray.push(new FormControl(false));
      })
    }
  }

  getRegistry() {


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

  checkCategory(index, values) {
    let io = this.activeCategories.indexOf(this.categories[index])
    if (io >= 0) {
      this.activeCategories.splice(io, 1);
    } else {
      this.activeCategories.push(this.categories[index])
    }

    this.filterCategories()
    this.searchThroughRegistry()
  }

  filterCategories() {
    this.searchRegistry = [];
    this.registry.forEach(item => {
      let data = item.payload.doc.data();
      const intersection = data.category.filter(element => this.activeCategories.includes(element));
      //console.log("this.activeCategories.length",this.activeCategories.length)
      if (intersection.length > 0) {
        this.searchRegistry.push(item)
      } else if (this.activeCategories.length == 0) {
        this.searchRegistry.push(item)
      }

      if (this.searchTerm != '') {
        this.searchThroughRegistry()
      }
      //console.log("intesection",intersection)
    })
  }

  searchThroughRegistry() {
    //console.log("0------------searching through registry")
    this.finalRegistry = [];
    this.searchRegistry.forEach(item => {
      let data = item.payload.doc.data();

      let allSearchableTerms = this.searchTerm.split(' ');

      let allSearchableWords = [...data.name.split(' ')]

      data.category.forEach(cat => {
        allSearchableWords = [...allSearchableWords, ...cat.split(' ')]
      });

      //console.log("allSearchableWords",allSearchableWords)
      //console.log("allSearchableTerms",allSearchableTerms)

      let intersection = [];
      allSearchableWords.forEach(word => {
        allSearchableTerms.forEach(term => {
          word = word.toLowerCase()
          term = term.toLowerCase()
          //console.log(word,term,word.indexOf(term))
          if (word.indexOf(term) != -1) {
            intersection.push(word)

          }
        })
      })

      //console.log("INTERSECTION: ", intersection)
      if (intersection.length > 0) {
        this.finalRegistry.push(item)
      } else if (this.searchTerm == '') {
        this.finalRegistry.push(item)
      }
    });

    this.finalRegistry.sort((a, b) => {
      let name1 = b.payload.doc.data().name.replace(/[0-9]/g, '').replace(' ','');
      let name2 = a.payload.doc.data().name.replace(/[0-9]/g, '').replace(' ','');
      if (name1 > name2)
        return -1;
      if (name1 > name2)
        return 1;
      return 0;
    })
  }

  onSearchKeyUp(event) {
    //console.log(event.target.value);
    this.searchTerm = event.target.value;
    this.searchThroughRegistry()
  }

  removePopUp(popup) {
    setTimeout(function () {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 3000);
  }

  selectItem(item) {
    if (item.payload.doc.data().guest == '') {
      this.RegistryService.assignGuestToItem(item, this.GuestService.getGuestName())
      this.sortMyItems()

      var popup = document.getElementsByClassName("added_popup_wrapper_registry")[0];
      document.getElementsByClassName("added_popup_information_registry")[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14.665" height="14.665" viewBox="0 0 14.665 14.665"><path id="tag-plus" d="M16.232,9.025l-6.6-6.6A1.465,1.465,0,0,0,8.6,2H3.467A1.467,1.467,0,0,0,2,3.467V8.6a1.442,1.442,0,0,0,.433,1.034l.3.293a4.269,4.269,0,0,1,2.2-.594,4.4,4.4,0,0,1,4.4,4.4,4.3,4.3,0,0,1-.6,2.2l.293.293a1.465,1.465,0,0,0,1.041.44,1.442,1.442,0,0,0,1.034-.433L16.232,11.1a1.442,1.442,0,0,0,.433-1.034,1.471,1.471,0,0,0-.433-1.041M4.566,5.666a1.1,1.1,0,1,1,1.1-1.1,1.1,1.1,0,0,1-1.1,1.1m3.3,8.8h-2.2v2.2H4.2v-2.2H2V13H4.2V10.8H5.666V13h2.2Z" transform="translate(-2 -2)"/></svg><div>Reserved Gift</div>';

      popup.classList.remove("hidden");
      popup.classList.add("show");

      this.removePopUp(popup);

    }
  }

  removeGuestItem(item) {
    this.RegistryService.removeGuestFromItem(item)
    this.sortMyItems()

    var popup = document.getElementsByClassName("added_popup_wrapper_registry")[0];
    document.getElementsByClassName("added_popup_information_registry")[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="11.039" height="14.192" viewBox="0 0 11.039 14.192"><path id="delete" d="M16.039,3.788h-2.76L12.49,3H8.548l-.788.788H5V5.365H16.039M5.788,15.615a1.577,1.577,0,0,0,1.577,1.577h6.308a1.577,1.577,0,0,0,1.577-1.577V6.154H5.788Z" transform="translate(-5 -3)"/></svg><div>Removed Gift</div>';

    popup.classList.remove("hidden");
    popup.classList.add("show");

    this.removePopUp(popup);
  }

  sortMyItems() {
    //console.log("sort guests items")
    this.guestsItems = [];
    let guestName = this.GuestService.getGuestName();
    this.searchRegistry.forEach(item => {
      let data = item.payload.doc.data();
      //console.log(data.name, guestName)
      if (data.guest == guestName) {
        this.guestsItems.push(item);
      }
    })
  }


}
