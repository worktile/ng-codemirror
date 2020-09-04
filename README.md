# Angular - Codemirror component

codemirror component for Angular（8.0+）
Has been formally verified by the production environment。

**Demo** https://stackblitz.com/ng-codemirror-demo

## Features

- support copy text in readOnly 'nocursor' mode.
- ensure init codemirror after nativeElement has been attached （codemirror need a real element width）.
- support flexiable height by autoMaxHeight.
- support all options by codemirror.

## Alternatives

- [ngx-codemirror](https://github.com/TypeCtrl/ngx-codemirror): An Angular component wrapper for CodeMirror that extends ngModel.

## Installation

```bash
$ npm i ng-codemirror --save
// or
$ yarn add ng-codemirror
```

## Usage

Import `CodemirrorModule` and bring in the [codemirror files for parsing the langague](https://codemirror.net/mode/index.html) you wish to use.

In your `NgModule`:

```ts
import { NgModule } from '@angular/core';
import { CodemirrorModule } from 'ng-codemirror';

  // add to imports:
  imports: [
    BrowserModule,
    CodemirrorModule,
    ...
  ]
```

In your `main.ts` or at the root of your application, see [documentation](https://codemirror.net/mode/index.html):

```ts
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/markdown/markdown";
```

Import the scss file

```scss
@import "~codemirror/lib/codemirror";
@import "~ng-codemirror/style.scss";
```

Use The Component

```html
<ng-codemirror
  [options]="options"
  [code]="code"
  [autoMaxHeight]="300"
></ng-codemirror>
```
