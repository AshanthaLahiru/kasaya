const XRegExp = require('xregexp');

module.exports = (targetString, regex, flags) => XRegExp.exec(targetString, XRegExp(regex, flags));
