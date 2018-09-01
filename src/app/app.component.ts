import { Component } from '@angular/core';
import { ElectronService } from '../../node_modules/ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  state = false;
  constructor(private _electronService: ElectronService) {}

  changeButton() {
    this.state = !this.state;
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
}
