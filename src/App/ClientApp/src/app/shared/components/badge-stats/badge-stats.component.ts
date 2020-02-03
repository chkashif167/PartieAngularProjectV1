
import { Component, OnInit } from '@angular/core';


//Services
import { ConfigurationService } from '@partie/shared/services/configuration.service';

import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';
import { DialogConfig } from '@partie/shared/models/dialog/dialog-config';
import { BadgeStats } from '@partie/modules/room/models/rate-host/rate-host.model';



@Component({
  selector: 'partie-badge-stats',
  templateUrl: './badge-stats.component.html',
  styleUrls: ['./badge-stats.component.css']
})
export class BadgeStatsComponent implements OnInit {
  badgeStats: BadgeStats;

  constructor(
    public config: DialogConfig,
    public dialog: DialogRef,
    private readonly configurationService: ConfigurationService) {

  }

  ngOnInit() {
  }


  close(): void {
    
    this.dialog.close();
  }

  getAchievementBadgeUrl(badgeCode:string): string {
    return `${this.configurationService.getCdnBaseUrl}/images/badges/${badgeCode}.png`;
  }

  getBadgeUrl(badgeCode: string): string {
    return `${this.configurationService.getCdnBaseUrl}/images/badges/compliment/${badgeCode}.png`;
  }
}
