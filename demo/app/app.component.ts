import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CodeBlockComponent } from './code.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent {
  title = 'ng-codemirror';

  constructor(private modalService: NzModalService) { }

  openDialog() {
    this.modalService.create({
      nzTitle: 'Dialog Codemirror',
      nzContent: CodeBlockComponent,
      nzWidth: 800,
      nzData: {
        isDialog: true
      }
    });
  }
}

