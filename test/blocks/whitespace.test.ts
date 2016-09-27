import {expect} from 'chai';
import 'mocha';
import {whitespace, Parser} from '../../lib';

describe('whitespace', () => {
  it('should parse the white space characters', () => {
    const input = '  \n\t\tdiana';
    const result = whitespace().parseText(input);

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.result).to.eql(null);
      expect(state.row).to.eql(1);
      expect(state.col).to.eql(2);
      expect(state.str).to.eql('diana');
    });
  });

  it('should not change result of previous parser', () => {
    const result = Parser
      .point(12)
      .flatMap(() => whitespace())
      .parseText('  ');

    const value = result
      .map(state => state.result)
      .getOrElse(0);

    expect(result.isRight()).to.eql(true);
    expect(value).to.eql(12);
  });

  it('should not fail if no empty spaces are given', () => {
    const result = whitespace()
      .parseText('d');

    expect(result.isRight()).to.eql(true);
  });

  it('should fail if whitespaces are required and none are given', () => {
    const result = whitespace(true)
      .parseText('d');

    expect(result.isLeft());
  });
});
