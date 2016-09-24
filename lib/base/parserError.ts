import {State} from './state';

export class ParserError<T> {
  private _state: State<T>;
  private _msg: string;

  constructor(msg: string, state: State<T>) {
    this._msg = msg;
    this._state = state;
  }

  get msg(): string {
    return this._msg;
  }

  get state(): State<T> {
    return this._state;
  }
}