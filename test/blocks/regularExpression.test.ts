import {expect} from 'chai';
import 'mocha';
import {regularExpression} from '../../lib';

describe('regularExpression', () => {
  const state = regularExpression(/^a(\d+)/)
    .parseText('a122d');

  it('should consume text from beginning of state on match', () => {
    const str = state
      .map(state => state.str)
      .getOrElse('');

    expect(str).to.eql('d');
  });

  it('correctly calculates row and col', () => {
    state.onRight(state => {
      expect(state.row).to.eql(0);
      expect(state.col).to.eql(4);
    });
  });

  it('should return matched array', () => {
    const matches = state
      .map(state => state.result)
      .getOrElse([]);

    expect(matches.length).to.eql(2);
    expect(matches).to.deep.equal(['a122', '122']);
  });
});