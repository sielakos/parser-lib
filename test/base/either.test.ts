import {expect} from 'chai';
import 'mocha';
import {Either} from '../../lib';

describe('Either', () => {
  describe('point', () => {
    it('should create new right either instance with given value', () => {
      const either = Either.point(15);

      expect(either.isRight()).to.eql(true);

      either.onRight(value =>
        expect(value).to.eql(15)
      );
    });
  });

  describe('left', () => {
    it('should create new left either instance with given error', () => {
      const either = Either.left('error');

      expect(either.isLeft()).to.eql(true);
      either.onLeft(value =>
        expect(value).to.eql('error')
      );
    });
  });

  describe('isRight', () => {
    it('should return true when instance is right', () => {
      expect(Either.point(15).isRight()).to.eql(true);
    });

    it('should return false when instance is left', () => {
      expect(Either.left(15).isRight()).to.eql(false);
    });
  });

  describe('isLeft', () => {
    it('should return false when instance is right', () => {
      expect(Either.point(15).isLeft()).to.eql(false);
    });

    it('should return true when instance is left', () => {
      expect(Either.left(15).isLeft()).to.eql(true);
    });
  });

  describe('flatMap', () => {
    it('should map value to right when instance is right', () => {
      const either = Either
        .point(5)
        .flatMap(n => Either.point(n + 5));

      expect(either.isRight()).to.eql(true);

      either.onRight(value =>
        expect(value).to.eql(10)
      );
    });

    it('should map value to left when instance is right', () => {
      const either = Either
        .point(5)
        .flatMap(n => Either.left(n + 5));

      expect(either.isLeft()).to.eql(true);

      either.onLeft(value =>
        expect(value).to.eql(10)
      );
    });

    it('should do nothing when instance is left', () => {
      const either = Either
        .left('error')
        .flatMap(n => Either.point(n + 5));

      expect(either.isLeft()).to.eql(true);
      either.onLeft(value =>
        expect(value).to.eql('error')
      );
    });
  });

  describe('map', () => {
    it('should transform value of right instance', () => {
      const either = Either
        .point(7)
        .map(n => n * 2);

      expect(either.isRight()).to.eql(true);
      either.onRight(value =>
        expect(value).to.eql(14)
      );
    });

    it('should do nothing to left instance', () => {
      const either =  Either
        .left(7)
        .map(n => n * 2);

      expect(either.isLeft()).to.eql(true);
      either.onLeft(value =>
        expect(value).to.eql(7)
      );
    });
  });

  describe('swap', () => {
    it('should change left to right', () => {
      const either = Either
        .left(5)
        .swap();

      expect(either.isRight()).to.eql(true);
      either.onRight(value =>
        expect(value).to.eql(5)
      );
    });

    it('should change right to left', () => {
      const either = Either
        .point(5)
        .swap();

      expect(either.isLeft()).to.eql(true);
      either.onLeft(value =>
        expect(value).to.eql(5)
      );
    });
  });

  describe('catchError', () => {
    it('should map left instance to new either', () => {
      const either = Either
        .left(5)
        .catchError(n => Either.point(n * 3));

      expect(either.isRight()).to.eql(true);
      either.onRight(value =>
        expect(value).to.eql(15)
      );
    });

    it('should do nothing to right instance', () => {
      const either = Either
        .point(8)
        .catchError(n => Either.point(n * 3));

      expect(either.isRight()).to.eql(true);
      either.onLeft(value =>
        expect(value).to.eql(8)
      );
    });
  });

  describe('onRight', () => {
    it('should be called when instance is right with correct value', () => {
      let value: number | undefined;

      Either
        .point(15)
        .onRight(_value => value = _value);

      expect(value).to.eql(15);
    });
  });

  describe('onLeft', () => {
    it('should be called when instance is left with correct value', () => {
      let value: number | undefined;

      Either
        .left(15)
        .onLeft(_value => value = _value);

      expect(value).to.eql(15);
    });
  });

  describe('getOrElse', () => {
    it('should return right value', () => {
      expect(
        Either
          .point(15)
          .getOrElse(13)
      ).to.eql(15);
    });

    it('should return default value', () => {
      expect(
        Either
          .left(15)
          .getOrElse(13)
      ).to.eql(13);
    });
  });

  describe('right', () => {
    it('should be alias for Either.point', () => {
      expect(Either.right === Either.point).to.eql(true);
    });
  });
});