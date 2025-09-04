import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ สำหรับ *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,     // ✅ สำหรับ formGroup
    MatFormFieldModule,      // ✅ สำหรับ mat-form-field และ mat-label
    MatInputModule,          // ✅ สำหรับ matInput
    MatButtonModule,          // ✅ สำหรับ mat-raised-button
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // หรือ .scss ถ้าคุณใช้ SCSS
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const { username, password } = this.loginForm.value;

      console.log('Login attempt:', username, password);

      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['/home']); // ✅ redirect ไปหน้า Home
      }, 2000);
    }
  }
}

