import { Component, Type, ComponentFactoryResolver, ViewChild, OnDestroy, ComponentRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { InsertionDirective } from '@partie/modules/directive/insertion.directive';
import { Subject } from 'rxjs';
import { DialogRef } from '@partie/shared/models/dialog/dialog-ref';

@Component({
  selector: 'partie-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements AfterViewInit, OnDestroy {

  componentRef: ComponentRef<any>;
  @ViewChild(InsertionDirective) insertionPoint: InsertionDirective;

  private readonly closeSubject = new Subject<any>();
  onClose = this.closeSubject.asObservable();

  childComponentType: Type<any>;

  constructor(private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly cd: ChangeDetectorRef,
    private readonly dialogRef: DialogRef) {
  }

  ngAfterViewInit() {
    this.loadChildComponent(this.childComponentType);
    this.cd.detectChanges();
  }

  loadChildComponent(componentType: Type<any>) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);

    const viewContainerRef = this.insertionPoint.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);

    this.dialogRef.open(this.componentRef);
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
