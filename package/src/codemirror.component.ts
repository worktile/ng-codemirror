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
  forwardRef,
} from "@angular/core";
import { HostBinding } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Editor, EditorChangeLinkedList, EditorConfiguration, EditorFromTextArea } from "codemirror";
import { timer } from "rxjs";

declare var require: any;
declare var CodeMirror: any;

@Component({
  selector: "ng-codemirror, [ngCodeMirror]",
  template: `<textarea #textAreaRef style="display:none;"></textarea>`,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CodeMirrorComponent),
    multi: true
  }]
})
export class CodeMirrorComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy {
  private _codeWrapElement: HTMLElement;
  private _codemirrorContentObserver: MutationObserver;
  private value: string = null;
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  @Input() autoMaxHeight = 0;

  @Input() options: EditorConfiguration;

  @Input() delayRefreshTime = 200;

  @Output() focusChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild("textAreaRef", { read: ElementRef, static: true })
  textAreaRef: ElementRef;

  @HostBinding("class.ng-codemirror") codemirrorClassName = true;

  public editor: EditorFromTextArea;

  private _differ: KeyValueDiffer<string, any>;

  private _codeMirror: any;

  get codeMirrorGlobal(): any {
    if (this._codeMirror) {
      return this._codeMirror;
    }

    this._codeMirror = typeof CodeMirror !== 'undefined' ? CodeMirror : require('codemirror');
    return this._codeMirror;
  }

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

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  writeValue(value: string) {
    const valid = value !== null && value !== undefined;
    if (this.editor && valid && this.value !== value) {
      this.editor.setValue(value)
    }
    this.value = value;
  }

  initializeCodemirror() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.options) {
        throw new Error("options is required");
      }
      this.editor = this.codeMirrorGlobal.fromTextArea(
        this.textAreaRef.nativeElement,
        this.options
      );
      this.editor.on("focus", () =>
        this.ngZone.run(() => this.focusChange.emit(true))
      );
      this.editor.on("blur", () => {
        this.ngZone.run(() => this.focusChange.emit(false));
        this.editor.setCursor(0, null, { scroll: false });
      });
      this.editor.on(
        "change",
        (cm: Editor, change: EditorChangeLinkedList) => {
          if (change.origin !== "setValue") {
            this.value = cm.getValue();
            this.onChangeCallback(this.value);
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
      if (wrapHeight.offsetHeight > this.autoMaxHeight) {
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
