function isPageLoaded() {
  return document.readyState === 'complete';
}

function getInnerText(searchPaths) {
  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  const elementInnerTexts = searchPaths
    .map((path) => {
      const element = getElementByXpath(path);
      const elementInnerText = element ? element.innerText : null;
      return (element && !elementInnerText && element.nodeName === 'INPUT') ? { innerText: element.value, xpath: path } : { innerText: elementInnerText, xpath: path };
    })
    .filter((elementDetails) => elementDetails.innerText);

  return elementInnerTexts;
}

function highlightMatches(xpathList) {
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

  function highlightElement(element, badgeValue) {
    if (element) {
      element.classList.add('specelement');
      if (badgeValue !== undefined) {
        element.insertAdjacentHTML('afterend', `<span class="specelement-nrep-badge">${badgeValue}</span>`);
      }
    }
  }

  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  injectCustomStyles();
  xpathList.forEach((xpath, index) => {
    const element = getElementByXpath(xpath);
    highlightElement(element, index);
  });
}

function isElementDisabledFromStyles(el) {
  const styles = window.getComputedStyle(el);
  const cursor = styles.getPropertyValue('cursor');
  const pointerEvents = styles.getPropertyValue('pointer-events');
  return cursor === 'not-allowed' || pointerEvents === 'none';
}

function getPlaceholder(element) {
  return (element.placeholder && element.value === '') ? element.placeholder : '';
}

function simulateDragDrop(sourceNode, destinationNode) {
  const EVENT_TYPES = {
    DRAG_END: 'dragend',
    DRAG_START: 'dragstart',
    DROP: 'drop',
  };

  function createCustomEvent(type) {
    const event = new CustomEvent('CustomEvent');
    event.initCustomEvent(type, true, true, null);
    event.dataTransfer = {
      data: {
      },
      setData(dataType, val) {
        this.data[dataType] = val;
      },
      getData(dataType) {
        return this.data[dataType];
      },
    };
    return event;
  }

  function dispatchEvent(node, type, event) {
    if (node.dispatchEvent) {
      return node.dispatchEvent(event);
    }
    if (node.fireEvent) {
      return node.fireEvent(`on${type}`, event);
    }
  }

  const event = createCustomEvent(EVENT_TYPES.DRAG_START);
  dispatchEvent(sourceNode, EVENT_TYPES.DRAG_START, event);

  const dropEvent = createCustomEvent(EVENT_TYPES.DROP);
  dropEvent.dataTransfer = event.dataTransfer;
  dispatchEvent(destinationNode, EVENT_TYPES.DROP, dropEvent);

  const dragEndEvent = createCustomEvent(EVENT_TYPES.DRAG_END);
  dragEndEvent.dataTransfer = event.dataTransfer;
  dispatchEvent(sourceNode, EVENT_TYPES.DRAG_END, dragEndEvent);
}

module.exports = {
  isPageLoaded,
  getInnerText,
  highlightMatches,
  isElementDisabledFromStyles,
  getPlaceholder,
  simulateDragDrop,
};
