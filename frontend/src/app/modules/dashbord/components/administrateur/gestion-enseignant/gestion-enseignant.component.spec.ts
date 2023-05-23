import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionEnseignantComponent } from './gestion-enseignant.component';

describe('GestionEnseignantComponent', () => {
  let component: GestionEnseignantComponent;
  let fixture: ComponentFixture<GestionEnseignantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionEnseignantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionEnseignantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
