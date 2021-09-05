import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { $ } from 'protractor';
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
  registry = [];
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

    document.addEventListener('scroll', function(e) {
        var position = window.pageYOffset;

        if(position != 0) {
          if(document.getElementsByClassName("filtering_wrapper")[0].classList.contains("at_top")) {
            document.getElementsByClassName("filtering_wrapper")[0].classList.remove("at_top");
            document.getElementsByClassName("filtering_wrapper")[0].classList.add("scrolling");

            document.getElementsByClassName("search_box")[0].classList.remove("at_top_search");
            document.getElementsByClassName("search_box")[0].classList.add("on_scroll_search");

            document.getElementsByClassName("filters_button")[0].classList.add("on_scroll_button");
          }
        } else {
          if(document.getElementsByClassName("filtering_wrapper")[0].classList.contains("scrolling")) {
            document.getElementsByClassName("filtering_wrapper")[0].classList.remove("scrolling");
            document.getElementsByClassName("filtering_wrapper")[0].classList.add("at_top");

            document.getElementsByClassName("search_box")[0].classList.remove("on_scroll_search");
            document.getElementsByClassName("search_box")[0].classList.add("at_top_search");

            document.getElementsByClassName("filters_button")[0].classList.remove("on_scroll_button");
          }
        }
    });
  }

  get ordersFormArray() {
    return this.categoryFilter.controls.categories as FormArray;
  }

  openFilters() {
    if (document.getElementsByClassName("filter_wrapper")[0].classList.contains("opened")) {
      document.getElementsByClassName("filter_wrapper")[0].classList.remove("opened");
      document.getElementsByClassName("filter_wrapper")[0].classList.add("closed");

      document.getElementsByClassName("filter")[0].classList.add("swipeUp");
      document.getElementsByClassName("filter")[0].classList.remove("swipeUpAway");
      document.getElementsByClassName("close")[0].classList.add("swipeUpAway");
      document.getElementsByClassName("close")[0].classList.remove("swipeUp");
    } else {
      document.getElementsByClassName("filter_wrapper")[0].classList.remove("closed");
      document.getElementsByClassName("filter_wrapper")[0].classList.add("opened");

      document.getElementsByClassName("filter")[0].classList.add("swipeUpAway");
      document.getElementsByClassName("filter")[0].classList.remove("swipeUp");
      document.getElementsByClassName("close")[0].classList.add("swipeUp");
      document.getElementsByClassName("close")[0].classList.remove("swipeUpAway");
    }
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

      var popup = document.getElementsByClassName("added_popup_wrapper")[0];
      document.getElementsByClassName("added_popup_information")[0].innerHTML = "Added";

      popup.classList.remove("hidden");
      popup.classList.add("show");

      this.removePopUp(popup);

    }
  }

  removeGuestItem(item) {
    this.RegistryService.removeGuestFromItem(item)
    this.sortMyItems()

    var popup = document.getElementsByClassName("added_popup_wrapper")[0];
    document.getElementsByClassName("added_popup_information")[0].innerHTML = "Removed";

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
