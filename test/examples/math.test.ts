import {expect} from 'chai';
import 'mocha';
import {between, keyword, number, Parser, or, lazy, chainLeft, chainRight} from '../../lib';

describe('math parser example', () => {
  let parser: Parser<any, number>;
  
  beforeEach(() => {
    const atom: Parser<any, number> = or(
      number,
      lazy(() =>
        between(
          keyword('(', false),
          keyword(')', false),
          parser
        )
      )
    );
    
    const lvl1: Parser<any, number> = chainRight(
      atom,
      keyword('^', false)
        .map(() => Math.pow)
    );
    
    const lvl2Op = or(
      keyword('*', false)
        .map(() =>
          (a: number, b: number) => a * b
        ),
      keyword('/', false)
        .map(() =>
          (a: number, b: number) => a / b
        )
    );
    
    const lvl2: Parser<any, number> = chainLeft(lvl1, lvl2Op);
    
    const lvl3Op = or(
      keyword('+', false)
        .map(() =>
          (a: number, b: number) => a + b
        ),
      keyword('-', false)
        .map(() =>
          (a: number, b: number) => a - b
        )
    );
    
    const lvl3 = chainLeft(lvl2, lvl3Op);
    
    parser = lvl3;
  });
  
  it('should be able to parse numbers', () => {
    const result = parser.parseText('23.2');
    
    expect(result.isRight()).to.eql(true);
    
    result.onRight(state => {
      expect(state.str).to.eql('');
      expect(state.col).to.eql(4);
      expect(state.row).to.eql(0);
      expect(state.result).to.eql(23.2);
    });
  });
  
  it('should be able to parse simple math expressions', () => {
    expect(parseAndGetResult('2 + 2')).to.eql(4);
    expect(parseAndGetResult('2 + 2 + 1')).to.eql(5);
    expect(parseAndGetResult('2 + 2 - 1')).to.eql(3);
    expect(parseAndGetResult('2 * 3 - 1')).to.eql(5);
    expect(parseAndGetResult('2 + 5 * 2')).to.eql(12);
    expect(parseAndGetResult('2 * 5 ^ 2')).to.eql(50);
    expect(parseAndGetResult('2 * 5 ^ 2 ^ 2')).to.eql(1250);
    expect(parseAndGetResult('5 ^ 3 ^ 2 - (5 ^ 3) ^ 2')).to.eql(1937500);
    expect(parseAndGetResult('30/(2 + 1)')).to.eql(10);
  });
  
  function parseAndGetResult(text: string): number {
    const result = parser.parseText(text);
    
    if (result.isLeft()) {
      throw result;
    }
    
    return result
      .map(state => state.result)
      .getOrElse(0);
  }
});