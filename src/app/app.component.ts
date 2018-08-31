import { Component } from '@angular/core';
import {ipcRenderer} from 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  /*closeWindow() {
    ipcRenderer.send('close_window');
  }*/
}
