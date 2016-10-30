import {Parser, createParser, ParserError} from '../base';

export function sequence<R>(...parsers: Array<Parser<any, R>>): Parser<any, Array<R>> {
  if (parsers.length === 0) {
    return Parser.fail<R, Array<R>>('Expected at lest one parser in sequence');
  }

  const first = parsers[0].map(result => [result]);
  const rest = parsers.slice(1);

  const sequenceParser = rest.reduce((current, next) => {
    return current.flatMap(list => {
      return next.map(value =>
        list.concat(value)
      );
    });
  }, first);

  return createParser(state => {
    const result = sequenceParser.parse(state);

    if (result.isLeft()) {
      return result
        .swap()
        .map(error => {
          return new ParserError(error.msg, state, error.additionalInfo);
        })
        .swap();
    }

    return result;
  });
}