import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  username = '';
  fullName = '';
  department = '';
  role = '';
  loading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.username = sessionStorage.getItem('username') || '';
    this.fullName = sessionStorage.getItem('fullName') || '';
    this.department = sessionStorage.getItem('department') || '';
    this.role = sessionStorage.getItem('role') || '';

    if (this.username) {
      this.fetchUserInfo(this.username);
    } else {
      this.loading = false;
      this.errorMessage = 'ไม่พบข้อมูลผู้ใช้';
    }
  }

  fetchUserInfo(username: string): void {
    const infoUrl = `/api_phonebook/phonebook/employee_info/${username}`;
    this.http.get<{ firstName: string; lastName: string; department: string }>(infoUrl).subscribe({
      next: (data) => {
        this.fullName = `${data.firstName} ${data.lastName}`;
        this.department = data.department;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ ไม่สามารถโหลดข้อมูลผู้ใช้:', err);
        this.errorMessage = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
        this.loading = false;
      },
    });
  }
}
