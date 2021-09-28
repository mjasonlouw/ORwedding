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
  gname = ''

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
    this.searchSpotify(searchString)
  }

  public async searchSpotify(searchString: string) {
    this.searchResults = await this.spotify.searchSong(searchString)
  }

  addSong(song){
    console.log('adding song',song)
    this.spotify.addSongToPlayList(song);
  }

  removeSong(song){
    console.log('removing component')
    this.spotify.removeSong(song)
  }

  getRegistry() {
    this.spotify
      .getAllSongs()
      .subscribe(res => {
        console.log(res)
        // res.forEach(item => {
        //   let data = item.payload.doc.data();
        //   console.log('song data',data)
        // })
        this.gname = this.guestService.getGuestName()
        this.guestSongs = res;
   
      });
  }

}
