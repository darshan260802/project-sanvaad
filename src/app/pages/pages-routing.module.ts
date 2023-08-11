import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: 'chat',
    canActivate: [AuthGuard],
    component: ChatComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
