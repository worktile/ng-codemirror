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
  Renderer2,
  KeyValueDiffer,
  KeyValueDiffers,
} from "@angular/core";
import * as codemirror from "codemirror";
import { HostBinding } from "@angular/core";
import { timer } from "rxjs";

@Component({
  selector: "ng-codemirror, [ngCodeMirror]",
  template: `<textarea #textAreaRef style="display:none;"></textarea>`,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeMirrorComponent implements OnInit, OnChanges, OnDestroy {
  private _codeWrapElement: HTMLElement;
  private _codemirrorContentObserver: MutationObserver;
  private _code: string;

  @Input()
  set code(_code: string) {
    if (this.editor && this._code !== _code) {
      this.editor.setValue(_code)
    }
    this._code = _code;
  }

  get code() {
    return this._code;
  }

  @Input() autoMaxHeight = 0;

  @Input() options: codemirror.EditorConfiguration;

  @Input() delayRefreshTime = 200;

  @Output() codeChange: EventEmitter<string> = new EventEmitter();

  @Output() focusChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild("textAreaRef", { read: ElementRef, static: true })
  textAreaRef: ElementRef;

  @HostBinding("class.ng-codemirror") codemirrorClassName = true;

  public editor: codemirror.EditorFromTextArea;

  private _differ: KeyValueDiffer<string, any>;

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private _differs: KeyValueDiffers
  ) { }

  ngOnInit() {
    if (!this._differ && this.options) {
      this._differ = this._differs.find(this.options).create();
    }
    this.initializeCodemirror();
    timer(this.delayRefreshTime).subscribe(() => {
      if (this.autoMaxHeight) {
        this.initializeAutoMaxHeight();
      }
      this.editor.refresh();
    });
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const optionsChange = simpleChanges.options;
    if (optionsChange && !optionsChange.firstChange) {
      const changes = this._differ.diff(this.options);
      if (changes) {
        changes.forEachChangedItem((option) =>
          this.setOptionIfChanged(option.key, option.currentValue)
        );
        changes.forEachAddedItem((option) =>
          this.setOptionIfChanged(option.key, option.currentValue)
        );
        changes.forEachRemovedItem((option) =>
          this.setOptionIfChanged(option.key, option.currentValue)
        );
      }
    }
  }

  initializeCodemirror() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.options) {
        throw new Error("options is required");
      }
      this.editor = codemirror.fromTextArea(
        this.textAreaRef.nativeElement,
        this.options
      );
      this.editor.setValue(this.code ? this.code : "");
      this.editor.on("focus", () =>
        this.ngZone.run(() => this.focusChange.emit(true))
      );
      this.editor.on("blur", () => {
        this.ngZone.run(() => this.focusChange.emit(false));
        this.editor.setCursor(0, null, { scroll: false });
      });
      this.editor.on(
        "change",
        (cm: codemirror.Editor, change: codemirror.EditorChangeLinkedList) => {
          if (change.origin !== "setValue") {
            this._code = cm.getValue();
            this.codeChange.emit(this.code);
          }
        }
      );
    });
  }

  initializeAutoMaxHeight() {
    this._codeWrapElement = this.elementRef.nativeElement.querySelector(".CodeMirror-code");
    this._codemirrorContentObserver = new MutationObserver(() => {
      this.applyEditorHeight();
    });
    this._codemirrorContentObserver.observe(this._codeWrapElement, {
      childList: true,
    });
  }

  private applyEditorHeight() {
    if (this._codeWrapElement.offsetHeight >= this.autoMaxHeight) {
      const wrapHeight: HTMLElement = this.elementRef.nativeElement.querySelector(".CodeMirror");
      if (wrapHeight.offsetHeight >= this.autoMaxHeight) {
        this.editor.setSize("100%", `${this.autoMaxHeight}px`);
      }
    } else {
      this.editor.setSize("100%", `auto`);
    }
  }

  setOptionIfChanged(optionName: string, newValue: any) {
    if (!this.editor) {
      return;
    }

    // cast to any to handle strictly typed option names
    // could possibly import settings strings available in the future
    this.editor.setOption(optionName as any, newValue);
  }

  ngOnDestroy() {
    if (this._codemirrorContentObserver) {
      this._codemirrorContentObserver.disconnect();
    }
  }
}
