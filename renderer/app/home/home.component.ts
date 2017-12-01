import { Component } from '@angular/core';

import * as packageData from '../../../package.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  pData = packageData;
  constructor() { }

}
