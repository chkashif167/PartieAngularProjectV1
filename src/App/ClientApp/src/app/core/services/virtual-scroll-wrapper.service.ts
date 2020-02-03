import { Injectable, ElementRef, ViewChild } from '@angular/core';
import { Subject, from, Subscription } from 'rxjs';

import { Datasource } from 'ngx-ui-scroll';

//@Injectable({
//  providedIn: 'root'
//})
// This service keeps stats and should be provided per component. so don't make it singleton or module level singleton.
export class VirtualScrollWrapperService {
  
  viewportElement: ElementRef;

  dataSource: Datasource;
  bufferSize: number;

  private data: any[];

  private bof = new Subject<any>();
  bof$ = this.bof.asObservable();

  private eof = new Subject<any>();
  eof$ = this.eof.asObservable();

  private appendAtEnd: boolean;

  private minIndex = 0;
  private maxIndex = 0;
  private pageNumber = 1;
  //Source is exhausted and no more data that can be prepended.
  private bofReached: boolean; 

  private disableAutoScroll:boolean;

  private internalBofSubscription: Subscription;

  constructor() {
    this.data = [];
    this.bufferSize = 15;
  }

  getData(): any[] {
    return Array.from(this.data);;
  }

  appendData(items: any | any[]): void {

    items = Array.isArray(items) ? items : [items];
    this.updateVirtualIndex(items, 1, this.maxIndex);
    this.data.push(...items);
    this.maxIndex += items.length;


    if (items.length > 0 && !this.dataSource) {
      this.initDataSource(items.length);
      this.registerBofEvent();

    } else if(this.dataSource) {
      this.dataSource.adapter.append(items, this.appendAtEnd);
    }

    this.autoScroll();
    this.runAdapterDeferred(() => this.dataSource.adapter.clip({ forwardOnly: false, backwardOnly: true }));
    
  }

  prependData(items: any | any[]): void {
    //prepend assumes data source is already initialized.
    if (!this.dataSource) return;

    items = Array.isArray(items) ? items : [items];

    //Source is exhausted and no more data that can be prepended. so do nothing and return.
    if (items.length === 0) {
      this.bofReached = true;
      this.pageNumber--;
      return;
    }

    this.updateVirtualIndex(items, -1, --this.minIndex);

    this.minIndex = this.minIndex - items.length + 1;
    
    this.data = [...items, ...this.data];
    this.dataSource.adapter.prepend(items, true);
    this.runAdapterDeferred(() => this.dataSource.adapter.clip());
  }

  removeData(items: any | any[]): void {
    //prepend assumes data source is already initialized.
    if (!this.dataSource) return;
    items = Array.isArray(items) ? items : [items];

    
    items.map(x => {
      this.data = this.data.filter(item => item.id !== x.id);
      this.dataSource.adapter.remove((m: any) => m.data.id === x.id);
    });
  }

  private initDataSource(itemCount: number): void {
    this.dataSource = new Datasource({
      get: (index, count, success) => {
        const items: any[] = [];
        const upperLimit = (index + count - 1);
        for (let i = index; i <= upperLimit; i++) {
          
          const found = this.data.find(item => item.vsId === i);
          if (found) {
            items.push(found);
          }

        }


        //this is to determine how new items are appended.
        this.appendAtEnd = this.data.length > this.bufferSize;
        success(items);
      },
      settings: {
        bufferSize: this.bufferSize,
        minIndex: 0,
        startIndex: itemCount - this.bufferSize,
        padding: 0.01,
      }
    });
  }

  private autoScroll(): void {

    console.log('Auto scroll disabled:', this.disableAutoScroll);

    if (this.disableAutoScroll || !this.dataSource) return;

    const sub = this.dataSource.adapter.isLoading$.subscribe(isLoading => {
      if (!isLoading) {
        this.viewportElement.nativeElement.scrollTop = this.viewportElement.nativeElement.scrollHeight;
        sub.unsubscribe();
      }

    });

  }

  private runAdapterDeferred(cb: Function): void {

    if (!this.dataSource) return;

    const { adapter } = this.dataSource;
    const clipLimit = this.bufferSize + 5;


    if (!adapter.isLoading && this.dataSource.adapter.itemsCount >= clipLimit) {
      cb();
      return;
    }
    const isLoadingSub = adapter.isLoading$.subscribe(isLoading => {
      if (!isLoading && this.dataSource.adapter.itemsCount >= clipLimit) {
        cb();
      }
      isLoadingSub.unsubscribe();
    });
  }

  private registerBofEvent(): void {

    if (this.internalBofSubscription) return;

    this.internalBofSubscription = this.dataSource.adapter.firstVisible$.subscribe(f => {

      const { lastVisible } = this.dataSource.adapter;


      //if bofReached then data source is exhausted and no more data that can be prepended. Stop emitting the bof$ event.
      if (f.$index === this.minIndex) {  // && !this.bofReached
        this.pageNumber++;
        this.bof.next({ item: f, pageNumber: this.pageNumber });
      }

      const lastIndex = this.data.findIndex(x => x.vsId === lastVisible.$index);
      //disable the auto scroll if user has scrolled up, till they manually scroll down to bottom of view port.
      this.disableAutoScroll = this.data.length - lastIndex > 5;
    });
   
  }

  private updateVirtualIndex(items: any[], stepValue: number, startIndex: number): void {
    let index = startIndex;
    items.forEach(item => {
      item.vsId = index;
      index += stepValue;
    });
  }


  cleanUp(): void {
    this.data = [];
    this.dataSource = null;
    this.appendAtEnd = false;
    this.minIndex = 0;
    this.maxIndex = 0;
    this.pageNumber = 0;
    this.internalBofSubscription.unsubscribe();
    this.internalBofSubscription = null;
  }
  
}
