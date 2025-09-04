import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';

// ✅ ลงทะเบียน locale ภาษาไทย
registerLocaleData(localeTh);

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'th' } // ✅ ตั้งค่าให้ใช้ภาษาไทย
  ]
});
