import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteUtilityService {

  private currentUrl: string;
  //private previousUrl: string;
  private backButtonClicked:boolean;
  urlHistory: string[];
  skipUrls:string[];

  constructor(private readonly router: Router, ) {
    this.buildSkippedUrls();
    this.urlHistory = [];
    this.backButtonClicked = false;
  }

  init(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((e: any) => {
        

        if (this.currentUrl && !this.backButtonClicked) {
          this.pushToUrlHistory(this.currentUrl);
        } else {
          this.backButtonClicked = false;
        }
        
        this.currentUrl = e.url == undefined ? '/' : e.url;
        
      });
  }
  navigateToPreviousUrl(fallBackUrl = '/'): void {

    let prvUrl = this.popFromUrlHistory();

    prvUrl = prvUrl === undefined ? fallBackUrl : prvUrl;

    this.backButtonClicked = true;
    this.router.navigateByUrl(prvUrl);

  }

  navigateToUrl(url: string): void {
    this.router.navigateByUrl(url);
  }

  private pushToUrlHistory(url: string): void {
    const skipUrl = this.skipUrls.filter(x => url.toLowerCase().includes(x));
    if (skipUrl[0] === undefined && url.toLowerCase() !== '/notifications') {
      this.urlHistory.push(url);
    }
  }

  private popFromUrlHistory(): string {

    if (this.urlHistory.length === 0)
      return undefined;

    const url = this.urlHistory[this.urlHistory.length - 1];
    this.urlHistory.pop();
    return url;
  }


  private buildSkippedUrls(): void {
    this.skipUrls = [
      '/invitation/accept/'
    ];
  }

}
