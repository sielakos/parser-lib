import {Parser, State, createParser} from '../base';

export function lazy<T, R>(parser: ()=>Parser<T, R>): Parser<T, R> {
  let _parser: Parser<T, R> | undefined;
  
  return createParser((state: State<T>) => {
    if (!_parser) {
      _parser = parser();
    }
    
    return _parser.parse(state);
  });
}