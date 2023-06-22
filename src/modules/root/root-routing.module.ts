import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeView } from './views/home/home.view';
import { LoginView } from './views/login/login.view';
import { RecoveryView } from './views/recovery/recovery.view';
import { ProfileView } from './views/profile/profile.view';

const routes: Routes = [
  { path: '', component: HomeView },
  { path: 'home', component: HomeView },
  { path: 'login', component: LoginView },
  { path: 'recovery/:activity', component: RecoveryView },
  { path: 'profile', component: ProfileView },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RootRoutingModule {}
