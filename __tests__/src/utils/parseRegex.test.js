const parseRegex = require('../../../src/utils/parseRegex');

describe('parseRegex module test suite', () => {
  it('parseRegex function should return a object of parameterized string', () => {
    const parameterizedStr = 'Created by (?<user>.+) \\((?<userRole>.+)\\) on (?<date>.+) at (?<time>.+)';
    const targetStr = 'Created by kasaya (admin) on 2013.04.04 at 11:30PM';
    const parameterObj = parseRegex(targetStr, parameterizedStr);
    expect(parameterObj.user).toBe('kasaya');
    expect(parameterObj.userRole).toBe('admin');
    expect(parameterObj.date).toBe('2013.04.04');
    expect(parameterObj.time).toBe('11:30PM');
  });
});
