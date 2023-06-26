import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminatedComponent } from './eliminated.component';

describe('EliminatedComponent', () => {
    let component: EliminatedComponent;
    let fixture: ComponentFixture<EliminatedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EliminatedComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EliminatedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
