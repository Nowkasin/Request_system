// login-required.guard.ts
import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginRequiredGuard implements CanActivateChild {
  constructor(private router: Router) {}

  canActivateChild(): boolean {
    const sessionData = sessionStorage.getItem('userSession');
    if (!sessionData) {
      // ❌ ยังไม่ login → redirect ไปหน้า login
      this.router.navigate(['/login']);
      return false;
    }
    return true; // ✅ login แล้ว → เข้าหน้าอื่นได้
  }
}
