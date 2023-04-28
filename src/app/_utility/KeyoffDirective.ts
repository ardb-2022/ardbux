import { Directive, HostListener } from '@angular/core';
@Directive({
  selector:"[ccCardHover]"
})
export class KeyoffDirective {

    constructor() { }
    @HostListener('document:keydown', ['$event'])
    handleKeyboard(event: KeyboardEvent) {
      // console.log(event);
      if ( event.key == 'Enter') {
        event.returnValue = false;
        event.preventDefault();
      }
    }
  
  }