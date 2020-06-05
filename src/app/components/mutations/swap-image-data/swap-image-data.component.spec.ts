import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapImageDataComponent } from './swap-image-data.component';

describe('SwapImageDataComponent', () => {
  let component: SwapImageDataComponent;
  let fixture: ComponentFixture<SwapImageDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapImageDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapImageDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
