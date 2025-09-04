import { Component } from '@angular/core';
import { SidebarComponent } from '../Sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    SidebarComponent, // ✅ ต้องมีเพื่อให้รู้จัก <app-sidebar>
    RouterModule    // ✅ สำหรับ router-outlet ด้านล่าง
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  isSidebarCollapsed = true;

  onCollapseChange(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}

