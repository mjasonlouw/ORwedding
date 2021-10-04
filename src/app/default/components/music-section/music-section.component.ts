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
    document.getElementsByClassName("added_popup_information_music")[0].innerHTML = "Added";

    popup.classList.remove("hidden");
    popup.classList.add("show");

    this.removePopUp(popup);
    this.spotify.addSongToPlayList(song);
  }

  removeSong(song){
    var popup = document.getElementsByClassName("added_popup_wrapper_music")[0];
    document.getElementsByClassName("added_popup_information_music")[0].innerHTML = "Removed";

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
