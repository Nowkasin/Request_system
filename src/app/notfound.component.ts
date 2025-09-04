import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found">
      <h1>404 - ไม่พบหน้าที่คุณต้องการ</h1>
      <p>ตรวจสอบ URL หรือกลับไปหน้าแรก</p>
      <a routerLink="/home" class="back-link">กลับหน้าแรก</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 50px;
    }
    .back-link {
      display: inline-block;
      margin-top: 20px;
      color: #1976d2;
      text-decoration: none;
      font-weight: bold;
    }
    .back-link:hover {
      text-decoration: underline;
    }
  `]
})
export class NotFoundComponent {}
