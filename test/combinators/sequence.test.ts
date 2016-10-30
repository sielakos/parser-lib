import {expect} from 'chai';
import {sequence, keyword} from '../../lib';

describe('sequence', () => {
  const parser = sequence(
    keyword('a1', false),
    keyword('a2', false),
    keyword('a3', false)
  );

  it('should parse sequence of parsers and return array of results', () => {
    const input = ' a1 a2 a3 ';
    const result = parser.parseText(input + 'd');

    expect(result.isRight()).to.eql(true);

    result.onRight(state => {
      expect(state.result).to.eql(['a1', 'a2', 'a3']);
      expect(state.str).to.eql('d');
      expect(state.col).to.eql(input.length);
      expect(state.row).to.eql(0);
    });
  });

  it('should fail if any of parsers fail', () => {
    const input = ' a1 a3 a3 ';
    const result = parser.parseText(input);

    expect(result.isRight()).to.eql(false);

    result.onLeft(error => {
      const state = error.state;

      expect(error.msg).to.contain('a2');
      expect(state.str).to.eql(input);
      expect(state.col).to.eql(0);
      expect(state.row).to.eql(0);
    });
  });
});