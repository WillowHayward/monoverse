import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { UiModule } from '@willhaycode/ui';
import { LoginPageComponent } from './login-page/login-page.component';

@NgModule({
    declarations: [AppComponent, LoginPageComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: LoginPageComponent,
                },
            ],
            {
                initialNavigation: 'enabledBlocking',
            }
        ),
        UiModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
