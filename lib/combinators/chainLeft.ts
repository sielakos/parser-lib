import {Parser, Either, ParserError} from '../base';
import {many} from './many';
import {liftErrorToState} from './liftErrorToState';

export type OperatorFunction<R> = (a: R, b: R) => R;

function identity<R>(input: R): R {
  return input;
}

interface ChainPart<R> {
  value: R;
  opFunc: Either<ParserError<any>, OperatorFunction<R>>
}

export function chainLeft<R>(parser: Parser<any, R>, operator: Parser<R, OperatorFunction<R>>): Parser<any, R> {
  const pairs: Parser<R, Array<ChainPart<R>>> = many(
    parser.flatMap((value: R) => {
      return liftErrorToState(operator)
        .map(opFunc => ({
          value,
          opFunc
        }));
    })
  );

  return pairs.flatMap((list: Array<ChainPart<R>>) => {
    const acc: Parser<any, ChainPart<R>> = list.length > 0 ?
      Parser.point(list[0]) :
      Parser.fail<any, ChainPart<R>>('Could not parse expression');

    const reduced: Parser<any, ChainPart<R>> = list
      .slice(1)
      .reduce((acc, right) => {
        return acc.flatMap(left =>
          join(left, right)
        );
      }, acc);

    return reduced.map(part => part.value);
  });
}

function join<R>(left: ChainPart<R>, right: ChainPart<R>): Parser<any, ChainPart<R>> {
  if (left.opFunc.isLeft()) {
    return Parser.failWithParserError<any, ChainPart<R>>(left.opFunc.left);
  }

  const func: OperatorFunction<R> = left.opFunc.getOrElse(identity);

  return Parser.point({
    opFunc: right.opFunc,
    value: func(left.value, right.value)
  });
}

