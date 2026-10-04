'use strict';
const viewers = [...document.querySelectorAll('.viewer-shell')];
let expandedViewer = null;
let previousFocus = null;
let inertSiblings = [];
// Keep Unity UI text at a stable Full HD viewport, including on high-DPI phones.
// Resizing a small Unity canvas left its existing text glyphs visibly blurred.
// Cross-origin frames can report a different pixel ratio from the parent page.
const viewerWidth = 1920;
const viewerHeight = 1080;

function setStatus(viewer, message) {
  viewer.querySelector('.viewer-status').textContent = message;
}

function updateExpansionButtons(viewer, expanded) {
  viewer.querySelector('[data-fullscreen]').hidden = expanded;
  viewer.querySelector('[data-close]').hidden = !expanded;
}

function restoreExpansion() {
  if (!expandedViewer) return;
  const viewer = expandedViewer;
  expandedViewer = null;
  viewer.classList.remove('is-expanded');
  viewer.removeAttribute('role');
  viewer.removeAttribute('aria-modal');
  viewer.removeAttribute('aria-label');
  document.body.classList.remove('viewer-expanded');
  inertSiblings.forEach(([element, wasInert]) => { element.inert = wasInert; });
  inertSiblings = [];
  updateExpansionButtons(viewer, false);
  if (viewer.querySelector('iframe')) setStatus(viewer, '처음에는 작업물을 불러오는 시간이 필요합니다.');
  const focusTarget = previousFocus?.isConnected && !previousFocus.hidden
    ? previousFocus : viewer.querySelector('[data-fullscreen]');
  previousFocus = null;
  focusTarget.focus({ preventScroll: true });
}

function expandInPage(viewer) {
  expandedViewer = viewer;
  viewer.classList.add('is-expanded');
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-label', viewer.dataset.title);
  document.body.classList.add('viewer-expanded');
  // Leave the player and its controls interactive, and exclude the background.
  for (let branch = viewer; branch.parentElement && branch !== document.body; branch = branch.parentElement) {
    [...branch.parentElement.children].filter(element => element !== branch).forEach(element => {
      inertSiblings.push([element, element.inert]);
      element.inert = true;
    });
  }
  updateExpansionButtons(viewer, true);
  setStatus(viewer, '돌아가려면 ‘전체화면 닫기’를 눌러 주세요.');
  viewer.querySelector('[data-close]').focus({ preventScroll: true });
}

async function closeExpansion() {
  if (document.fullscreenElement) {
    try {
      await document.exitFullscreen();
      restoreExpansion();
    } catch { /* Keep the visible close control available. */ }
  } else {
    restoreExpansion();
  }
}

function stopViewer(viewer) {
  viewer.querySelector('.viewer-mount').replaceChildren();
  viewer.dataset.state = 'idle';
  viewer.querySelector('[data-play]').hidden = false;
  viewer.querySelector('[data-stop]').hidden = true;
  viewer.querySelector('[data-retry]').hidden = true;
  setStatus(viewer, '재생을 누르면 작업물을 불러옵니다.');
}

function playViewer(viewer) {
  if (viewer.querySelector('iframe')) return;
  viewer.dataset.state = 'active';
  viewer.querySelector('[data-play]').hidden = true;
  viewer.querySelector('[data-stop]').hidden = false;
  viewer.querySelector('[data-retry]').hidden = false;
  setStatus(viewer, '처음에는 작업물을 불러오는 시간이 필요합니다.');
  const frame = document.createElement('iframe');
  frame.title = viewer.dataset.title;
  frame.allow = 'autoplay; fullscreen';
  frame.allowFullscreen = true;
  frame.loading = 'eager';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  // Each card retains its runtime; iframe load is not treated as Unity readiness.
  frame.src = viewer.dataset.url;
  viewer.querySelector('.viewer-mount').append(frame);
}

async function openFullscreen(viewer) {
  playViewer(viewer);
  previousFocus = viewer.querySelector('[data-fullscreen]');
  // Request within the click gesture, without awaiting network or runtime loading.
  if (viewer.requestFullscreen && document.fullscreenEnabled) {
    try {
      await viewer.requestFullscreen();
      expandedViewer = viewer;
      updateExpansionButtons(viewer, true);
      viewer.querySelector('[data-close]').focus({ preventScroll: true });
      return;
    } catch { /* Browsers without fullscreen permission can expand within the page. */ }
  }
  expandInPage(viewer);
}

viewers.forEach(viewer => {
  const stage = viewer.querySelector('.viewer-stage');
  viewer.style.setProperty('--viewer-width', `${viewerWidth}px`);
  viewer.style.setProperty('--viewer-height', `${viewerHeight}px`);
  const fitViewer = () => viewer.style.setProperty('--viewer-scale', Math.min(stage.clientWidth / viewerWidth, stage.clientHeight / viewerHeight));
  fitViewer();
  new ResizeObserver(fitViewer).observe(stage);
  viewer.querySelector('[data-play]').hidden = false;
  viewer.querySelector('.viewer-toolbar').hidden = false;
  viewer.querySelector('[data-play]').addEventListener('click', () => {
    playViewer(viewer);
    viewer.querySelector('[data-fullscreen]').focus({ preventScroll: true });
  });
  viewer.querySelector('[data-fullscreen]').addEventListener('click', () => openFullscreen(viewer));
  viewer.querySelector('[data-close]').addEventListener('click', closeExpansion);
  viewer.querySelector('[data-stop]').addEventListener('click', async () => {
    if (expandedViewer === viewer) await closeExpansion();
    stopViewer(viewer);
    viewer.querySelector('[data-play]').focus({ preventScroll: true });
  });
  viewer.querySelector('[data-retry]').addEventListener('click', () => {
    stopViewer(viewer);
    playViewer(viewer);
    viewer.querySelector('.viewer-help').open = false;
    viewer.querySelector(expandedViewer === viewer ? '[data-close]' : '[data-fullscreen]').focus({ preventScroll: true });
  });
  playViewer(viewer);
});

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) restoreExpansion();
});

document.addEventListener('keydown', event => {
  if (!expandedViewer?.classList.contains('is-expanded')) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    restoreExpansion();
  } else if (event.key === 'Tab') {
    const controls = [...expandedViewer.querySelectorAll('iframe, button, a, summary')]
      .filter(element => !element.hidden && element.getClientRects().length > 0);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

// Keep the site's navigation usable when a keyboard follows an in-page link.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (link.dataset.playTarget) {
      const viewer = viewers.find(item => item.dataset.viewer === link.dataset.playTarget);
      if (viewer) playViewer(viewer);
    }
  });
});
