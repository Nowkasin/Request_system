import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = true;

  @Output() collapseChange = new EventEmitter<boolean>();

  onMouseEnter() {
    this.isCollapsed = false;
    this.collapseChange.emit(this.isCollapsed);
  }

  onMouseLeave() {
    this.isCollapsed = true;
    this.collapseChange.emit(this.isCollapsed);
  }
}