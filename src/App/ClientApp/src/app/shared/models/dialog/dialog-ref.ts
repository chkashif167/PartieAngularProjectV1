import { Subject } from 'rxjs';

export class DialogRef {

  close(result?: any) {
    this._afterClosed.next(result);
  }

  private readonly _afterClosed = new Subject<any>();
  afterClosed = this._afterClosed.asObservable();

  open(result?: any) {
    this._afterOpened.next(result);
  }

  private readonly _afterOpened= new Subject<any>();
  afterOpened = this._afterOpened.asObservable();


  change(result?: any) {
    this._valueChanged.next(result);
  }

  private readonly _valueChanged= new Subject<any>();
  valueChanged = this._valueChanged.asObservable();

}
