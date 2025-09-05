// 📁 src/app/directives/phone-mask.directive.ts
import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement.value;
    const digits = input.replace(/\D/g, '').substring(0, 10);

    let formatted = digits;
    if (digits.length >= 7) {
      formatted = digits.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1-$2-$3');
    } else if (digits.length >= 4) {
      formatted = digits.replace(/(\d{3})(\d{0,3})/, '$1-$2');
    }

    this.el.nativeElement.value = formatted;
  }
}
