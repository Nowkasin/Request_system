import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // ✅ แก้ import ให้ครบ

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    HttpClientModule, // ✅ ให้ HttpClient ใช้งานได้ใน Standalone Component
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  checkRole(username: string): string {
  return 'admin'; // ✅ ช่วงเทสให้ทุกคนเป็น admin
}

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient // ✅ ใช้ได้แล้วหลัง import HttpClient ด้านบน
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

onSubmit() {
  if (this.loginForm.valid) {
    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;
    const encodedPass = btoa(password); // 🔐 Base64 encode

    const ssoUrl = `/ldap/RestfulWS/username/${username}/password/${encodedPass}`;
    // console.log('🔐 Checking login for:', username);

    this.http.get<boolean>(ssoUrl).subscribe({
      next: (isValid: boolean) => {
        console.log('✅ SSO Response:', isValid);

        if (isValid) {
          const infoUrl = `/api_phonebook/phonebook/employee_info/${username}`;
          // console.log('📞 Fetching user info from phonebook');

          this.http
            .get<{ firstName: string; lastName: string; department: string }>(infoUrl)
            .subscribe({
              next: (userInfo) => {
                // console.log('📦 User Info:', userInfo);

                const fullName = `${userInfo.firstName} ${userInfo.lastName}`;
                const department = userInfo.department;
                const role = this.checkRole(username);

                // console.log('👤 Full Name:', fullName);
                // console.log('🏢 Department:', department);
                // console.log('🛡️ Role:', role);

                sessionStorage.setItem('fullName', fullName);
                sessionStorage.setItem('department', department);
                sessionStorage.setItem('role', role);

                this.loading = false;

                // ✅ Redirect ไปหน้า Home
                this.router.navigate(['/home']).then(success => {
                  if (!success) {
                    // console.warn('⚠️ Navigation to /home failed, fallback to window.location');
                    window.location.href = '/home';
                  }
                });
              },
              error: (err) => {
                console.error('❌ Error fetching user info:', err);
                this.loading = false;
                this.errorMessage = 'ไม่สามารถดึงข้อมูลผู้ใช้ได้';
              },
            });
        } else {
          console.warn('❌ Invalid credentials');
          this.loading = false;
          this.errorMessage = 'User or Password invalid';
        }
      },
      error: (err) => {
        console.error('❌ SSO API error:', err);
        this.loading = false;
        this.errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อ SSO';
      },
    });
  }
}
}
