import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CodeMirrorComponent, selectableLanguages } from "ng-codemirror";
import { CodeLanguages, DEFAULT_LANGUAGE } from "./constants/codemirror";

@Component({
    selector: 'demo-code-block',
    template: `
        <div class="global-toolbar">
            <nz-select class="select-mode" nzShowSearch [(ngModel)]="mode" (ngModelChange)="modeChange($event)">
                <nz-option [nzValue]="item.value" [nzLabel]="item.name" *ngFor="let item of modeOptions"></nz-option>
            </nz-select>
            <nz-select class="ml-4 " nzShowSearch [(ngModel)]="lineNumber" (ngModelChange)="lineNumberChange($event)">
                <nz-option [nzValue]="item.value" [nzLabel]="item.name" *ngFor="let item of lineNumberOptions"></nz-option>
            </nz-select>
            <nz-select class="ml-4 " nzShowSearch [(ngModel)]="lineWrap" (ngModelChange)="lineWrapChange($event)">
                <nz-option [nzValue]="item.value" [nzLabel]="item.name" *ngFor="let item of lineWrapOptions"></nz-option>
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
        lineWrapping: false,
        cursorBlinkRate: 500 // hide cursor
    };

    lineNumber = true;

    lineWrap = false;

    code = initializeCode;

    mode = DEFAULT_LANGUAGE.value;

    lineNumberOptions = [{ name: '展示 lineNumber', value: true }, { name: '不展示 lineNumber', value: false }];

    lineWrapOptions = [{ name: '代码超出滚动', value: false }, { name: '代码超出折行', value: true }];

    modeOptions = [...selectableLanguages];

    loading = false;

    isDialog = false;

    modeChange(mode: CodeLanguages) {
        Object.assign({}, this.options, { mode: mode.toString() });
        this.options = { ...this.options, mode };
    }

    lineNumberChange(lineNumber: boolean) {
        this.options = { ...this.options, lineNumbers: lineNumber };
    }

    lineWrapChange(lineWrap: boolean) {
        this.options = { ...this.options, lineWrapping: lineWrap };
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
