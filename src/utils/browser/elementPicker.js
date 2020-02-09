/* eslint-disable no-undef */

function waitForElementPick(done) {
  const createdListeners = [];
  const NODE_TYPE = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    COMMENT: 8,
  };

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

  function injectFollower() {
    const style = document.createElement('style');
    style.id = 'kasaya-follwer-styles';
    style.appendChild(document.createTextNode(''));
    style.innerHTML = `#kasaya-follower {
                font-size: 12px !important;
                font-family: "Comic Sans MS", cursive, sans-serif !important;
                width: 120px !important;
                background-color: red;
                position: fixed !important;
                color: white !important;
                font-weight: bold !important;
                border: 5px solid red !important;
                text-align: center !important;
                border-radius: 100px !important;
                padding: 5px !important;
                cursor: pointer !important;
                z-index: 999999 !important;
                pointer-events: none !important;
                box-shadow: 10px 10px 40px 2px #888888;
              }`;
    document.head.appendChild(style);
    const bodyElement = document.body;
    const follower = document.createElement('div');
    follower.innerHTML = 'Click to Pick this';
    follower.style.display = 'none';
    follower.id = 'kasaya-follower';
    bodyElement.appendChild(follower);
  }

  function createDocumentEventListener(event, listener, capture = false) {
    document.addEventListener(event, listener, capture);
    createdListeners.push({ event, listener, capture });
  }

  function removeCreatedListeners() {
    createdListeners.forEach(({ event, listener, capture }) => {
      document.removeEventListener(event, listener, capture);
    });
  }

  function enableFollower(cb) {
    const follower = document.getElementById('kasaya-follower');
    follower.style.display = '';

    createDocumentEventListener('mouseover', (event) => {
      event.target.classList.add('specelement');
      follower.style.left = `${event.clientX}px`;
      follower.style.top = `${event.clientY}px`;
    });

    createDocumentEventListener('mouseout', (event) => {
      event.target.classList.remove('specelement');
      follower.style.left = `${event.clientX}px`;
      follower.style.top = `${event.clientY}px`;
    });

    createDocumentEventListener('mousemove', (event) => {
      follower.style.left = `${event.clientX - 10}px`;
      follower.style.top = `${event.clientY - 10}px`;
    });

    createDocumentEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      cb(generateXPathFromElement(event.target));
    }, true);
  }

  injectCustomStyles();
  injectFollower();
  enableFollower((xpath) => {
    removeCreatedListeners();
    done(xpath);
  });
}

module.exports = { waitForElementPick };
