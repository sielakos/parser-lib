import {expect} from 'chai';
import 'mocha';
import {utils} from '../../lib';

const {calculateStatePositionChange} = utils;

describe('utils.calculateStatePositionChange', () => {
  it('should return length of input in col if no \\n or \\r\\n character are inside', () => {
    const input = 'alina ma kota10';

    expect(calculateStatePositionChange(input).col).to.eql(input.length);
  });

  it('should return number of \\n in row', () => {
    const input = '\n\n\n';

    expect(calculateStatePositionChange(input).row).to.eql(input.length);
  });

  it('should return number of \\r\\n in row', () => {
    const input = '\r\n\r\n\r\n';

    expect(calculateStatePositionChange(input).row).to.eql(3);
  });

  it('should handle mixed end lines', () => {
    const input = '\r\n\n\r\n';

    expect(calculateStatePositionChange(input).row).to.eql(3);
  });

  it('should calculate row and col correctly', () => {
    const input = 'ala\n ma\r\nkota\naa';
    const result = calculateStatePositionChange(input);

    expect(result.col).to.eql(2);
    expect(result.row).to.eql(3);
  });
});