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
  Renderer2,
  KeyValueDiffer,
  KeyValueDiffers,
} from "@angular/core";
import * as codemirror from "codemirror";
import { take, filter } from "rxjs/operators";
import { HostBinding } from "@angular/core";

@Component({
  selector: "ng-codemirror, [ngCodeMirror]",
  template: `<textarea #textAreaRef></textarea>`,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeMirrorComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() code: string;

  @Input() autoMaxHeight = 0;

  @Input() options: codemirror.EditorConfiguration;

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
    private _differs: KeyValueDiffers,
    private _ngZone: NgZone
  ) {}

  ngOnInit() {
    if (!this._differ && this.options) {
      this._differ = this._differs.find(this.options).create();
    }
  }

  ngAfterViewInit() {
    if (this.elementRef.nativeElement.offsetWidth > 0) {
      this.initCodemirror();
      if (this.autoMaxHeight > 0) {
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          "maxHeight",
          `${this.autoMaxHeight}px`
        );
      }
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
    const optionsChange = simpleChanges.options;
    const codeChange = simpleChanges.codeChange;
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
    if (codeChange) {
      this.editor.setValue(this.code);
    }
  }

  initCodemirror() {
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
            this.code = cm.getValue();
            this.codeChange.emit(this.code);
          }
        }
      );
      if (this.autoMaxHeight > 0) {
        this.initMaxHeight();
      }
    });
  }

  private initMaxHeight() {
    const codeWrapElement = (this.elementRef
      .nativeElement as HTMLElement).querySelector(
      ".CodeMirror-code"
    ) as HTMLElement;
    this.applyEditorHeight(codeWrapElement);
    const codemirrorContentObserver = new MutationObserver(() => {
      this.applyEditorHeight(codeWrapElement);
    });
    codemirrorContentObserver.observe(codeWrapElement, {
      childList: true,
    });
  }

  private applyEditorHeight(code: HTMLElement) {
    if (code.offsetHeight >= this.autoMaxHeight) {
      const wrapHeight = (this.elementRef
        .nativeElement as HTMLElement).querySelector(
        ".CodeMirror"
      ) as HTMLElement;
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

  ngOnDestroy() {}
}
