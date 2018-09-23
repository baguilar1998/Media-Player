import { Injectable } from '@angular/core';
import { Subject } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  currentSongName = 'Unknown Title';
  songNameChanged: Subject<string> = new Subject<string>();

  currentArtist = 'Unknown Artist';
  artistChanged: Subject<string> = new Subject<string>();

  constructor() { }

  setSongName(song: string) {
    this.currentSongName = song;
    this.songNameChanged.next(song);
  }

  setArtist(artist: string) {
    this.currentArtist = artist;
    this.artistChanged.next(artist);
  }

  getCurrentSongName(): string {
    return this.currentSongName;
  }

  getCurrentArtist(): string {
    return this.currentArtist;
  }
}
