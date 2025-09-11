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
  position = '';
  role = '';
  loading = true;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const sessionData = sessionStorage.getItem('userSession');

    if (sessionData) {
      const user = JSON.parse(sessionData);
      this.username = user.username;
      this.role = user.role;

      this.fetchUserInfo(this.username);
    } else {
      this.loading = false;
      this.errorMessage = 'ไม่พบข้อมูลผู้ใช้';
    }
  }

fetchUserInfo(username: string): void {
  const infoUrl = `/api_phonebook/phonebook/employee_info/${username}`;
  this.http.get<{
    response: { code: string; error: string; message: string; timestamp: string };
    result: {
      employee_no: string; 
      full_name: string;
      position: string;
    };
  }>(infoUrl).subscribe({
    next: (data) => {
      const result = data.result;
      const response = data.response;
      this.fullName = result.full_name;
      this.position = result.position;
      this.username = result.employee_no; // ✅ ใช้ employee_no เป็นรหัสพนักงาน

      const updatedSession = {
        username: this.username,
        fullName: this.fullName,
        position: this.position,
        role: this.role,
      };
      sessionStorage.setItem('userSession', JSON.stringify(updatedSession));

      console.log(response);
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
