import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrginalsComponent } from './orginals.component';

describe('OrginalsComponent', () => {
  let component: OrginalsComponent;
  let fixture: ComponentFixture<OrginalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrginalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrginalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
