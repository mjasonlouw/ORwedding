import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { SpotifyService } from 'src/app/spotify.service';
import { GuestService } from '../../../guest.service';

@Component({
  selector: 'app-music-section',
  templateUrl: './music-section.component.html',
  styleUrls: ['./music-section.component.scss']
})
export class MusicSectionComponent implements OnInit {
  musicFilter: FormGroup
  guestSongs = null;
  searchResults = null;
  gname = '';
  hasSearched = false; 

  constructor(
    private formBuilder: FormBuilder,
    private spotify: SpotifyService,
    private guestService: GuestService) {

    this.musicFilter = this.formBuilder.group({
      categories: new FormArray([])
    });
    this.getRegistry()
  }

  ngOnInit(): void {

  }

  public onSearchKeyUp(event): void {
    const searchString = event.target.value;
    if(searchString.length > 0) {
      this.hasSearched = true;
    } else {
      this.hasSearched = false; 
    }
    this.searchSpotify(searchString)
  }

  public async searchSpotify(searchString: string) {
    this.searchResults = await this.spotify.searchSong(searchString)
  }

  addSong(song){
    var popup = document.getElementsByClassName("added_popup_wrapper_music")[0];
    document.getElementsByClassName("added_popup_information_music")[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 20 18.35"><path id="cards-heart" d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.27,2,8.5A5.44,5.44,0,0,1,7.5,3,6.014,6.014,0,0,1,12,5.08,6.014,6.014,0,0,1,16.5,3,5.44,5.44,0,0,1,22,8.5c0,3.77-3.4,6.86-8.55,11.53Z" transform="translate(-2 -3)"/></svg><div>Requested</div>';

    popup.classList.remove("hidden");
    popup.classList.add("show");

    this.removePopUp(popup);
    this.spotify.addSongToPlayList(song);
  }

  removeSong(song){
    var popup = document.getElementsByClassName("added_popup_wrapper_music")[0];
    
    document.getElementsByClassName("added_popup_information_music")[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="21" height="19" viewBox="0 0 21 19"><path id="heart-off" d="M1,4.27,2.28,3,20,20.72,18.73,22l-3.55-3.56-1.73,1.59L12,21.35l-1.45-1.32C5.4,15.36,2,12.27,2,8.5a5.611,5.611,0,0,1,.63-2.6L1,4.27M7.5,3A6.014,6.014,0,0,1,12,5.08,6.014,6.014,0,0,1,16.5,3,5.44,5.44,0,0,1,22,8.5c0,2.57-1.58,4.82-4.21,7.47L5.27,3.45A5.657,5.657,0,0,1,7.5,3Z" transform="translate(-1 -3)"/></svg><div>Removed Song</div>';

    popup.classList.remove("hidden");
    popup.classList.add("show");

    this.removePopUp(popup);
    this.spotify.removeSong(song)
  }

  getRegistry() {
    this.spotify
      .getAllSongs()
      .subscribe(res => {
        // res.forEach(item => {
        //   
        //   console.log('song data',data)
        // })
        this.gname = this.guestService.getGuestName()
        this.guestSongs = res.filter(song => song.payload.doc.data()["user"] == this.gname);
   
      });
  }

  removePopUp(popup) {
    setTimeout(function () {
      popup.classList.remove("show");
      popup.classList.add("hidden");
    }, 3000);
  }
}
