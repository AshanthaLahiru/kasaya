const {
  buildRegexEscapedString, buildRegexFromParamString, buildNamedRegexFromParamString, extractParamsFromText,
} = require('../../../src/utils/buildRegex');


describe('buildRegex module test suite', () => {
  test('buildNamedRegexFromParamString function should build a named regular expression string given a parameterized string', () => {
    const parameterizedStr = 'Created by ${user} (${userRole}) on ${date} at ${time}';
    const regexStr = buildNamedRegexFromParamString(parameterizedStr);
    expect(regexStr).toBe('Created by (?<user>.+) \\((?<userRole>.+)\\) on (?<date>.+) at (?<time>.+)');
  });

  test('buildNamedRegexFromParamString function should return the the provided input as is if the input is null/undefined', () => {
    const outUndef = buildNamedRegexFromParamString();
    expect(outUndef).toBeUndefined();
    const outNull = buildNamedRegexFromParamString(null);
    expect(outNull).toBeNull();
  });

  test('buildRegexFromParamString function should build a generic regular expression string given a parameterized string', () => {
    const parameterizedStr = 'Created by ${user} (${userRole}) on ${date} at ${time}';
    const regexStr = buildRegexFromParamString(parameterizedStr);
    expect(regexStr).toBe('Created by (.+) \\((.+)\\) on (.+) at (.+)');
  });

  test('buildRegexFromParamString function should return the the provided input as is if the input is null/undefined', () => {
    const outUndef = buildRegexFromParamString();
    expect(outUndef).toBeUndefined();
    const outNull = buildRegexFromParamString(null);
    expect(outNull).toBeNull();
  });

  test('extractParamsFromText function should extract the parameter values from a given string evaluated against a provided parameterized string', () => {
    const parameterizedStr = 'Created by ${user} (${userRole}) on ${date} at ${time}';
    const text = 'Created by John Doe (Administrator) on 9th July 2018 at 12.00PM';
    const tokens = extractParamsFromText(text, parameterizedStr);
    expect(tokens.user).toBe('John Doe');
    expect(tokens.userRole).toBe('Administrator');
    expect(tokens.date).toBe('9th July 2018');
    expect(tokens.time).toBe('12.00PM');
  });

  test('buildRegexEscapedString function should escape all regex metacharacters from a given string', () => {
    const unescaped = 'Sample text with ^().?';
    const escaped = buildRegexEscapedString(unescaped);
    expect(escaped).toBe('Sample text with \\^\\(\\)\\.\\?');
  });

  test('buildRegexEscapedString function should return the the provided input as is if the input is null/undefined', () => {
    const outUndef = buildRegexEscapedString();
    expect(outUndef).toBeUndefined();
    const outNull = buildRegexEscapedString(null);
    expect(outNull).toBeNull();
  });
});
