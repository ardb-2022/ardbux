import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContaiUCICprofileComponent } from './contai-ucicprofile.component';

describe('ContaiUCICprofileComponent', () => {
  let component: ContaiUCICprofileComponent;
  let fixture: ComponentFixture<ContaiUCICprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContaiUCICprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContaiUCICprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
