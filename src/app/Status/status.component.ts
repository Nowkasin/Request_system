import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule
  ],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  displayedColumns: string[] = ['taskCode', 'title', 'priority', 'reporterEmail'];
  requestList: any[] = [];

  ngOnInit(): void {
    const raw = localStorage.getItem('requests');
    this.requestList = raw ? JSON.parse(raw) : [];
  }
getStatusClass(status: string): string {
  switch (status) {
    case 'รอการดำเนินการ': return 'waiting';
    case 'กำลังดำเนินการ': return 'in-progress';
    case 'เสร็จสิ้น': return 'done';
    default: return '';
  }
}

viewDetails(request: any): void {
  // เปิด dialog หรือ navigate ไปหน้า /record/:taskCode
  console.log('📄 ดูรายละเอียดของ:', request.taskCode);
}
}
