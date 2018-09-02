import { Component } from '@angular/core';
import { ElectronService } from '../../node_modules/ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  state = false;
  songName = 'Unknown Title';
  artistName = 'Unknown Artist';
  audio;
  constructor(private _electronService: ElectronService) {
    this.audio = new Audio();
    this.audio.src = `file://${__dirname}/assets/summer-rain.mp3`;
    this.audio.load();
  }

  playAndPause() {
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

  chooseSong() {
    if (this.state) {
      this.playAndPause();
    }
    const newSong = this._electronService.ipcRenderer.sendSync('open-file-system');
    if (!newSong.filePath) { return; }
    window.alert(newSong.tag);
    if (!this.isEmpty(newSong.tag.tags)) {
      this.songName = newSong.tag.title;
      this.artistName = newSong.tag.artist;
    } else {
      this.songName = 'Unknown Title';
      this.artistName = 'Unknown Artist';
    }
    this.audio = new Audio();
    this.audio.src = newSong.filePath;
    this.audio.load();
  }

  isEmpty(obj) {
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          return false;
        }
    }
    return true;
  }
}
