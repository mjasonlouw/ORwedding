import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { GuestService } from './guest.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  accessToken = ''
  playlistId = ''
  gname = ''

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,private firestore: AngularFirestore, private guestService: GuestService) {
    this.setup()
  }

  setup() {
    console.log('setting up spotify')
    const ClientID = 'e95e0f190188465cbb1fd5f53e814131'
    const ClientSecret = 'cb9a661e09d04e9d816414f368344599'
    const spotifyUrl = `https://accounts.spotify.com/authorize`

    const angularAppUrl = location.protocol + '//' + location.host
    const returnUrl = angularAppUrl + this.router.url

    console.log('returnUrl', returnUrl)
    // &scope=${encodeURIComponent('playlist-modify-private playlist-modify-public')}
    let spotifyAuth = `${spotifyUrl}?client_id=${ClientID}&response_type=code&redirect_uri=${encodeURIComponent(returnUrl)}`
    console.log('spotifyAuth', spotifyAuth)

    let code = `AQBcKicE5cWX80Cp7cr14z-adKema5P_UfRdS-gQVz0wq3wice4p-n2QVuifHCicioHOwW063Odf35EywGdz2ztCOIziG3ToQfRXH0itR-bbzjwKi4yjc6LdY3650bmABsmquMn6JmuFPbBuoLy7yX3BNHJ4tCy5_RRI5DPocfiWiBo`

    let headers = new HttpHeaders({
      'Authorization': `Basic ${btoa(`${ClientID}:${ClientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded'

    });
    let options = { headers: headers };

    let dataJson = {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: encodeURIComponent(returnUrl),
      client_id: ClientID,
      client_secret: ClientSecret,
    }

    let refreshToken = "AQCl1efi7JmGqjS4x01PSh5PhFiQyoOjYx2cWZpVIUufpsPUWFmeWg1-OWeMy13fqkr7RUvbFAxU326-bqffkpTiL80M1ZbQl4oSPSzL5TLb1_vTZLQEh4KGZoWVjuwGYoU";

    let t = "BQATZEPA_d89lMvIWsOcjPUb_VAoPfwQvzt_3ZIVOevImhcPyPv6AJ_HiH27kGe1klvYnhWTB8x6EjPopeWLmloZp1KNUOoPs1NZlZM4HQnj2seKgEghDBKo2vROTC-ewwov9PXzDMqFzTUyFJMIyM17miw8jpN5KKvI30ijdK9Wwb2-bVa1wmvMs2NKIorG8NGKnuoZkAUovlHKXBIGVFIkfwRMMYnoUTE"

    let refreshBody = `grant_type=refresh_token&refresh_token=${refreshToken}`

    this.http.post(`https://accounts.spotify.com/api/token`, refreshBody, options).subscribe(data => {
      console.log('refreshed token', data)
      this.accessToken = data['access_token'];
      this.searchSong('sexy t')
      this.getPlayListId()
    })

  }

  async searchSong(song) {
    return new Promise((res, err) => {

      let results = [];

      let headers = new HttpHeaders({
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'

      });

      let options = { headers: headers };

      this.http.get(`https://api.spotify.com/v1/search?Authorization=${this.accessToken}&q=${song}&type=track`, options).subscribe(data => {
        console.log('data', data)

        data['tracks'].items.forEach(track => {

          let ar = ''
          track.artists.forEach(arti => {
            if (ar != '')
              ar += ', ' + arti.name
            else
              ar += arti.name
          })



          let trackJson = {
            album: track.album.name,
            name: track.name,
            artist: ar,
            imgUrl: track.album.images[1].url,
            id: track.id,
            uri: track.uri
          }

          console.log('trackJson', trackJson)

          results.push(trackJson)
        });


      })
      res(results)
    })

  }


  async getPlayListId() {
    return new Promise((res, err) => {

      let results = [];

      let headers = new HttpHeaders({
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'

      });

      let options = { headers: headers };

      this.http.get(`https://api.spotify.com/v1/me/playlists?Authorization=${this.accessToken}`, options).subscribe(data => {
        console.log('data', data)   
        
        data['items'].forEach(playlist => {
          if(playlist.name == "Wedding Song Requests"){
            this.playlistId = playlist.id
            console.log('playlist id: ', this.playlistId)
            res(playlist.id)
          }
        });
      })
      
    })
  }

  async addSongToPlayList(song){

    let guestName = this.guestService.getGuestName()

    console.log('guestNameSpotify',guestName,song)
    if(guestName != ''){
      song['user'] = guestName;
      this.firestore.collection('songs').add(song)
    }


    console.log("attempting to add song")

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+this.accessToken
    });

    let options = { headers: headers };

    let dataJson = {
      uris: [song.uri],
      position: 0
    }

    let refreshToken = "AQCl1efi7JmGqjS4x01PSh5PhFiQyoOjYx2cWZpVIUufpsPUWFmeWg1-OWeMy13fqkr7RUvbFAxU326-bqffkpTiL80M1ZbQl4oSPSzL5TLb1_vTZLQEh4KGZoWVjuwGYoU";

    let refreshBody = `grant_type=refresh_token&refresh_token=${refreshToken}`

    this.http.post(`https://api.spotify.com/v1/playlists/${this.playlistId}/tracks`, dataJson, options).subscribe(data => {
      console.log('added song to platlist', data)
    })
  }

  getAllSongs() {
    
    return this.firestore.collection("songs").snapshotChanges()
  }

  removeSong(song){
    this.firestore.collection('songs').doc(song.payload.doc.id).delete()
  }
}
