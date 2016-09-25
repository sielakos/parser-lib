import {expect} from 'chai';
import 'mocha';
import {utils} from '../../lib';

describe('utils.startsWith', () => {
  it('should return true when string starts with given match', () => {
    expect(utils.startsWith('alan', 'ala')).to.eql(true);
  });

  it('should return false when string does not starts with given match', () => {
    expect(utils.startsWith('kalan', 'ala')).to.eql(false);
  });
});