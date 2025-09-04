import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RequestService, Employee } from '../../service/request.service';

@Component({
  selector: 'app-test-db',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule // ✅ ต้องมีเพื่อให้ HttpClient ทำงานใน standalone
  ],
  providers: [RequestService], // ✅ เพิ่ม provider สำหรับ service
  templateUrl: './TestDB.component.html'
})
export class TestDBComponent implements OnInit {
  employeeNames: string[] = [];

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.requestService.getEmployeeNames().subscribe({
      next: (data: Employee[]) => {
        console.log('✅ Data from API:', data); // เพิ่ม log เพื่อตรวจสอบ
        this.employeeNames = data.map((item: Employee) => item.Name);
      },
      error: (err: any) => {
        console.error('❌ API Error:', err);
      }
    });
  }
}
