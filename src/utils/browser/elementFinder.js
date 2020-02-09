/* eslint no-undef: "off", */

function findElements(
  selectorText,
  marker,
  returnMultiple,
  highlightMatches,
  innerHTMLOnly = false,
  highlightIndex,
  direction,
  isInputOnly = false,
) {
  const SELECTOR_ELEMENT_SCORE_CUTOFF = 5;
  const MARKER_ELEMENT_SCORE_CUTOFF = 5;
  const NODE_TYPE = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    COMMENT: 8,
  };

  function injectCustomStyles() {
    const existingStyleElement = document.getElementById('kasaya-styles');
    if (!existingStyleElement) {
      const style = document.createElement('style');
      style.id = 'kasaya-styles';
      style.appendChild(document.createTextNode(''));
      style.innerHTML = `.specelement { 
                    border: 4px solid red !important; 
                } 
                 .specelement-nrep-badge {
                    position: relative !important;
                    font-size: .7em !important; 
                    background: red !important; 
                    color: white !important;
                    padding: 10px !important;
                    width: 18px !important; 
                    height: 18px !important; 
                    text-align: center !important; 
                    line-height: 18px !important; 
                    box-shadow: 0 0 1px #333; 
                    z-index: 99999 !important; 
                 }
                 `;
      document.head.appendChild(style);
    }
  }

  function highlightElement(el, badgeValue) {
    el.classList.add('specelement');
    if (badgeValue !== undefined) {
      el.insertAdjacentHTML('afterend', `<span class="specelement-nrep-badge">${badgeValue}</span>`);
    }
  }

  function generateXPathFromElement(element) {
    let elm = element;
    let segs;
    const vectorGraphicElements = ['svg', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path', 'text'];
    const allNodes = document.getElementsByTagName('*');
    for (segs = []; elm && elm.nodeType === NODE_TYPE.ELEMENT; elm = elm.parentNode) {
      const isVectorGraphicElement = vectorGraphicElements.includes(elm.localName);
      if (!isVectorGraphicElement && elm.hasAttribute('id')) {
        let uniqueIdCount = 0;
        for (let n = 0; n < allNodes.length; n += 1) {
          if (allNodes[n].hasAttribute('id') && allNodes[n].id === elm.id) uniqueIdCount += 1;
          if (uniqueIdCount > 1) break;
        }
        if (uniqueIdCount === 1) {
          segs.unshift(`[@id="${elm.getAttribute('id')}"]`);
          return `//*${segs.join('/')}`;
        }
        segs.unshift(`${elm.localName.toLowerCase()}[@id="${elm.getAttribute('id')}"]`);
      } else {
        let i;
        let sib;
        for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) {
          if (sib.localName === elm.localName) i += 1;
        }
        if (isVectorGraphicElement) {
          segs.unshift(`*[local-name()="${elm.localName}"][${i}]`);
        } else {
          segs.unshift(`${elm.localName.toLowerCase()}[${i}]`);
        }
      }
    }
    return segs.length ? `/${segs.join('/')}` : null;
  }

  function getClosestElementsToBase(baseElement, targetElementsArr) {
    const getOffset = (el) => {
      const elementRect = el.getBoundingClientRect();
      return {
        x: elementRect.left + window.scrollX,
        y: elementRect.top + window.scrollY,
      };
    };

    try {
      const distance = [];
      const n = getOffset(baseElement);
      for (let i = 0; i < targetElementsArr.length; i += 1) {
        const p = getOffset(targetElementsArr[i]);
        distance.push(
          Math.sqrt(((p.x - n.x) * (p.x - n.x)) + ((p.y - n.y) * (p.y - n.y))),
        );
      }
      const concernedIndex = distance.indexOf(Math.min(...distance));
      return targetElementsArr[concernedIndex];
    } catch (err) {
      return false;
    }
  }

  function getClosestElementsToBaseInSpecifiedDirection(targetDirection, baseElement, targetElementsArr) {
    const getOffset = (el, directionFromBase) => {
      const elementRect = el.getBoundingClientRect();
      if (directionFromBase) {
        switch (directionFromBase) {
          case 'top':
            return {
              x: Math.round(elementRect.left + window.scrollX + elementRect.width / 2),
              y: Math.round(elementRect.bottom + window.scrollY),
            };
          case 'bottom':
            return {
              x: Math.round(elementRect.left + window.scrollX + elementRect.width / 2),
              y: Math.round(elementRect.top + window.scrollY),
            };
          case 'left':
            return {
              x: Math.round(elementRect.right + window.scrollX),
              y: Math.round(elementRect.top + window.scrollY + elementRect.height / 2),
            };
          case 'right':
            return {
              x: Math.round(elementRect.left + window.scrollX),
              y: Math.round(elementRect.top + window.scrollY + elementRect.height / 2),
            };
          default:
            return false;
        }
      } else {
        return {
          x: Math.round(elementRect.left + window.scrollX + elementRect.width / 2),
          y: Math.round(elementRect.top + window.scrollY + elementRect.height / 2),
        };
      }
    };


    const calculateScore = (base, target, directionFromBase) => {
      let score = 0;
      const xDeviation = Math.abs(base.x - target.x);
      const yDeviation = Math.abs(base.y - target.y);
      const { innerHeight, innerWidth } = window;

      if (yDeviation > innerHeight / 2 || xDeviation > innerWidth / 2) {
        return null;
      }

      if (directionFromBase === 'left' || directionFromBase === 'right') {
        score -= yDeviation / 5;
        score -= xDeviation / 25;
      } else {
        score -= yDeviation / 25;
        score -= xDeviation / 5;
      }

      return score;
    };

    try {
      const elements = [];
      const n = getOffset(baseElement, undefined);
      for (let i = 0; i < targetElementsArr.length; i += 1) {
        if (typeof targetElementsArr[i].getBoundingClientRect === 'function') {
          const targetElement = targetElementsArr[i];
          const p = getOffset(targetElement, targetDirection);
          switch (targetDirection) {
            case 'top':
              if ((p.y - n.y) < 0) {
                elements.push({
                  score: calculateScore(n, p, targetDirection),
                  index: i,
                  text: targetElement.innerHTML,
                });
              }
              break;
            case 'left':
              if ((p.x - n.x) < 0) {
                elements.push({
                  score: calculateScore(n, p, targetDirection),
                  index: i,
                  text: targetElement.innerHTML,
                });
              }
              break;
            case 'right':
              if ((p.x - n.x) > 0) {
                elements.push({
                  score: calculateScore(n, p, targetDirection),
                  index: i,
                  text: targetElement.innerHTML,
                });
              }
              break;
            case 'bottom':
              if ((p.y - n.y) > 0) {
                elements.push({
                  score: calculateScore(n, p, targetDirection),
                  index: i,
                  text: targetElement.innerHTML,
                });
              }
              break;
            default:
              return false;
          }
        }
      }

      const validElementsWithText = elements.filter((element) => !!element.text && element.score !== null);
      const result = validElementsWithText.reduce((res, obj) => (obj.score < res.score ? res : obj));

      const concernedIndex = result.index;
      return targetElementsArr[concernedIndex];
    } catch (err) {
      return false;
    }
  }

  function calculateElementScore(element, searchRegexStr) {
    function isExactMatch(targetStr, regexStr) {
      // check whether the target string is an exact match of the provided regex matching the case
      const str = targetStr ? targetStr.trim() : undefined;
      return new RegExp(`^${regexStr}$`).test(str);
    }

    function isExactMatchIgnoreCase(targetStr, regexStr) {
      // check whether the target string is an exact match of the provided regex ignoring the case
      const str = targetStr ? targetStr.trim() : undefined;
      return new RegExp(`^${regexStr}$`, 'i').test(str);
    }

    function isPartialMatch(targetStr, regexStr) {
      // check whether the target string contains the text specified by the regex matching the case
      const str = targetStr ? targetStr.trim() : undefined;
      return new RegExp(`${regexStr}`, 'g').test(str);
    }

    function isPartialMatchIgnoreCase(targetStr, regexStr) {
      // check whether the target string contains the text specified by the regex ignoring the case
      const str = targetStr ? targetStr.trim() : undefined;
      return new RegExp(`${regexStr}`, 'gi').test(str);
    }

    function getAttributeValue(el, attribute) {
      return (
        el.attributes
        && el.attributes[attribute]
        && el.attributes[attribute].value
      ) ? String(el.attributes[attribute].value) : false;
    }

    function getPartialMatchPoints(str, regex) {
      const replaced = str.replace(regex, '');
      return ((str.length - replaced.length) / str.length) * 10;
    }

    const points = {
      PTS_INNER_HTML_MATCH: {
        EXACT: 100,
        EXACT_IGNORE_CASE: 100,
        PARTIAL: 0,
        PARTIAL_IGNORE_CASE: 0,
      },
      PTS_INNER_TEXT_MATCH: {
        EXACT: 50,
        EXACT_IGNORE_CASE: 50,
        PARTIAL: 0,
        PARTIAL_IGNORE_CASE: 0,
      },
      PTS_VALUE_ATTR_MATCH: {
        EXACT: 100,
        EXACT_IGNORE_CASE: 50,
        PARTIAL: 10,
        PARTIAL_IGNORE_CASE: 10,
      },
      PTS_NAME_ATTR_MATCH: {
        EXACT: 80,
        EXACT_IGNORE_CASE: 80,
        PARTIAL: 10,
        PARTIAL_IGNORE_CASE: 10,
      },
      PTS_TYPE_ATTR_MATCH: {
        EXACT: 80,
        EXACT_IGNORE_CASE: 80,
        PARTIAL: 10,
        PARTIAL_IGNORE_CASE: 10,
      },
      PTS_TITLE_ATTR_MATCH: {
        EXACT: 100,
        EXACT_IGNORE_CASE: 50,
        PARTIAL: 10,
        PARTIAL_IGNORE_CASE: 10,
      },
      PTS_PLACEHOLDER_ATTR_MATCH: {
        EXACT: 100,
        EXACT_IGNORE_CASE: 100,
        PARTIAL: 50,
        PARTIAL_IGNORE_CASE: 50,
      },
      PTS_ARIA_LABEL_ATTR_MATCH: {
        EXACT: 80,
        EXACT_IGNORE_CASE: 80,
        PARTIAL: 5,
        PARTIAL_IGNORE_CASE: 5,
      },
    };

    function getInnerHTMLScore(innerHTML, regexStr) {
      // calculate scores for element's inner HTML
      let innerHTMLScore = 0;
      if (isExactMatch(innerHTML, regexStr)) innerHTMLScore += points.PTS_INNER_HTML_MATCH.EXACT;
      else if (isExactMatchIgnoreCase(innerHTML, regexStr)) innerHTMLScore += points.PTS_INNER_HTML_MATCH.EXACT_IGNORE_CASE;
      else if (isPartialMatch(innerHTML, regexStr)) {
        innerHTMLScore += points.PTS_INNER_HTML_MATCH.PARTIAL;
        innerHTMLScore += getPartialMatchPoints(innerHTML, new RegExp(regexStr));
      } else if (isPartialMatchIgnoreCase(innerHTML, regexStr)) {
        innerHTMLScore += points.PTS_INNER_HTML_MATCH.PARTIAL_IGNORE_CASE;
        innerHTMLScore += getPartialMatchPoints(innerHTML, new RegExp(regexStr, 'i'));
      }
      return innerHTMLScore;
    }

    function getInnerTextScore(innerText, regexStr) {
      // calculate scores for element's inner text
      // Since &nbsp; is rendered as a space on the page, it should be converted replaced by a space
      // before matching against the search criteria. &nbsp; has the charcode 160 which needs to be
      // used to replace it. Or else \u00a0 unicode character can be used.
      const nbspRegex = new RegExp(String.fromCharCode(160), 'g');
      const normalizedInnerText = innerText ? innerText.replace(nbspRegex, ' ') : innerText;

      let innerTextScore = 0;
      if (isExactMatch(normalizedInnerText, regexStr)) innerTextScore += points.PTS_INNER_TEXT_MATCH.EXACT;
      else if (isExactMatchIgnoreCase(normalizedInnerText, regexStr)) innerTextScore += points.PTS_INNER_TEXT_MATCH.EXACT_IGNORE_CASE;
      else if (isPartialMatch(normalizedInnerText, regexStr)) {
        innerTextScore += points.PTS_INNER_TEXT_MATCH.PARTIAL;
        innerTextScore += getPartialMatchPoints(normalizedInnerText, new RegExp(regexStr));
      } else if (isPartialMatchIgnoreCase(normalizedInnerText, regexStr)) {
        innerTextScore += points.PTS_INNER_TEXT_MATCH.PARTIAL_IGNORE_CASE;
        innerTextScore += getPartialMatchPoints(normalizedInnerText, new RegExp(regexStr, 'i'));
      }
      return innerTextScore;
    }

    function getValueAttrScore(valueAttr, regexStr) {
      // calculate scores for element's title attribute
      let valueScore = 0;
      if (isExactMatch(valueAttr, regexStr)) valueScore += points.PTS_VALUE_ATTR_MATCH.EXACT;
      else if (isExactMatchIgnoreCase(valueAttr, regexStr)) valueScore += points.PTS_VALUE_ATTR_MATCH.EXACT_IGNORE_CASE;
      else if (isPartialMatch(valueAttr, regexStr)) {
        valueScore += points.PTS_VALUE_ATTR_MATCH.PARTIAL;
        valueScore += getPartialMatchPoints(valueAttr, new RegExp(regexStr));
      } else if (isPartialMatchIgnoreCase(valueAttr, regexStr)) {
        valueScore += points.PTS_VALUE_ATTR_MATCH.PARTIAL_IGNORE_CASE;
        valueScore += getPartialMatchPoints(valueAttr, new RegExp(regexStr, 'i'));
      }
      return valueScore;
    }

    function getTitleAttrScore(titleAttr, regexStr) {
      // calculate scores for element's title attribute
      let titleScore = 0;
      if (isExactMatch(titleAttr, regexStr)) titleScore += points.PTS_TITLE_ATTR_MATCH.EXACT;
      else if (isExactMatchIgnoreCase(titleAttr, regexStr)) titleScore += points.PTS_TITLE_ATTR_MATCH.EXACT_IGNORE_CASE;
      else if (isPartialMatch(titleAttr, regexStr)) {
        titleScore += points.PTS_TITLE_ATTR_MATCH.PARTIAL;
        titleScore += getPartialMatchPoints(titleAttr, new RegExp(regexStr));
      } else if (isPartialMatchIgnoreCase(titleAttr, regexStr)) {
        titleScore += points.PTS_TITLE_ATTR_MATCH.PARTIAL_IGNORE_CASE;
        titleScore += getPartialMatchPoints(titleAttr, new RegExp(regexStr, 'i'));
      }
      return titleScore;
    }

    function getAriaLabelAttrScore(ariaLabelAttr, regexStr) {
      // calculate scores for element's aria-label attribute
      let ariaLabelScore = 0;
      if (isExactMatch(ariaLabelAttr, regexStr)) ariaLabelScore += points.PTS_ARIA_LABEL_ATTR_MATCH.EXACT;
      else if (isExactMatchIgnoreCase(ariaLabelAttr, regexStr)) ariaLabelScore += points.PTS_ARIA_LABEL_ATTR_MATCH.EXACT_IGNORE_CASE;
      else if (isPartialMatch(ariaLabelAttr, regexStr)) {
        ariaLabelScore += points.PTS_ARIA_LABEL_ATTR_MATCH.PARTIAL;
        ariaLabelScore += getPartialMatchPoints(ariaLabelAttr, new RegExp(regexStr));
      } else if (isPartialMatchIgnoreCase(ariaLabelAttr, regexStr)) {
        ariaLabelScore += points.PTS_ARIA_LABEL_ATTR_MATCH.PARTIAL_IGNORE_CASE;
        ariaLabelScore += getPartialMatchPoints(ariaLabelAttr, new RegExp(regexStr, 'i'));
      }
      return ariaLabelScore;
    }

    function getPlaceholderAttrScore(placeholderAttr, regexStr) {
      // calculate scores for element's placeholder attribute
      let placeholderScore = 0;
      if (isExactMatch(placeholderAttr, regexStr)) placeholderScore += points.PTS_PLACEHOLDER_ATTR_MATCH.EXACT;
      else if (isExactMatchIgnoreCase(placeholderAttr, regexStr)) placeholderScore += points.PTS_PLACEHOLDER_ATTR_MATCH.EXACT_IGNORE_CASE;
      else if (isPartialMatch(placeholderAttr, regexStr)) {
        placeholderScore += points.PTS_PLACEHOLDER_ATTR_MATCH.PARTIAL;
        placeholderScore += getPartialMatchPoints(placeholderAttr, new RegExp(regexStr));
      } else if (isPartialMatchIgnoreCase(placeholderAttr, regexStr)) {
        placeholderScore += points.PTS_PLACEHOLDER_ATTR_MATCH.PARTIAL_IGNORE_CASE;
        placeholderScore += getPartialMatchPoints(placeholderAttr, new RegExp(regexStr, 'i'));
      }
      return placeholderScore;
    }


    function getNameAttrScore(nameAttribute, regexStr) {
      // calculate scores for element's placeholder attribute
      let nameScore = 0;
      if (isExactMatch(nameAttribute, regexStr)) nameScore += points.PTS_NAME_ATTR_MATCH.EXACT;
      else if (isExactMatchIgnoreCase(nameAttribute, regexStr)) nameScore += points.PTS_NAME_ATTR_MATCH.EXACT_IGNORE_CASE;
      else if (isPartialMatch(nameAttribute, regexStr)) {
        nameScore += points.PTS_NAME_ATTR_MATCH.PARTIAL;
        nameScore += getPartialMatchPoints(nameAttribute, new RegExp(regexStr));
      } else if (isPartialMatchIgnoreCase(nameAttribute, regexStr)) {
        nameScore += points.PTS_NAME_ATTR_MATCH.PARTIAL_IGNORE_CASE;
        nameScore += getPartialMatchPoints(nameAttribute, new RegExp(regexStr, 'i'));
      }
      return nameScore;
    }

    function getTypeAttrScore(typeAttribute, regexStr) {
      // calculate scores for element's placeholder attribute
      let typeScore = 0;
      if (isExactMatch(typeAttribute, regexStr)) typeScore += points.PTS_TYPE_ATTR_MATCH.EXACT;
      else if (isExactMatchIgnoreCase(typeAttribute, regexStr)) typeScore += points.PTS_TYPE_ATTR_MATCH.EXACT_IGNORE_CASE;
      else if (isPartialMatch(typeAttribute, regexStr)) {
        typeScore += points.PTS_TYPE_ATTR_MATCH.PARTIAL;
        typeScore += getPartialMatchPoints(typeAttribute, new RegExp(regexStr));
      } else if (isPartialMatchIgnoreCase(typeAttribute, regexStr)) {
        typeScore += points.PTS_TYPE_ATTR_MATCH.PARTIAL_IGNORE_CASE;
        typeScore += getPartialMatchPoints(typeAttribute, new RegExp(regexStr, 'i'));
      }
      return typeScore;
    }

    const elementInnerHTML = element.innerHTML;
    const elementInnerText = element.innerText;
    const title = getAttributeValue(element, 'title');
    const value = getAttributeValue(element, 'value');
    const ariaLabel = getAttributeValue(element, 'aria-label');
    const placeholder = getAttributeValue(element, 'placeholder');
    const name = getAttributeValue(element, 'name');
    const type = getAttributeValue(element, 'type');

    let score = 0;

    score += getInnerHTMLScore(elementInnerHTML, searchRegexStr);
    score += getInnerTextScore(elementInnerText, searchRegexStr);

    if (!innerHTMLOnly) {
      score += getTitleAttrScore(title, searchRegexStr);
      score += getValueAttrScore(value, searchRegexStr);
      score += getAriaLabelAttrScore(ariaLabel, searchRegexStr);
      score += getPlaceholderAttrScore(placeholder, searchRegexStr);
      score += getNameAttrScore(name, searchRegexStr);
      score += getTypeAttrScore(type, searchRegexStr);
    }

    return score;
  }

  function calculateScores(searchRegexStr, isMarker = false) {
    const scoresList = [];
    function calculateScoresRecurs(element, scores = []) {
      element.childNodes.forEach((child) => {
        let isVisible = true;
        if (child.nodeType === NODE_TYPE.ELEMENT && (isMarker || !isInputOnly)) {
          const currentElementStyle = window.getComputedStyle(child);
          if (currentElementStyle.display === 'none' || currentElementStyle.opacity === '0' || currentElementStyle.visibility === 'hidden') isVisible = false;
        }

        if (isVisible) {
          scores.push({
            element: child,
            score: calculateElementScore(child, searchRegexStr),
          });

          calculateScoresRecurs(child, scores);
        }
      });
    }

    calculateScoresRecurs(document.body, scoresList);
    return scoresList;
  }

  injectCustomStyles();
  const scoreCard = calculateScores(selectorText);
  const filteredTargetScores = scoreCard
    .filter((curr) => curr.score > SELECTOR_ELEMENT_SCORE_CUTOFF)
    .sort((s1, s2) => {
      if (s1.score < s2.score) { return 1; }
      if (s1.score > s2.score) { return -1; }
      return 0;
    });

  if (filteredTargetScores.length === 0) return { success: false, code: 'TARGET_NOT_FOUND' };
  const topTargetMatches = filteredTargetScores.filter((curr) => curr.score === filteredTargetScores[0].score);

  if (topTargetMatches.length === 1) {
    if (highlightMatches) {
      highlightElement(topTargetMatches[0].element);
    }
    return {
      success: true,
      targetResults: [generateXPathFromElement(topTargetMatches[0].element)],
      score: topTargetMatches[0].score,
    };
  }

  if (marker) {
    const markerScoreCard = calculateScores(marker, true);
    const filteredMarkerScores = markerScoreCard
      .filter((curr) => curr.score > MARKER_ELEMENT_SCORE_CUTOFF)
      .sort((s1, s2) => {
        if (s1.score < s2.score) { return 1; }
        if (s1.score > s2.score) { return -1; }
        return 0;
      });
    if (filteredMarkerScores.length === 0) {
      return {
        success: false,
        code: 'BASE_ELEMENT_NOT_FOUND',
      };
    }
    const topMarkerMatches = filteredMarkerScores.filter((curr) => curr.score === filteredMarkerScores[0].score);
    if (topMarkerMatches.length > 1) {
      return {
        success: false,
        code: 'MULTIPLE_BASE_ELEMENTS',
        baseElementResults: topMarkerMatches.map((curr) => generateXPathFromElement(curr.element)).filter((curr) => curr),
      };
    }

    const baseElement = topMarkerMatches[0].element;
    let closestElement;

    //  using getClosestElementsToBase can result in unexpected outputs
    //  if there are more than one elements having the same minimum
    //  distance from the base. This should be improved in the future

    if (direction) {
      closestElement = getClosestElementsToBaseInSpecifiedDirection(direction, baseElement, topTargetMatches.map((curr) => curr.element));
    } else {
      closestElement = getClosestElementsToBase(baseElement, topTargetMatches.map((curr) => curr.element));
    }

    if (highlightMatches) highlightElement(closestElement, 0);
    return {
      success: true,
      targetResults: [generateXPathFromElement(closestElement)],
      score: topTargetMatches[0].score,
    };
  }

  if (highlightMatches) {
    if (highlightIndex) highlightElement(topTargetMatches[highlightIndex].element);
    else topTargetMatches.map((curr) => curr.element).forEach(highlightElement);
  }

  const result = {
    success: true,
    targetResults: topTargetMatches.map((curr) => generateXPathFromElement(curr.element)).filter((curr) => curr),
  };

  if (result.targetResults.length === 1) {
    return result;
  }
  // Remove multiple parent matches for same child element
  const filteredList = [];
  for (let i = 0; i < result.targetResults.length; i += 1) {
    let isValidXpath = true;
    for (let p = i + 1; p < result.targetResults.length; p += 1) {
      if (result.targetResults[p].startsWith(result.targetResults[i])) {
        isValidXpath = false;
        break;
      }
    }
    if (isValidXpath) filteredList.push(result.targetResults[i]);
  }
  result.targetResults = filteredList;
  return result;
}

module.exports = {
  findElements,
};
