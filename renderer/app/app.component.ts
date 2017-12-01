import { Component, OnInit, VERSION } from '@angular/core';
import { Title } from '@angular/platform-browser';

import * as packageData from '../../package.json';

import 'electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  sideBarWidth = 100;
  constructor(
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Excel Data Search Tool v' + packageData['version']);
  }

}
