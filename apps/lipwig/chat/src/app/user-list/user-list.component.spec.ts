import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientUserListComponent } from './client-user-list.component';

describe('ClientUserListComponent', () => {
    let component: ClientUserListComponent;
    let fixture: ComponentFixture<ClientUserListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ClientUserListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ClientUserListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
