import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    input.value = input.value.toUpperCase();
    input.setSelectionRange(start, end);
  }
}