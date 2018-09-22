import { Component, OnInit } from '@angular/core';
import { ElectronService } from '.../../node_modules/ngx-electron';
import { Song } from '../Song';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  state = false;
  // Keeps track of the seekbar
  position = 1;
  songName = 'Unknown Title';
  artistName = 'Unknown Artist';
  currentArt = `file://${__dirname}/assets/unknown_song.jpg`;
  cursor;
  audio;
  songList: Song[] = [];
 // seekerSlider = document.getElementById('songseeker') as HTMLInputElement;
  // seeking;
  // seekto;

  constructor(private _electronService: ElectronService) {}

  ngOnInit() {
    this.audio = new Audio();
    this.audio.onended = this.songEnded.bind(this);
    this.audio.ontimeupdate = this.handleTimeUpdate.bind(this);
  }

  /**
   * Plays/Pauses the song
   */
  playAndPause() {
    if (this.songList.length === 0) { return; }
    this.state = !this.state;
    if (!this.state) {
      this.audio.pause();
      // CODE TO BE IMPLEMENTED TO STOP THREAD
    } else {
      this.audio.play();
      // CODE TO BE IMPLEMENTED TO START
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
    this.audio.onended = this.songEnded.bind(this);
    this.audio.ontimeupdate = this.handleTimeUpdate.bind(this);
    this.closeNav();
  }

  /**
   * Moves to the next song
   */
  next() {
    if (this.state) { this.playAndPause(); }
    if (++this.cursor === this.songList.length) { this.cursor = 0; }
    this.audio.src = this.songList[this.cursor].filePath;
    this.changeInformation();
    this.audio.load();
    this.audio.onended = this.songEnded.bind(this);
    this.audio.ontimeupdate = this.handleTimeUpdate.bind(this);
    this.playAndPause();
  }

  /**
   * Moves to the previous song
   */
  prev() {
    if (this.state) { this.playAndPause(); }
    if (--this.cursor < 0) { this.cursor = this.songList.length - 1; }
    this.audio.src = this.songList[this.cursor].filePath;
    this.changeInformation();
    this.audio.load();
    this.audio.onended = this.songEnded.bind(this);
    this.audio.ontimeupdate = this.handleTimeUpdate.bind(this);
    this.playAndPause();
  }

  /**
   * Changes the information of the song in frontend
   */
  changeInformation() {
    this.songName = this.songList[this.cursor].title;
    this.artistName = this.songList[this.cursor].artist;
    this.currentArt = this.songList[this.cursor].albumArt;
  }

  openNav() {
    document.getElementById('mySidenav').style.width = '250px';
    document.getElementById('main').style.marginLeft = '250px';
  }

  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
  }

  songEnded(event) {
    this.next();
  }

  handleTimeUpdate(e) {
    const elapsed =  this.audio.currentTime;
    const duration =  this.audio.duration;
    this.position = elapsed / duration;
  }
}
