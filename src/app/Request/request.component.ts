import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css'],
})
export class RequestComponent implements OnInit {
  taskCode: string = '';
  type: string = '';
  selectedCategory: string = 'เร่งด่วน';
  selectedFiles: File[] = [];

  title: string = '';
  priority: string = '';
  reporterEmail: string = '';
  reporterPhone: string = '';
  coordinatorEmail: string = '';
  coordinatorPhone: string = '';
  coordinatorMobile: string = '';
  assigneeEmail: string = '';
  assigneePhone: string = '';
  assigneeMobile: string = '';
  packageCode: string = '';
  sendDate: Date | null = null;

  // 🔹 สำหรับ dropdown เวลา
  timeOptions: string[] = [];
  filteredEndTimes: string[] = [];
  startTime: string = '';
  endTime: string = '';
  isEndTimeValid: boolean = true;

  details: string = '';
  note: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchTaskCodeFromBackend();
    this.generateTimeOptions();
  }

  // ✅ สร้างรายการเวลา
  generateTimeOptions(): void {
    const startHour = 8;    // เริ่ม 08:00
    const endHour = 18;     // จบ 18:00
    const stepMinutes = 30; // ทุก 30 นาที

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let min = 0; min < 60; min += stepMinutes) {
        const h = hour.toString().padStart(2, '0');
        const m = min.toString().padStart(2, '0');
        this.timeOptions.push(`${h}:${m}`);
      }
    }
    this.filteredEndTimes = [...this.timeOptions];
  }

  // ✅ เมื่อเลือกเวลาเริ่ม ให้กรองเวลาสิ้นสุด
  onStartTimeChange(): void {
    this.filteredEndTimes = this.timeOptions.filter(t => t > this.startTime);
    if (this.endTime && this.endTime <= this.startTime) {
      this.endTime = '';
    }
    this.validateEndTime();
  }

  // ✅ ตรวจสอบเวลาสิ้นสุด
  validateEndTime(): void {
    this.isEndTimeValid = !this.endTime || this.endTime > this.startTime;
  }

  resetTaskCode(): void {
    localStorage.removeItem('taskCodeFallback');
    localStorage.setItem('lastTaskCode', '0');
  }

  fetchTaskCodeFromBackend(): void {
    const cachedCode = localStorage.getItem('taskCodeFallback');
    if (cachedCode) {
      this.taskCode = cachedCode;
      return;
    }

    this.http.get<{ code: string }>('/api/task-code/next').subscribe({
      next: (res) => {
        this.taskCode = res.code;
        localStorage.setItem('taskCodeFallback', res.code);
      },
      error: () => {
        const generated = this.generateFallbackCode();
        this.taskCode = generated;
        localStorage.setItem('taskCodeFallback', generated);
      },
    });
  }

  generateFallbackCode(): string {
    const prefix = 'IQ';
    let last = Number(localStorage.getItem('lastTaskCode') || '0');
    last += 1;
    localStorage.setItem('lastTaskCode', last.toString());
    const padded = last.toString().padStart(6, '0');
    return `${prefix}-${padded}`;
  }

  isExecutiveMode(): boolean {
    return this.selectedCategory === 'เร่งด่วน';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      console.log('📎 ไฟล์ที่เลือก:', this.selectedFiles.map((f) => f.name));
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) {
      console.warn('⚠️ ฟอร์มไม่สมบูรณ์');
      return;
    }

    if (!this.isEndTimeValid) {
      console.warn('⚠️ เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม');
      return;
    }

    const requestData = {
      taskCode: this.taskCode,
      selectedCategory: this.selectedCategory,
      type: this.type,
      title: this.title,
      priority: this.priority,
      reporterEmail: this.reporterEmail,
      reporterPhone: this.reporterPhone,
      coordinatorEmail: this.coordinatorEmail,
      coordinatorPhone: this.coordinatorPhone,
      coordinatorMobile: this.coordinatorMobile,
      assigneeEmail: this.assigneeEmail,
      assigneePhone: this.assigneePhone,
      assigneeMobile: this.assigneeMobile,
      packageCode: this.packageCode,
      sendDate: this.sendDate,
      startTime: this.startTime,
      endTime: this.endTime,
      details: this.details,
      note: this.note,
      attachments: this.selectedFiles.map((f) => f.name),
      status: 'รอการดำเนินการ',
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('requests') || '[]');
    existing.push(requestData);
    localStorage.setItem('requests', JSON.stringify(existing));

    const newCode = this.generateFallbackCode();
    this.taskCode = newCode;
    localStorage.setItem('taskCodeFallback', newCode);

    this.router.navigate(['/status']);
  }
}


