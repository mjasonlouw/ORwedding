import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  ngOnInit(): void { }

  pageToShow = 'rsvp';

  changePageTo(pageName) {
    console.log('clicking')
    console.log(pageName)
  
      this.pageToShow = pageName;

      this.slideBitch(pageName)
    
  }

  async slideBitch(pageName){


    setTimeout(() => {
      console.log(`.${pageName}Container`)

      const per = document.querySelector(`.${pageName}Container`);
      per.scrollIntoView({behavior: 'smooth'})
    }, 10);
  }


  openMainMenu() {
    var menu = document.getElementsByClassName("menu_dropdown_wrapper")[0]; 
    var menu_items = document.getElementsByClassName("main_menu_item"); 

    if (menu.classList.contains("closed")) {
      menu.classList.remove("closed");
      menu.classList.add("open");

      for(var i = 0; i<menu_items.length; i++) {
        menu_items[i].classList.remove("fade_out");
      }

      for(var i = 0; i<menu_items.length; i++) {
        menu_items[i].classList.add("fade_in");
      }

      document.getElementsByClassName("open_menu")[0].classList.add("fade_out");
      document.getElementsByClassName("close_menu")[0].classList.add("fade_in");

      document.getElementsByClassName("open_menu")[0].classList.remove("fade_in");
      document.getElementsByClassName("close_menu")[0].classList.remove("fade_out");

    } else {
      menu.classList.remove("open");
      menu.classList.add("closed");

      for(var i = 0; i<menu_items.length; i++) {
        menu_items[i].classList.remove("fade_in");
      }

      for(var i = 0; i<menu_items.length; i++) {
        menu_items[i].classList.add("fade_out");
      }

      document.getElementsByClassName("open_menu")[0].classList.add("fade_in");
      document.getElementsByClassName("close_menu")[0].classList.add("fade_out");

      document.getElementsByClassName("open_menu")[0].classList.remove("fade_out");
      document.getElementsByClassName("close_menu")[0].classList.remove("fade_in");
    }
  }

}
