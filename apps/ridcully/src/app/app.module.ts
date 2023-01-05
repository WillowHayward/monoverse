import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { UiModule } from '@whc/ui/lib';
import { RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';

@NgModule({
    declarations: [AppComponent, LandingComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: LandingComponent,
                },
            ],
            { initialNavigation: 'enabledBlocking' }
        ),
        UiModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
