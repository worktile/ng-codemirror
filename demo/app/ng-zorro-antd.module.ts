
import { NgModule } from '@angular/core';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
  exports: [
    NzCheckboxModule,
    NzSelectModule
  ]
})
export class DemoNgZorroAntdModule {

}
