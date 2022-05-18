import { Component, DebugElement } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";

import { CodeMirrorComponent } from "./codemirror.component";
import { CodemirrorModule } from "./codemirror.module";

@Component({
  selector: "codemirror-test",
  template: `<ng-codemirror
    [options]="options"
    [(ngModel)]="value"
  ></ng-codemirror>`,
})
class CodemirrorBasicTestComponent {
  options = {};

  value = "test";
}

describe("CodeMirrorComponent", () => {
  let component: CodemirrorBasicTestComponent;
  let fixture: ComponentFixture<CodemirrorBasicTestComponent>;
  let codeMirrorDebugElement: DebugElement;
  let codeMirrorElement: HTMLElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CodemirrorModule, FormsModule],
      declarations: [CodemirrorBasicTestComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodemirrorBasicTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    codeMirrorDebugElement = fixture.debugElement.query(
      By.directive(CodeMirrorComponent)
    );
    codeMirrorElement = codeMirrorDebugElement.nativeElement;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
    expect(codeMirrorDebugElement).toBeTruthy();
    expect(codeMirrorElement.classList.contains("ng-codemirror")).toBeTruthy();
  });
});
