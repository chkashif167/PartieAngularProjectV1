
import { Component, OnInit, HostListener } from '@angular/core';


//Services
import { ConfigurationService } from '@partie/shared/services/configuration.service';
import { RoomService } from '@partie/room/services/room.service';

import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { DialogConfig } from '@partie/shared/models/dialog/dialog-config';
import { RateRoom, Badge } from '@partie/room/models/rate-host/rate-host.model';
import { SocialMedia } from '@partie/shared/models/social-media/social-media.model';
import { SocialMediaService } from '@partie/shared/services/social-media.service';

@Component({
  selector: 'partie-rate-host',
  templateUrl: './rate-host.component.html',
  styleUrls: ['./rate-host.component.css']
})
export class RateHostComponent implements OnInit {

  badgeUrl: string;
  selectedRating: number[];
  rating: number[];

  badges: Badge[];
    ratePartie: RateRoom;

    socialModel: SocialMedia;


  constructor(
    public config: DialogConfig,
      public dialog: DialogRef,
      private readonly configurationService: ConfigurationService,
      private readonly socialMediaService: SocialMediaService,
      private readonly roomService: RoomService) {

    this.badgeUrl = `${configurationService.getCdnBaseUrl}/images/badges/cheesy.png`;
    this.rating = [0, 0, 0, 0, 0];
    this.selectedRating = [0, 0, 0, 0, 0];
    this.ratePartie = new RateRoom();
  }

    ngOnInit() {
      this.socialModel = {
          url: this.roomService.getRoomUrl(this.ratePartie.roomId)
      }
      this.socialMediaService.changeModel(this.socialModel);
    this.badges = this.badges.sort((a, b) => {
      if (a.sortOrder > b.sortOrder) {
        return 1;
      }
      else if (a.sortOrder < b.sortOrder) {
        return -1;
      }
      return 0;
    });
  }

  
  getActualRating():void{    
    this.rating = [ ... this.selectedRating];   
    }
  
  updateRating(index:number):void{
    this.rate(index);
    this.selectedRating = [... this.rating];
   }

  rate(index: number): void {
    const value = this.rating[index];
    this.rating.forEach((v,i)=> this.rating[i] = i <= index ? 1: 0);
    
  }

  star(index: number): string {
    return this.rating[index] === 1
      ? "assets/images/icons/misc/star-selected.svg"
      : "assets/images/icons/misc/star.svg";
  }

  awardBadge(id: string): void {
    this.badges.forEach((b, i)=>{
        b.selected = false;
    });
    this.badges.filter(x => x.id === id)[0].selected = !this.badges.filter(x => x.id === id)[0].selected;
  }

  
  close(): void {

    this.ratePartie = new RateRoom();
    this.ratePartie.cancelled = true;

    this.dialog.close(this.ratePartie);
  }

  submit(): void {

    const selectedBadges = this.badges.filter(x => x.selected).map(b => b.id);

    this.ratePartie.rating = this.rating.reduce((a, b) => a + b, 0);
    this.ratePartie.badgesReceived = selectedBadges.join(',');
    this.ratePartie.cancelled = false;
      
     this.dialog.close(this.ratePartie);
      
    }

  trackByFn(index, item) {
    return item.id;
  }

  @HostListener('window:beforeunload', ['$event'])
  windowClose(): void {
    this.ratePartie = new RateRoom();
    this.ratePartie.cancelled = true;
    this.ratePartie.browserClosed = true;

    this.dialog.close(this.ratePartie);
  }


  
  

}
