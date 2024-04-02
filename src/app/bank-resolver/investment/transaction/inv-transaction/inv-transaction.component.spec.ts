import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvTransactionComponent } from './inv-transaction.component';

describe('InvTransactionComponent', () => {
  let component: InvTransactionComponent;
  let fixture: ComponentFixture<InvTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
