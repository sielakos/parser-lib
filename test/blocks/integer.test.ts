import {expect} from 'chai';
import 'mocha';
import {integer} from '../../lib';

describe('integer', () => {
  it('should parser integer input', () => {
    expect(
      integer
        .parseText('11')
        .map(status => status.result)
        .getOrElse(0)
    ).to.eql(11);
  });

  it('should fail on real input', () => {
    expect(
      integer
        .parseText('11.2')
        .isLeft()
    ).to.eql(true);
  });

  it('should fail on non number input', () => {
    expect(
      integer
        .parseText('ala')
        .isLeft()
    ).to.eql(true);
  });
});
