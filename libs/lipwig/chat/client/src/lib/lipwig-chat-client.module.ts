import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { lipwigChatClientRoutes } from './lib.routes';
import { LipwigChatCommonModule } from '@whc/lipwig/chat/common';

@NgModule({
    imports: [CommonModule, LipwigChatCommonModule, RouterModule.forChild(lipwigChatClientRoutes)],
    declarations: [],
})
export class LipwigChatClientModule {}
