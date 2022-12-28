import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { BuilderComponent } from './builder/builder.component';

import { UiModule } from '@willhaycode/ui';

@NgModule({
    declarations: [AppComponent, BuilderComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(
            [
                {
                    path: '',
                    component: BuilderComponent,
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
