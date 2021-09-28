import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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

