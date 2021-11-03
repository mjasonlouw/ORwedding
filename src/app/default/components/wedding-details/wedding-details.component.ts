import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-wedding-details',
  templateUrl: './wedding-details.component.html',
  styleUrls: ['./wedding-details.component.scss']
})
export class WeddingDetailsComponent implements OnInit {
  @Output() changePageTo = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  changePage(page){
      this.changePageTo.emit(page)
  }
}
