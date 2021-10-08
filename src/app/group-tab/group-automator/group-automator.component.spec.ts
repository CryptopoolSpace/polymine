import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupAutomatorComponent } from "./group-automator.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport, getMiners } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { EndInPipe } from "src/app/end-in.pipe";
import { SizeNamePipe } from "src/app/size-name.pipe";

describe("GroupAutomatorComponent", () => {
  let component: GroupAutomatorComponent;
  let fixture: ComponentFixture<GroupAutomatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [
        GroupAutomatorComponent,
        FormatPipe,
        EndInPipe,
        SizeNamePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupAutomatorComponent);
    component = fixture.componentInstance;
    const Miners = getMiners();
    component.auto = Miners.resourceManager.tierGroups[1].automators[0];
    component.resourceGroup = Miners.resourceManager.tierGroups[1];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
