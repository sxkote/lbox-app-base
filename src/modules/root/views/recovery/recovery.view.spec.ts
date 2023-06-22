import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryView } from './recovery.view';

describe('RecoveryView', () => {
  let component: RecoveryView;
  let fixture: ComponentFixture<RecoveryView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecoveryView],
    }).compileComponents();

    fixture = TestBed.createComponent(RecoveryView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
