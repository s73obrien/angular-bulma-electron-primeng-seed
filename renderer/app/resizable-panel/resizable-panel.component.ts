import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  Renderer2,
} from '@angular/core';

import { MatIcon } from '@angular/material';

@Component({
  selector: 'app-resizable-panel',
  template: `
  <div>
    <div #insert>
      <ng-content></ng-content>
    </div>
  </div>
  `,
  entryComponents: [MatIcon],
  styles: []
})
export class ResizablePanelComponent implements OnInit {
  @ViewChild('insert', { read: ViewContainerRef }) insert: ViewContainerRef;
  constructor(
    private cfr: ComponentFactoryResolver,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    const iconFactory = this.cfr.resolveComponentFactory(MatIcon);

    this.insert.createComponent(iconFactory, this.insert.length, null, [
      [this.renderer.createText('keyboard_arrow_right')]
    ]);


  }
}
