
import { NgModule } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  exports: [
    NzCheckboxModule,
    NzSelectModule,
    NzButtonModule,
    NzModalModule
  ]
})
export class DemoNgZorroAntdModule {

}
