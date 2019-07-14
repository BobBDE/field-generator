import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigGeneratorComponent } from './config-generator.component';

describe('ConfigGeneratorComponent', () => {
  let component: ConfigGeneratorComponent;
  let fixture: ComponentFixture<ConfigGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
