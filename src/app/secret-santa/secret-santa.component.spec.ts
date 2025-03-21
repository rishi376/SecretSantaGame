import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretSantaComponent } from './secret-santa.component';

describe('SecretSantaComponent', () => {
  let component: SecretSantaComponent;
  let fixture: ComponentFixture<SecretSantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecretSantaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecretSantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('import data for input file importData()', () => {
    expect(component.importBtn).withContext('true at first').toBe(true);
    expect(component.downloadBtn).withContext('true at first').toBe(true);
    expect(component.file.size).withContext('file size equal to 0').toBe(0);
    component.importData(Event);
    expect(component.importBtn).withContext('false after import').toBe(false);
    expect(component.downloadBtn).withContext('true after import').toBe(true);
    expect(component.file.size).withContext('file size greater than 0').toBeGreaterThan(0);
  }); 

  it('previous data for previous secret file previousSecret()', () => {
    expect(component.previousSecretFile.size).withContext('file size equal to 0').toBe(0);
    component.importData(Event);
    expect(component.previousSecretFile.size).withContext('file size greater than 0').toBeGreaterThan(0);
  }); 
  
});
