/* eslint-disable no-undef */

function eraseHighlights() {
  // remove custom styles
  const kasayaStyles = document.getElementById('kasaya-styles');
  const kasayaFollowerStyles = document.getElementById('kasaya-follwer-styles');
  if (kasayaStyles) kasayaStyles.parentElement.removeChild(kasayaStyles);
  if (kasayaFollowerStyles) kasayaFollowerStyles.parentElement.removeChild(kasayaFollowerStyles);

  // remove follower element
  const follower = document.getElementById('kasaya-follower');
  if (follower) follower.parentElement.removeChild(follower);

  // remove highlights
  const highlightedElements = document.getElementsByClassName('specelement');
  if (highlightedElements && highlightedElements.length > 0) {
    while (highlightedElements[0]) {
      highlightedElements[0].classList.remove('specelement');
    }
  }
  const badges = document.getElementsByClassName('specelement-nrep-badge');
  if (badges && badges.length > 0) {
    while (badges[0]) {
      const curr = badges[0];
      curr.parentElement.removeChild(curr);
    }
  }
}

module.exports = { eraseHighlights };
