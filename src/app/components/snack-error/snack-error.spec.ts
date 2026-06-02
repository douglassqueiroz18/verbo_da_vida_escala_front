import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackError } from './snack-error';

describe('SnackError', () => {
  let component: SnackError;
  let fixture: ComponentFixture<SnackError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnackError],
    }).compileComponents();

    fixture = TestBed.createComponent(SnackError);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
