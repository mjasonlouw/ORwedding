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
    if (pageName == 'registry') {

    } else {
      this.pageToShow = pageName;

      this.slideBitch(pageName)
    }
  }

  async slideBitch(pageName){


    setTimeout(() => {
      console.log(`.${pageName}Container`)

      const per = document.querySelector(`.${pageName}Container`);
      per.scrollIntoView({behavior: 'smooth'})
    }, 10);
  }




}
