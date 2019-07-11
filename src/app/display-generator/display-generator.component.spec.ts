import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayGeneratorComponent } from './display-generator.component';

describe('DisplayGeneratorComponent', () => {
  let component: DisplayGeneratorComponent;
  let fixture: ComponentFixture<DisplayGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
