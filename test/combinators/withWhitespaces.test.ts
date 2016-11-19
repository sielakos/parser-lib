import {expect} from 'chai';
import {withWhitespaces, integer} from '../../lib';

describe('withWhitespaces', () => {
  describe('with required whitespaces', () => {
    const parser = withWhitespaces(integer);

    it('should allow whitespaces around child parser', () => {
      const input = ' 12 ';
      const result = parser.parseText(input);

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        expect(state.result).to.eql(12);
        expect(state.col).to.eql(input.length);
        expect(state.row).to.eql(0);
        expect(state.str).to.eql('');
      });
    });

    it('whitespaces should not be required', () => {
      const input = '12';
      const result = parser.parseText(input);

      expect(result.isLeft()).to.eql(true);

      result.onLeft(error => {
        const state = error.state;

        expect(state.str).to.eql(input);
        expect(state.col).to.eql(0);
        expect(state.row).to.eql(0);
      });
    });
  });

  describe('without required whitespaces', () => {
    const parser = withWhitespaces(integer, false);

    it('should allow whitespaces around child parser', () => {
      const input = ' 12 ';
      const result = parser.parseText(input);

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        expect(state.result).to.eql(12);
        expect(state.col).to.eql(input.length);
        expect(state.row).to.eql(0);
        expect(state.str).to.eql('');
      });
    });

    it('whitespaces should not be required', () => {
      const input = '12';
      const result = parser.parseText(input);

      expect(result.isRight()).to.eql(true);

      result.onRight(state => {
        expect(state.result).to.eql(12);
        expect(state.col).to.eql(input.length);
        expect(state.row).to.eql(0);
        expect(state.str).to.eql('');
      });
    });

    it('should fail when child parser fails', () => {
      const input = ' 12.4 ';
      const result = parser.parseText(input);

      expect(result.isLeft()).to.eql(true);

      result.onLeft(error => {
        const state = error.state;

        expect(state.str).to.eql(input);
        expect(state.col).to.eql(0);
        expect(state.row).to.eql(0);
      });
    });
  });
});
