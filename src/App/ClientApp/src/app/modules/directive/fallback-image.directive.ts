import { Directive, Input, HostBinding } from '@angular/core'

import { FileService } from '@partie/core/services/file.service';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src'
  }
})
export class FallbackImageDirective {
  @Input() src: string;
  @Input() default: string;
  @HostBinding('class') className;

  constructor(private readonly fileService:FileService) {

  }

  updateUrl() {
    this.src = this.default;
  }

  load() {
    this.className = 'avatar';
  }
}
