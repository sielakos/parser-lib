import {State} from './state';

export class ParserError<T> {
  private _state: State<T>;
  private _msg: string;
  private _additionalInfo: any;

  constructor(msg: string, state: State<T>, additionalInfo?: any) {
    this._msg = msg;
    this._state = state;
    this._additionalInfo = additionalInfo;
  }

  get msg(): string {
    return this._msg;
  }

  get state(): State<T> {
    return this._state;
  }
  
  get additionalInfo(): any {
    return this._additionalInfo;
  }
}