import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CodeMirrorComponent } from './codemirror.component';

@NgModule({
    imports: [CommonModule],
    declarations: [CodeMirrorComponent],
    entryComponents: [CodeMirrorComponent],
    exports: [CodeMirrorComponent]
})
export class CodemirrorModule {}
