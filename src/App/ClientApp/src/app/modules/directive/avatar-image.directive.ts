import { Directive, Input, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import { FileService } from '@partie/core/services/file.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
  selector: 'img[userId]',
  host: {
    //'(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src'
  }
})
export class AvatarImageDirective implements OnChanges {
  

  @Input() src: string;
  @Input() userId: string;
  @Input() largeSize: boolean;
  @Input() burstCache: boolean;
  @HostBinding('class') className;

    private _userId: string;

  constructor(private readonly fileService: FileService)  {
    this.largeSize = false;
    this.burstCache = false;
  }

    updateUrl() {
        const subscription = this.fileService.userAvatarExists(this.userId).subscribe((resp: boolean) => {
          this.src = (resp)
            ? this.fileService.getProfileAvatarUrl(this.userId, this.largeSize, this.burstCache)
            : this.fileService.getDefaultAvatarUrl(this.userId);
          this._userId = this.userId;
          if(subscription) subscription.unsubscribe();
        });
    }

  load() {
    this.className = 'avatar';   
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._userId = changes.userId.previousValue;
    this.updateUrl();
  }


}
