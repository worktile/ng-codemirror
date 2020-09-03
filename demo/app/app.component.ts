import { Component } from '@angular/core';
import { CODE_BLOCK_LANGUAGES, DEFAULT_LANGUAGE, CodeLanguages } from './constants/codemirror';
import { normalizeCommonJSImport } from './utils/normalizeCommonJSImport';
const importChart = (mode) => normalizeCommonJSImport(
  import(`codemirror/mode/${mode}/${mode}`),
);

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
    cursorBlinkRate: 500 // hide cursor
  };
  code = initializeCode;
  mode = DEFAULT_LANGUAGE.value;
  modeOptions = [...CODE_BLOCK_LANGUAGES];

  async modeChange(mode: CodeLanguages) {
    const Chart = await importChart(mode);
    Object.assign({}, this.options, { mode: mode.toString() });
    this.options = {...this.options, mode};
  }

  toggleReadonly(checked) {
    if (checked) {
      this.options = { ...this.options, readOnly: true, cursorBlinkRate: -1 };
    } else {
      this.options = { ...this.options, readOnly: false, cursorBlinkRate: 500 };
    }
  }
}


const initializeCode = `import { Component } from '@angular/core';

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
