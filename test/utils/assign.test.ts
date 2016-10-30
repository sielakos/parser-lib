import {utils} from '../../lib';
import {expect} from 'chai';

const {assign} = utils;

describe('assign', () => {
  const obj1 = {
    a: 1,
    b: 2
  };
  const obj2 = {
    c: 3
  };
  const obj3 = {
    b: 4,
    d: 5
  };
  let result: {[key: string]: number};

  beforeEach(() => {
    result = assign(obj1, obj2, obj3);
  });

  it('should merge objects and return new one', () => {
    expect(result).to.eql({
      a: 1,
      b: 4,
      c: 3,
      d: 5
    });
  });

  it('should not modify original objects', () => {
    expect(obj1).to.eql({
      a: 1,
      b: 2
    });

    expect(obj2).to.eql({
      c: 3
    });

    expect(obj3).to.eql({
      b: 4,
      d: 5
    });
  });
});
