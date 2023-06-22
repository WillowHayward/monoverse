import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { rockOffClientRoutes } from './lib.routes';
import { PlayComponent } from './play/play.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { WaitComponent } from './wait/wait.component';
import { EliminatedComponent } from './eliminated/eliminated.component';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(rockOffClientRoutes)],
    declarations: [
        WelcomeComponent,
        WaitComponent,
        PlayComponent,
        EliminatedComponent,
    ],
})
export class RockOffClientModule {}
