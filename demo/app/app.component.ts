import { Component } from '@angular/core';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import { NzModalService } from 'ng-zorro-antd';
import { CodeBlockComponent } from './code.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'ng-codemirror';

  constructor(private modalService: NzModalService) {}

  openDialog() {
    this.modalService.create({
      nzTitle: 'Dialog Codemirror',
      nzContent: CodeBlockComponent,
      nzWidth: 800,
      nzComponentParams: {
        isDialog: true
      }
    });
  }
}

