import {Parser, Either, ParserError} from '../base';
import {many1} from './many';
import {liftErrorToState} from './liftErrorToState';

export type OperatorFunction<R> = (a: R, b: R) => R;
type JoinFunc<R> = (left: ChainPart<R>, right: ChainPart<R>) => Parser<any, ChainPart<R>>;

function identity<R>(input: R): R {
  return input;
}

interface ChainPart<R> {
  value: R;
  opFunc: Either<ParserError<any>, OperatorFunction<R>>
}

export function chainRight<R>(parser: Parser<any, R>, operator: Parser<R, OperatorFunction<R>>): Parser<any, R> {
  var pairs = createPairsParser(parser, operator);

  return pairs.flatMap((list: Array<ChainPart<R>>) => {
    return reduceChainParts(list.reverse(), joinRight)
      .map(part => part.value);
  });
}

export function chainLeft<R>(parser: Parser<any, R>, operator: Parser<R, OperatorFunction<R>>): Parser<any, R> {
  var pairs = createPairsParser(parser, operator);

  return pairs.flatMap((list: Array<ChainPart<R>>) => {
    return reduceChainParts(list, joinLeft)
      .map(part => part.value);
  });
}

function createPairsParser<R>(parser: Parser<any, R>, operator: Parser<R, OperatorFunction<R>>): Parser<R, Array<ChainPart<R>>> {
  return many1(
    parser.flatMap((value: R) => {
      return liftErrorToState(operator)
        .map(opFunc => ({
          value,
          opFunc
        }));
    })
  );
}

function reduceChainParts<R>(list: Array<ChainPart<R>>, join: JoinFunc<R>): Parser<any, ChainPart<R>> {
  const acc: Parser<any, ChainPart<R>> = list.length > 0 ?
    Parser.point(list[0]) :
    Parser.fail<any, ChainPart<R>>('Expected chained left expression');

  return list
    .slice(1)
    .reduce((acc, right) => {
      return acc.flatMap(left =>
        join(left, right)
      );
    }, acc);
}

function joinLeft<R>(left: ChainPart<R>, right: ChainPart<R>): Parser<any, ChainPart<R>> {
  if (left.opFunc.isLeft()) {
    return Parser.failWithParserError<any, ChainPart<R>>(left.opFunc.left);
  }

  const func: OperatorFunction<R> = left.opFunc.getOrElse(identity);

  return Parser.point({
    opFunc: right.opFunc,
    value: func(left.value, right.value)
  });
}

function joinRight<R>(left: ChainPart<R>, right: ChainPart<R>): Parser<any, ChainPart<R>> {
  if (right.opFunc.isLeft()) {
    return Parser.failWithParserError<any, ChainPart<R>>(right.opFunc.left);
  }

  const func: OperatorFunction<R> = right.opFunc.getOrElse(identity);

  return Parser.point({
    opFunc: right.opFunc,
    value: func(right.value, left.value)
  });
}
