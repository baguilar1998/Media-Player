import { Component, OnInit, DoCheck } from '@angular/core';
import { ElectronService } from '.../../node_modules/ngx-electron';
import { Song } from '../Song';
import { Subject } from '../../../node_modules/rxjs';
import { MusicService } from '../services/music.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, DoCheck {
  // Play/Pause state variable
  state = false;


  // Song Name
  songName =  this.musicService.getCurrentSongName();
  songNameSub;

  // Artist Name
  artistName = this.musicService.getCurrentArtist();
  artistSub;

  currentArt = `file://${__dirname}/assets/unknown_song.jpg`;

  // The current audio that will be played
  audio;

  // Stores a list of songs
  songList: Song[] = [];
  cursor;
  position = 0;

  constructor(private _electronService: ElectronService, private musicService: MusicService) {
    this.songNameSub = this.musicService.songNameChanged.subscribe(data => this.songName = data);
    this.artistSub = this.musicService.artistChanged.subscribe(data => this.artistName = data);
  }

  ngOnInit() {
    this.audio = new Audio();
    this.audio.onended = this.songEnded.bind(this);
    this.audio.ontimeupdate = this.handleTimeUpdate.bind(this);
  }

  ngDoCheck() {
    if (this.audio.ended) { console.log('song ended'); }
   /* if ( this.songName !== this.musicService.getCurrentSongName()) {
      this.musicService.setSongName(this.songName);
      console.log('song has been changed');
    }*/
  }

  /**
   * Plays/Pauses the song
   */
  playAndPause() {
    if (this.songList.length === 0) { return; }
    this.state = !this.state;
    if (!this.state) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
  }

  /**
   * Minimizes the window
   */
  minimizeWindow() {
    this._electronService.ipcRenderer.send('minimize');
  }

  /**
   * Closes the main window
   */
  closeWindow() {
    this._electronService.ipcRenderer.send('close_window');
  }

  /**
   * Changes the song based on the file that
   * the user chooses
   */
  chooseSong() {
    let s;
    if (this.state) {
      this.playAndPause();
    }
    const newSong = this._electronService.ipcRenderer.sendSync('open-file-system');
    if (!newSong.filePath) { return; }
    if (newSong.information.title !== '') {
      this.songName = newSong.information.title;
      this.artistName = newSong.information.artist[0];
      s = new Song(this.songName, this.artistName, newSong.filePath);
      // s.setAlbumArt('data:image/jpg;base64,' + newSong.information.picture[0].data.toString());
      s.setAlbumArt(`file://${__dirname}/assets/unknown_song.jpg`);
    } else {
      const file = newSong.filePath + '';
      this.songName = file.substr(file.lastIndexOf('\\') + 1, file.length - 1);
      this.artistName = 'Unknown Artist';
      s = new Song(this.songName, this.artistName, newSong.filePath);
      s.setAlbumArt(`file://${__dirname}/assets/unknown_song.jpg`);
    }
    this.songList.push(s);
    this.cursor = this.songList.length - 1;
    this.audio.src = this.songList[this.cursor].filePath;
    this.currentArt = s.albumArt;
    this.audio.load();
    this.playAndPause();
    // this.audio.onended = this.songEnded.bind(this);
    this.audio.ontimeupdate = this.handleTimeUpdate.bind(this);
    this.closeNav();
  }

  /**
   * Moves to the next song
   */
  next() {
    if (this.state) { this.playAndPause(); }
    if (++this.cursor === this.songList.length) { this.cursor = 0; }
    this.changeAudio();
    this.playAndPause();
  }

  /**
   * Moves to the previous song
   */
  prev() {
    if (this.state) { this.playAndPause(); }
    if (--this.cursor < 0) { this.cursor = this.songList.length - 1; }
    this.changeAudio();
    this.playAndPause();
  }

  /**
   * Changes the information of the song in frontend
   */
  private changeInformation() {
    this.musicService.setSongName(this.songList[this.cursor].title);
    this.musicService.setArtist(this.songList[this.cursor].artist);
    this.currentArt = this.songList[this.cursor].albumArt;
  }

  private changeAudio() {
    this.audio.src = this.songList[this.cursor].filePath;
   // this.audio.onended = this.songEnded.bind(this);
    this.audio.ontimeupdate = this.handleTimeUpdate.bind(this);
    this.changeInformation();
    this.audio.load();
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginLeft = '250px';
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
  }

  songEnded() {
    this.next();
  }

  handleTimeUpdate(e) {
    const elapsed =  this.audio.currentTime;
    const duration =  this.audio.duration;
    this.position = ((elapsed / duration) * 100);
  }
}
