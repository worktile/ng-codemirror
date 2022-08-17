import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CodeMirrorComponent } from "ng-codemirror/ng-codemirror";
import { CodeLanguages, CODE_BLOCK_LANGUAGES, DEFAULT_LANGUAGE } from "./constants/codemirror";

@Component({
    selector: 'demo-code-block',
    template: `
        <div class="global-toolbar">
                <nz-select class="select-mode" nzShowSearch [(ngModel)]="mode" (ngModelChange)="modeChange($event)">
                <nz-option [nzValue]="item.value" [nzLabel]="item.name" *ngFor="let item of modeOptions"></nz-option>
                </nz-select>
                <label class="ml-4" nz-checkbox [(ngModel)]="options.readOnly" (ngModelChange)="toggleReadonly($event)">readonly</label>
        </div>
        <ng-codemirror *ngIf="!loading" #codemirrorComponent [options]="options" [ngModel]="code"></ng-codemirror>
    `,
    encapsulation: ViewEncapsulation.None,
    host: {
        ['class']: 'demo-codemirror'
    }
})
export class CodeBlockComponent implements OnInit {
    options = {
        lineNumbers: true,
        readOnly: false, // nocursor can not copy
        mode: 'javascript',
        autofocus: true,
        lineWiseCopyCut: true,
        cursorBlinkRate: 500 // hide cursor
    };
    code = initializeCode;

    mode = DEFAULT_LANGUAGE.value;
    modeOptions = [...CODE_BLOCK_LANGUAGES];

    loading = false;

    isDialog = false;

    modeChange(mode: CodeLanguages) {
        Object.assign({}, this.options, { mode: mode.toString() });
        this.options = { ...this.options, mode };
    }

    @ViewChild('codemirrorComponent')
    codemirrorComponent: CodeMirrorComponent

    constructor(private cdr: ChangeDetectorRef) { }

    toggleReadonly(checked) {
        if (checked) {
            this.options = { ...this.options, readOnly: true, cursorBlinkRate: -1 };
        } else {
            this.options = { ...this.options, readOnly: false, cursorBlinkRate: 500 };
        }
    }

    ngOnInit(): void {
        // test dialog case
        if (this.isDialog) {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
            }, 100);
        } else {
            this.loading = false;
        }
    }
}


const initializeCode = `ResponseData<PageInfo, { relation_pages: TheRelationPages; members: MemberInfo[]; space: SpaceInfo; discussions: DiscussionInfo[] }>ResponseData<PageInfo, { relation_pages: TheRelationPages; members: MemberInfo[]; space: SpaceInfo; discussions: DiscussionInfo[] }>
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-codemirror';
  options = {
    lineNumbers: true,
    readOnly: false, // nocursor can not copy
    mode: 'javascript',
    autofocus: true,
    lineWiseCopyCut: true,
    // cursorBlinkRate: -1 // hide cursor
  };
  code = initializeCode;
}`;
