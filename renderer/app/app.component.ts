import { Component, OnInit, VERSION } from '@angular/core';
import { Title } from '@angular/platform-browser';

import * as packageData from '../../package.json';

import 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  versions = {
    angular: VERSION.full,
    electron: process.versions.electron,
    primeng: packageData['devDependencies']['primeng'],
    bulma: packageData['devDependencies']['bulma']
  }

  constructor(
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Angular + Bulma + Electron + PrimeNG v' + packageData['version']);
  }
}
