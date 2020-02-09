function getCrossElements(rowElementXpath, columnElementXpath, xThreshold = 100, yThreshold = 50) {
  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  function getElementCenter(element) {
    const elRect = element.getBoundingClientRect();
    return {
      x: Math.round(elRect.left + window.scrollX + elRect.width / 2),
      y: Math.round(elRect.top + window.scrollY + elRect.height / 2),
    };
  }

  function generateXPathFromElement(element) {
    const targetElementsArr = document.getElementsByTagName('*');
    const NODE_TYPE_ELEMENT = 1;
    let elm = element;
    let segs;
    const vectorGraphicElements = ['svg', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path', 'text'];
    for (segs = []; elm && elm.nodeType === NODE_TYPE_ELEMENT; elm = elm.parentNode) {
      const isVectorGraphicElement = vectorGraphicElements.includes(elm.localName);
      if (!isVectorGraphicElement && elm.hasAttribute('id')) {
        let uniqueIdCount = 0;
        for (let n = 0; n < targetElementsArr.length; n += 1) {
          if (targetElementsArr[n].hasAttribute('id') && targetElementsArr[n].id === elm.id) uniqueIdCount += 1;
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

  const rowElement = getElementByXpath(rowElementXpath);
  const columnElement = getElementByXpath(columnElementXpath);

  if (!rowElement || !columnElement) {
    return {
      success: false,
      targetResults: [],
    };
  }

  const crossListElements = [];
  const rowElementCenterCoordinate = getElementCenter(rowElement);
  const columnElementCenterCoordinate = getElementCenter(columnElement);

  function filterElements(element) {
    element.childNodes.forEach((child) => {
      if (child && child.nodeType === 1) {
        const currentElementStyle = window.getComputedStyle(child);
        if (currentElementStyle.display === 'none' || currentElementStyle.visibility === 'hidden' || currentElementStyle.opacity === '0') {
          return;
        }

        const searchElementCenterCoordinate = getElementCenter(child);
        if ((Math.abs(searchElementCenterCoordinate.y - rowElementCenterCoordinate.y) < yThreshold) && (Math.abs(searchElementCenterCoordinate.x - columnElementCenterCoordinate.x) < xThreshold)) {
          crossListElements.push(child);
        }
        filterElements(child);
      }
    });
  }

  filterElements(document.body);

  const crossListXpath = crossListElements.map((element) => generateXPathFromElement(element));
  const filteredList = [];
  for (let i = 0; i < crossListXpath.length; i += 1) {
    let isValidXpath = true;
    for (let p = i + 1; p < crossListXpath.length; p += 1) {
      if (crossListXpath[p].startsWith(crossListXpath[i])) {
        isValidXpath = false;
        break;
      }
    }
    if (isValidXpath) filteredList.push(crossListXpath[i]);
  }

  if (filteredList.length > 0) {
    return {
      success: true,
      targetResults: filteredList,
    };
  }
  return {
    success: false,
    targetResults: [],
  };
}

module.exports = {
  getCrossElements,
};
