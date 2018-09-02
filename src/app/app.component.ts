import { Component } from '@angular/core';
import { ElectronService } from '../../node_modules/ngx-electron';
import {Song} from './Song';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  state = false;
  songName = 'Unknown Title';
  artistName = 'Unknown Artist';
  cursor = 0;
  audio;
  songList: Song[] = [];
  constructor(private _electronService: ElectronService) {
    this.songList[this.cursor] = new Song(this.songName, this.artistName, `file://${__dirname}/assets/summer-rain.mp3`);
    this.audio = new Audio();
    this.audio.src = this.songList[this.cursor].filePath;
    this.audio.load();
  }

  playAndPause() {
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
    } else {
      const file = newSong.filePath + '';
      this.songName = file.substr(file.lastIndexOf('\\') + 1, file.length - 1);
      this.artistName = 'Unknown Artist';
      s = new Song(this.songName, this.artistName, newSong.filePath);
    }
    this.songList.push(s);
    this.audio = new Audio();
    this.cursor = this.songList.length - 1;
    this.audio.src = this.songList[this.cursor].filePath;
    this.audio.load();
  }

  /**
   * Moves to the next song
   */
  next() {
    if (this.state) { this.playAndPause(); }
    this.audio = new Audio();
    if (++this.cursor === this.songList.length) { this.cursor = 0; }
    this.audio.src = this.songList[this.cursor].filePath;
    this.changeInformation();
    this.audio.load();
  }

  /**
   * Moves to the previous song
   */
  prev() {
    if (this.state) { this.playAndPause(); }
    this.audio = new Audio();
    if (--this.cursor < 0) { this.cursor = this.songList.length - 1; }
    this.audio.src = this.songList[this.cursor].filePath;
    this.changeInformation();
    this.audio.load();
  }

  /**
   * Changes the information of the song in frontend
   */
  changeInformation() {
    this.songName = this.songList[this.cursor].title;
    this.artistName = this.songList[this.cursor].artist;
  }

  /**
   * Helper function to check if a javascript object
   * is empty
   * @param obj javacript object
   */
  isEmpty(obj) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
    }
    return true;
  }
}
