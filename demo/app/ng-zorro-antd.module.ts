
import { NgModule } from '@angular/core';
import { NzButtonModule, NzModalModule } from 'ng-zorro-antd';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';

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
