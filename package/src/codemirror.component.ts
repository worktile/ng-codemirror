import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  NgZone,
  ChangeDetectionStrategy,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  Renderer2
} from '@angular/core';
import * as codemirror from 'codemirror';
import { take, debounceTime, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HostBinding } from '@angular/core';

@Component({
  selector: 'ng-code-mirror, [ngCodeMirror]',
  template: `
      <textarea #textAreaRef></textarea>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeMirrorComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() code: string;

  @Input() mode: string;

  @Input() readOnly = false;

  @Input() autoFocus = false;

  @Input() maxHeight = 350;

  @Input() fixedHeight = true;

  @Output() codeChange: EventEmitter<string> = new EventEmitter();

  @Output() focusChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('textAreaRef', { read: ElementRef, static: true }) textAreaRef: ElementRef;

  @HostBinding('class.ng-codemirror') codemirrorClassName = true;

  codeChange$: Subject<string> = new Subject();

  public editor: codemirror.EditorFromTextArea;

  constructor(private elementRef: ElementRef, private ngZone: NgZone, private renderer: Renderer2) {}

  ngOnInit() {
      this.codeChange$.pipe(debounceTime(100)).subscribe(() => {
          this.ngZone.run(() => {
              const value = this.editor.getValue();
              this.codeChange.emit(value);
          });
      });
  }

  ngAfterViewInit() {
      if (this.elementRef.nativeElement.offsetWidth > 0) {
          this.initCodemirror();
          this.renderer.setStyle(this.elementRef.nativeElement, 'maxHeight', `${this.maxHeight}px`);
      } else {
          this.ngZone.onStable
              .asObservable()
              .pipe(
                  filter(() => {
                      return this.elementRef.nativeElement.offsetWidth > 0;
                  }),
                  take(1)
              )
              .subscribe(() => {
                  this.initCodemirror();
              });
      }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
      const modeChange = simpleChanges.mode;
      if (modeChange && !modeChange.firstChange) {
          this.editor.setOption('mode', modeChange.currentValue);
      }
  }

  ngOnDestroy() {
      this.codeChange$.complete();
  }

  initCodemirror() {
      this.ngZone.runOutsideAngular(() => {
          this.editor = codemirror.fromTextArea(this.textAreaRef.nativeElement, {
              mode: this.mode,
              lineNumbers: true,
              readOnly: this.readOnly ? 'nocursor' : false,
              autofocus: this.autoFocus
          });
          this.editor.setValue(this.code ? this.code : '');
          this.editor.on('focus', () => this.ngZone.run(() => this.focusChange.emit(true)));
          this.editor.on('blur', () => this.ngZone.run(() => this.focusChange.emit(false)));
          this.editor.on('change', () => {
              this.codeChange$.next(null);
          });
          if (!this.fixedHeight) {
              this.autoMaxHeight();
          }
      });
  }

  autoMaxHeight() {
      const code = (this.elementRef.nativeElement as HTMLElement).querySelector('.CodeMirror-code') as HTMLElement;
      this.update(code);
      const codemirrorContentObserver = new MutationObserver(() => {
          this.update(code);
      });
      codemirrorContentObserver.observe(code, {
          childList: true
      });
  }

  update(code: HTMLElement) {
      if (code.offsetHeight >= this.maxHeight) {
          const wrapHeight = (this.elementRef.nativeElement as HTMLElement).querySelector(
              '.CodeMirror'
          ) as HTMLElement;
          if (wrapHeight.offsetHeight >= this.maxHeight) {
              this.editor.setSize('100%', `${this.maxHeight}px`);
          }
      } else {
          this.editor.setSize('100%', `auto`);
      }
  }
}
