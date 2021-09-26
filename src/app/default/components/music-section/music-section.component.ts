import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-music-section',
  templateUrl: './music-section.component.html',
  styleUrls: ['./music-section.component.scss']
})
export class MusicSectionComponent implements OnInit {
  musicFilter: FormGroup
  guestSongs = new Array();

  constructor(
    private formBuilder: FormBuilder) {

    this.musicFilter = this.formBuilder.group({
      categories: new FormArray([])
    });

  }

  ngOnInit(): void {
    // TODO Replace with spotify integration codey bois
    this.guestSongs = [
      {
        name: "testSong",
        artist: "test artist",
        imgUrl: "https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg",
      },
      {
        name: "testSong2222",
        artist: "test artist",
        imgUrl: "https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg",
      }
    ]
  }

  public onSearchKeyUp(event): void {
    const searchString = event.target.value;
    this.searchSpotify(searchString)
  }

  public searchSpotify(searchString: string): void {
    // Do cool searching stuff - TODO Implement spotify search
  }

}
