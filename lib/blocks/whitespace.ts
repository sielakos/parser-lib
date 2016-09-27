import {Parser, State, createParser} from '../base';
import {regularExpression} from './regularExpression';

export function whitespace<T>(required: boolean = false): Parser<T, T> {
  const regexp = required ? /^\s+/ : /^\s*/;

  return createParser((state: State<T>) => {
    return regularExpression(regexp)
      .changeErrorMessage('Could not parse whitespaces')
      .parse(state)
      .map(newState =>
        newState.map(() => state.result)
      );
  })
}
