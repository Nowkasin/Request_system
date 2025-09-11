import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  checkRole(username: string): string {
    return 'admin'; // ✅ ช่วงเทสให้ทุกคนเป็น admin
  }

  onSubmit(): void {
    if (!this.loginForm.valid) return;

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;
    const encodedPass = btoa(password); // 🔐 Base64 encode

    console.log('🔐 Attempting login for:', username);

    const ssoUrl = `/ldap/RestfulWS/username/${username}/password/${encodedPass}`;
    this.http.get<boolean>(ssoUrl).subscribe({
      next: (isValid) => {
        console.log('✅ SSO response:', isValid);

        if (!isValid) {
          this.handleError('ไม่พบผู้ใช้ในระบบ SSO', true);
          return;
        }

        this.fetchUserInfo(username);
      },
      error: (err) => {
        console.error('❌ SSO API error:', err);
        this.handleError('เกิดข้อผิดพลาดในการเชื่อมต่อ SSO', true);
      },
    });
  }

  private fetchUserInfo(username: string): void {
    const infoUrl = `/api_phonebook/phonebook/employee_info/${username}`;
    console.log('📞 Fetching user info from:', infoUrl);

    this.http.get<{ response?: any; result?: any }>(infoUrl).subscribe({
      next: (userInfo) => {
        console.log('📦 Raw Phonebook response:', userInfo);

        const info = userInfo?.result;
        if (!info || !info.first_name || !info.last_name || !info.full_name) {
          console.warn('⚠️ Missing required fields in Phonebook result:', info);
          this.handleError('ไม่พบข้อมูลผู้ใช้ในระบบ Phonebook', true);
          return;
        }

        this.prepareSession(username, info);
      },
      error: (err) => {
        console.error('❌ Error fetching user info:', err);
        this.handleError('ไม่สามารถดึงข้อมูลผู้ใช้จากระบบ Phonebook ได้', true);
      },
    });
  }

  private prepareSession(username: string, info: any): void {
    const fullName = info.full_name;
    const department = info.position;
    const role = this.checkRole(username);

    const userSession = {
      username,
      fullName,
      department,
      role,
      email: info.email,
      employee_no: info.employee_no,
    };

    console.log('📦 User session prepared:', userSession);

    sessionStorage.setItem('fullName', fullName);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('department', department);
    sessionStorage.setItem('role', role);
    sessionStorage.setItem('email', info.email);
    sessionStorage.setItem('employee_no', info.employee_no);
    sessionStorage.setItem('userSession', JSON.stringify(userSession));

    // ✅ ถ้ายังไม่ต้อง insert ให้หยุดตรงนี้
    // ถ้าจะ insert ในอนาคต ให้เรียก insertUser(userSession)

    this.loading = false;
    this.router.navigate(['/home']).then((success) => {
      if (!success) {
        console.warn('⚠️ Navigation to /home failed, using fallback');
        window.location.href = '/home';
      }
    });
  }

  private insertUser(userSession: any): void {
    const insertUrl = `/api_user/insert`;
    console.log('📤 Inserting user info:', userSession);

    this.http.post(insertUrl, userSession).subscribe({
      next: () => {
        console.log('✅ User info inserted successfully');
      },
      error: (err) => {
        console.error('❌ Error inserting user info:', err);
        this.handleError('เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้', false);
      },
    });
  }

  private handleError(message: string, alertUser: boolean): void {
    this.loading = false;
    this.errorMessage = message;
    if (alertUser) window.alert(message);
  }
}
