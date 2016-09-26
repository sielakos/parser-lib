import {expect} from 'chai';
import 'mocha';
import {number} from '../../lib';

describe('number', () => {
  it('should parse integer', () => {
    expect(
      number
        .parseText('11')
        .map(state => state.result)
        .getOrElse(0)
    ).to.eql(11);
  });

  it('should parse negative integer', () => {
    expect(
      number
        .parseText('-11')
        .map(state => state.result)
        .getOrElse(0)
    ).to.eql(-11);
  });

  it('should parse real number', () => {
    expect(
      number
        .parseText('11.2')
        .map(state => state.result)
        .getOrElse(0)
    ).to.eql(11.2);
  });

  it('should parse negative real number', () => {
    expect(
      number
        .parseText('-11.2')
        .map(state => state.result)
        .getOrElse(0)
    ).to.eql(-11.2);
  });

  it('should return proper error message in case of fail', () => {
    expect(
      number
        .parseText('=12.3')
        .swap()
        .map(error => error.msg)
        .getOrElse('')
    ).to.eql('Could not parse number');
  });
});
