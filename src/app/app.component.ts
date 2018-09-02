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
    if (!newSong) { return; }
    this.audio = new Audio();
    this.audio.src = newSong;
    this.audio.load();
  }
}
