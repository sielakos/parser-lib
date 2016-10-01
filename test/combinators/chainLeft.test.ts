import {expect} from 'chai';
import 'mocha';
import {chainLeft, symbol, number, or, between, whitespace} from '../../lib';

describe('chainLeft', () => {
  const operator = or(
    symbol('+'),
    symbol('-')
  ).map(op => {
    if (op === '+') {
      return (a: number, b: number) => a + b;
    }

    return (a: number, b: number) => a - b;
  }).changeErrorMessage('Expected operator');
  const parser = chainLeft(
    between(whitespace(), whitespace(), number),
    operator
  );

  it('it should add numbers', () => {
    const result = parser.parseText('1+2+5d');

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.str).to.eql('d');
      expect(state.col).to.eql(5);
      expect(state.row).to.eql(0);
      expect(state.result).to.eql(8);
    });
  });

  it('should use left associative application of operator functions', () => {
    const result = parser.parseText('1-2-1');

    expect(
      result
        .map(state => state.result)
        .getOrElse(0)
    ).to.eql(-2);
  });

  it('should return correct error when operator fails', () => {
    const result = parser.parseText('1 3+3');

    expect(result.isLeft()).to.eql(true);

    result.onLeft((error) => {
      expect(error.msg).to.eql('Expected operator');
      expect(error.state.str).to.eql('3+3');
      expect(error.state.col).to.eql(2);
      expect(error.state.row).to.eql(0);
    });
  });

  it('should fail when cannot parse anything', () => {
    const result = parser.parseText('d');

    expect(result.isLeft()).to.eql(true);

    result.onLeft((error) => {
      expect(error.msg).to.eql('Could not parse expression');
      expect(error.state.str).to.eql('d');
      expect(error.state.col).to.eql(0);
      expect(error.state.row).to.eql(0);
    });
  });
});
