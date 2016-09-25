import {Parser, Either, ParserError, createParser} from '../base';

export function regularExpression(regexp: RegExp): Parser<any, Array<string>> {
  return createParser(state => {
    const matches = state.str.match(regexp);

    if (matches && matches.length > 0) {
      const newState = state
        .consumeText(matches[0])
        .map(() => matches.slice()); //returns only pure Array<string>

      return Either.point(newState);
    }

    return Either.left(
      new ParserError(`Couldn't match regular expression ${regexp}`, state)
    );
  });
}