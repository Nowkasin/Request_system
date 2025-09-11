// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const sessionData = sessionStorage.getItem('userSession');
    if (sessionData) {
      // ✅ ถ้า login แล้ว redirect ไปหน้า home
      this.router.navigate(['/home']);
      return false;
    }
    return true; // ✅ ยังไม่ login → เข้า login ได้
  }
}
