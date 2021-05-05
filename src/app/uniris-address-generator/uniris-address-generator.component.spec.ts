import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnirisAddressGeneratorComponent } from './uniris-address-generator.component';

describe('UnirisAddressGeneratorComponent', () => {
  let component: UnirisAddressGeneratorComponent;
  let fixture: ComponentFixture<UnirisAddressGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnirisAddressGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnirisAddressGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
