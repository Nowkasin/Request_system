import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { HomeComponent } from './Dashboard/dashboard.component';
import { MainLayoutComponent } from './mainlay/main-layout.component';
import { RequestComponent } from './Request/request.component';
// import { UserManagementComponent } from '../Users/user-management.component';
import { StatusComponent } from './Status/status.component';
import { NotFoundComponent } from './notfound.component';
import { TestDBComponent } from './TestDB/TestDB.component';
import { ProfileComponent } from './Profile/profile.component';
import { AuthGuard } from '../service/auth.guard'; // ✅ อย่าลืม import
import { LoginRequiredGuard } from '../service/login-required.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [LoginRequiredGuard],
    children: [
      { path: 'home', component: HomeComponent }, // ✅ ใช้ path 'home'
      { path: 'request', component: RequestComponent },
      { path: 'status', component: StatusComponent },
      { path: 'test-db', component: TestDBComponent },
      { path: 'profile', component: ProfileComponent },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
