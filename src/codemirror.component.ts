import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { EditorView } from '@codemirror/view';

import { LanguageDescription } from '@codemirror/language';
import { languages } from '@codemirror/language-data';

import { Annotation, Compartment, EditorState, Extension, StateEffect } from '@codemirror/state';
import { timer } from "rxjs";
import { basicSetup, minimalSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { material } from '@uiw/codemirror-theme-material';

export interface NgCodeMirrorOptions {
  mode: string | { name: string, value: string };
  theme?: Theme;
  lineNumbers?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  lineWiseCopyCut?: boolean;
  lineWrapping?: boolean;
  cursorBlinkRate?: number;
}

export const selectableLanguages =
  languages.map(lang => ({ name: lang.name, value: lang.name.toLowerCase() }))
    .sort((a, b) => a.name.localeCompare(b.name))

export const External = Annotation.define<boolean>();

export type Theme = 'light' | 'dark' | 'material' | Extension;

@Component({
  selector: "ng-codemirror, [ngCodeMirror]",
  template: `<textarea #textAreaRef style="display:none;"></textarea>`,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CodeMirrorComponent),
    multi: true
  }],
  standalone: true
})
export class CodeMirrorComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy {
  private _codemirrorContentObserver: MutationObserver;
  private value: string = null;
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  @Input() autoMaxHeight = 0;

  @Input() options: NgCodeMirrorOptions;

  @Input() delayRefreshTime = 200;

  @Input() extensions: Extension[] = [];

  @Input() languages: LanguageDescription[];

  @Output() focusChange: EventEmitter<boolean> = new EventEmitter();

  @ViewChild("textAreaRef", { read: ElementRef, static: true })
  textAreaRef: ElementRef;

  @HostBinding("class.ng-codemirror") codemirrorClassName = true;

  view?: EditorView;

  private _differ: KeyValueDiffer<string, any>;

  private _readonlyConf = new Compartment();

  private _themeConf = new Compartment();

  private _placeholderConf = new Compartment();

  private _indentWithTabConf = new Compartment();

  private _indentUnitConf = new Compartment();

  private _lineWrappingConf = new Compartment();

  private _highlightWhitespaceConf = new Compartment();

  private _languageConf = new Compartment();

  private _updateListener = EditorView.updateListener.of(vu => {
    if (vu.docChanged && !vu.transactions.some(tr => tr.annotation(External))) {
      const value = vu.state.doc.toString();
      this.onChangeCallback(value);
    }
  });

  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private _differs: KeyValueDiffers
  ) { }

  ngOnInit() {
    if (!this.languages) {
      this.languages = languages;
    }

    if (!this._differ && this.options) {
      this._differ = this._differs.find(this.options).create();
    }

    this.initializeCodemirror();

    timer(this.delayRefreshTime).subscribe(() => {
      if (this.autoMaxHeight) {
        this.applyEditorHeight();
      }
      this.view.requestMeasure();
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
    if (this.view && valid && this.value !== value) {
      this.setValue(value);
    }
    this.value = value;
  }

  initializeCodemirror() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.options) {
        throw new Error("options is required");
      }

      this.view = new EditorView({
        parent: this.elementRef.nativeElement,
        state: EditorState.create({ doc: this.value, extensions: this._getAllExtensions() }),
      });

      if (this.options.autofocus) {
        this.view.focus();
      }

      if (this.options.readonly) {
        this.setReadonly(this.options.readonly);
      }

      if (this.options.mode) {
        this.setLanguage(this.options.mode);
      }

      if (this.options.theme) {
        this.setTheme(this.options.theme);
      }

      if (this.options.lineWrapping) {
        this.setLineWrapping(this.options.lineWrapping);
      }

      this.view?.contentDOM.addEventListener('focus', () => {
        this.focusChange.emit(true);
      });

      this.view?.contentDOM.addEventListener('blur', () => {
        this.focusChange.emit(false);
      });
    });
  }

  private applyEditorHeight() {
    if (this.autoMaxHeight) {
      const editor: HTMLElement = this.elementRef.nativeElement.querySelector(".cm-editor");
      editor.style.width = '100%';
      editor.style.height = 'auto';
  }
  }

  setOptionIfChanged(optionName: string, newValue: any) {
    if (!this.view) {
      return;
    }

    if (optionName === 'readOnly') {
      this.setReadonly(newValue);
    }

    if (optionName === 'mode') {
      this.setLanguage(newValue);
    }

    if (optionName === 'cursorBlinkRate') {
      this.setCursor(newValue);
    }

    if (optionName === 'theme') {
      this.setTheme(newValue);
    }

    if (optionName === 'lineWrapping') {
      this.setLineWrapping(newValue);
    }

    if (optionName === 'lineNumbers') {
      this.setExtensions(this._getAllExtensions());
    }
  }

  setLineWrapping(value: boolean) {
    this._dispatchEffects(this._lineWrappingConf.reconfigure(value ? EditorView.lineWrapping : []));
  }

  setExtensions(value: Extension[]) {
    this._dispatchEffects(StateEffect.reconfigure.of(value));
  }

  setValue(value: string) {
    this.view?.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: value },
    });
  }

  setReadonly(value: boolean) {
    this._dispatchEffects(this._readonlyConf.reconfigure(EditorState.readOnly.of(value)));
  }

  setLanguage(lang: string | any) {
    if (!lang) {
      return;
    }

    if (this.languages.length === 0) {
      if (this.view) {
        console.error('No supported languages. Please set the `languages` prop at first.');
      }
      return;
    }

    const langDesc = this._findLanguage(lang || lang.name);
    langDesc?.load().then(lang => {
      this._dispatchEffects(this._languageConf.reconfigure([lang]));
    });
  }

  setCursor(cursorBlinkRate: number) {
    const cursorStyle = cursorBlinkRate < 0 ? { border: '0px' } : undefined;
    this._dispatchEffects(this._themeConf.reconfigure(
      EditorView.theme({
        '.cm-cursor': cursorStyle
      }))
    );
  }

  setTheme(value: Theme) {
    this._dispatchEffects(
      this._themeConf.reconfigure(value === 'light' ? [] : value === 'dark' ? oneDark : value === 'material' ? material : value)
    );
  }

  private _dispatchEffects(effects: StateEffect<any> | readonly StateEffect<any>[]) {
    return this.view?.dispatch({ effects });
  }

  private _findLanguage(name: string) {
    for (const lang of this.languages) {
      for (const alias of [lang.name, ...lang.alias]) {
        if (name.toLowerCase() === alias.toLowerCase()) {
          return lang;
        }
      }
    }
    return null;
  }

  private _getAllExtensions() {
    return [
      this._updateListener,
      this._readonlyConf.of([]),
      this._themeConf.of([]),
      this._placeholderConf.of([]),
      this._indentWithTabConf.of([]),
      this._indentUnitConf.of([]),
      this._lineWrappingConf.of([]),
      this._highlightWhitespaceConf.of([]),
      this._languageConf.of([]),
      this.options.lineNumbers ? basicSetup : minimalSetup,
      ...this.extensions
    ];
  }

  ngOnDestroy() {
    if (this._codemirrorContentObserver) {
      this._codemirrorContentObserver.disconnect();
    }
  }
}
