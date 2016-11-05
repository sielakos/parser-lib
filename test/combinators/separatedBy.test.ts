import {expect} from 'chai';
import 'mocha';
import {separatedBy, symbol, number} from '../../lib';

describe('separatedBy', () => {
  describe('with string as separator', () => {
    const parser = separatedBy(number, ',');

    it('should produce list of values on match', () => {
      const input = '1,4 ,5, 7 , 6';
      const result = parser.parseText(input + 'd');

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        const expectedValues = [1, 4, 5, 7, 6];

        expect(state.result).to.deep.equal(expectedValues);
        expect(state.row).to.eql(0);
        expect(state.col).to.eql(input.length);
        expect(state.str).to.eql('d');
      });
    });

    it('should produce list of values on match', () => {
      const result = parser.parseText('1,4,5,7d');

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        const expectedValues = [1, 4, 5, 7];

        expect(state.result).to.deep.equal(expectedValues);
        expect(state.row).to.eql(0);
        expect(state.col).to.eql(
          expectedValues.join(',').length
        );
        expect(state.str).to.eql('d');
      });
    });

    it('should produce empty list', () => {
      const result = parser.parseText('d');

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        const expectedValues = [];

        expect(state.result).to.deep.equal(expectedValues);
        expect(state.row).to.eql(0);
        expect(state.col).to.eql(0);
        expect(state.str).to.eql('d');
      });
    });

    it('produce singleton', () => {
      const result = parser.parseText('1d');

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        const expectedValues = [1];

        expect(state.result).to.deep.equal(expectedValues);
        expect(state.row).to.eql(0);
        expect(state.col).to.eql(1);
        expect(state.str).to.eql('d');
      });
    });

    it('should fail if list last element fails', () => {
      const result = parser.parseText('1,4,5,7,d');

      expect(result.isLeft()).to.eql(true);
    });
  });

  describe('with parser as separator', () => {
    const parser = separatedBy(number, symbol(','));

    it('should produce list of values on match', () => {
      const result = parser.parseText('1,4,5,7d');

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        const expectedValues = [1, 4, 5, 7];

        expect(state.result).to.deep.equal(expectedValues);
        expect(state.row).to.eql(0);
        expect(state.col).to.eql(
          expectedValues.join(',').length
        );
        expect(state.str).to.eql('d');
      });
    });

    it('should produce empty list', () => {
      const result = parser.parseText('d');

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        const expectedValues = [];

        expect(state.result).to.deep.equal(expectedValues);
        expect(state.row).to.eql(0);
        expect(state.col).to.eql(0);
        expect(state.str).to.eql('d');
      });
    });

    it('produce singleton', () => {
      const result = parser.parseText('1d');

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        const expectedValues = [1];

        expect(state.result).to.deep.equal(expectedValues);
        expect(state.row).to.eql(0);
        expect(state.col).to.eql(1);
        expect(state.str).to.eql('d');
      });
    });

    it('should fail if list last element fails', () => {
      const result = parser.parseText('1,4,5,7,d');

      expect(result.isLeft()).to.eql(true);
    });
  });
});
