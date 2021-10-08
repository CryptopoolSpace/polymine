import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CryptoListComponent } from "./Crypto-list.component";
import { FormatPipe } from "../format.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { defaultImport } from "../app.component.spec";

describe("CryptoListComponent", () => {
  let component: CryptoListComponent;
  let fixture: ComponentFixture<CryptoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CryptoListComponent, FormatPipe],
      imports: defaultImport(),
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CryptoListComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
