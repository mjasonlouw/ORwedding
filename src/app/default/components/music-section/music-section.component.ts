import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SpotifyService } from 'src/app/spotify.service';

@Component({
  selector: 'app-music-section',
  templateUrl: './music-section.component.html',
  styleUrls: ['./music-section.component.scss']
})
export class MusicSectionComponent implements OnInit {
  musicFilter: FormGroup
  guestSongs = null;

  constructor(
    private formBuilder: FormBuilder,
    private spotify: SpotifyService) {

    this.musicFilter = this.formBuilder.group({
      categories: new FormArray([])
    });

  }

  ngOnInit(): void {

  }

  // ngOnInit(): void {






    
  //   // TODO Replace with spotify integration codey bois
  //   this.guestSongs = [
  //     {
  //       name: "testSong",
  //       artist: "test artist",
  //       imgUrl: "https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg",
  //     },
  //     {
  //       name: "testSong2222",
  //       artist: "test artist",
  //       imgUrl: "https://media.architecturaldigest.com/photos/5890e88033bd1de9129eab0a/1:1/w_870,h_870,c_limit/Artist-Designed%20Album%20Covers%202.jpg",
  //     }
  //   ]
  // }

  public onSearchKeyUp(event): void {
    const searchString = event.target.value;
    this.searchSpotify(searchString)
  }

  public async searchSpotify(searchString: string) {
  //   // Do cool searching stuff - TODO Implement spotify search
     
    
  this.guestSongs = await this.spotify.searchSong(searchString)

  }

  addSong(uri){
    console.log('adding song',uri)
    this.spotify.addSongToPlayList(uri);
  }

}
