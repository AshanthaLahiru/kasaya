const escapeStringRegexp = require('escape-string-regexp');
const { pickBy } = require('lodash');
const parseRegex = require('./parseRegex');

function replaceParamsWith(paramString, paramReplacer) {
  const tokenFormatRegex = /(\$\{[a-zA-Z][0-9a-zA-Z_]*\})/g;
  const tokens = paramString.split(tokenFormatRegex);
  return tokens.reduce((out, curr) => {
    if (/^\$\{[a-zA-Z][0-9a-zA-Z_]*\}$/.test(curr)) {
      return out + curr.replace(/^\$\{([a-zA-Z][0-9a-zA-Z_]*)\}$/g, paramReplacer);
    }
    return out + escapeStringRegexp(curr);
  }, '');
}

function buildNamedRegexFromParamString(paramString) {
  if (paramString) {
    return replaceParamsWith(paramString, '(?<$1>.+)');
  }
  return paramString;
}

function buildRegexFromParamString(paramString) {
  if (paramString) {
    return replaceParamsWith(paramString, '(.+)');
  }
  return paramString;
}

function buildRegexEscapedString(text) {
  if (text) {
    return escapeStringRegexp(text);
  }
  return text;
}

function extractParamsFromText(text, extractionString) {
  const namedRegex = buildNamedRegexFromParamString(extractionString);
  const result = parseRegex(text, namedRegex);
  return pickBy(result, (value, attr) => Number.isNaN(Number(attr)) && !['index', 'input'].includes(attr));
}

function extractArgumentsFromText(argumentString) {
  if (argumentString) {
    const importParams = argumentString.match(/\[(.+)\]/i);
    if (importParams && importParams.length > 1) {
      return importParams[1].split(',');
    }
  }
}

function extractArgumentsFromObject(argumentObject) {
  if (argumentObject) {
    return Object.keys(argumentObject).map((key) => argumentObject[key]);
  }
}

module.exports = {
  buildRegexEscapedString,
  buildRegexFromParamString,
  buildNamedRegexFromParamString,
  extractParamsFromText,
  extractArgumentsFromText,
  extractArgumentsFromObject,
};
