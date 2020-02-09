function nearestElementFinder(baseElement, filterTag) {
  const targetElementsArr = document.getElementsByTagName(filterTag);

  function generateXPathFromElement(element) {
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

  const getOffset = (el) => {
    const elementRect = el.getBoundingClientRect();
    return {
      x: elementRect.left + window.scrollX,
      y: elementRect.top + window.scrollY,
    };
  };

  const getVisibleParentElement = (element) => {
    const isVisible = !!((element && window.getComputedStyle(element).display !== 'none'));
    if (isVisible) {
      return element;
    }
    return getVisibleParentElement(element.parentElement);
  };

  const distanceList = [];
  try {
    const n = getOffset(baseElement);
    for (let i = 0; i < targetElementsArr.length; i += 1) {
      const element = getVisibleParentElement(targetElementsArr[i]);
      if (element) {
        const p = getOffset(element);
        distanceList.push(
          Math.sqrt(((p.x - n.x) * (p.x - n.x)) + ((p.y - n.y) * (p.y - n.y))),
        );
      } else {
        distanceList.push(Infinity);
      }
    }
  } catch (err) {
    return false;
  }
  const concernedIndex = distanceList.indexOf(Math.min(...distanceList));

  return generateXPathFromElement(targetElementsArr[concernedIndex]);
}

module.exports = { nearestElementFinder };
