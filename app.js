const form = document.getElementById('runnerForm');
const input = document.getElementById('urlInput');
const frame = document.getElementById('webFrame');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const reloadBtn = document.getElementById('reloadBtn');
const openBtn = document.getElementById('openBtn');
const copyBtn = document.getElementById('copyBtn');

const historyStack = [];
let historyIndex = -1;

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function currentUrl() {
  return historyIndex >= 0 ? historyStack[historyIndex] : '';
}

function updateActions() {
  backBtn.disabled = historyIndex <= 0;
  forwardBtn.disabled = historyIndex >= historyStack.length - 1;
  const hasUrl = Boolean(currentUrl());
  openBtn.disabled = !hasUrl;
  copyBtn.disabled = !hasUrl;
}

function loadUrl(rawUrl, push = true) {
  const normalized = normalizeUrl(rawUrl);
  if (!normalized) return;

  frame.src = normalized;
  input.value = normalized;

  if (push) {
    historyStack.splice(historyIndex + 1);
    historyStack.push(normalized);
    historyIndex = historyStack.length - 1;
  }

  updateActions();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  loadUrl(input.value, true);
});

backBtn.addEventListener('click', () => {
  if (historyIndex > 0) {
    historyIndex -= 1;
    loadUrl(historyStack[historyIndex], false);
  }
});

forwardBtn.addEventListener('click', () => {
  if (historyIndex < historyStack.length - 1) {
    historyIndex += 1;
    loadUrl(historyStack[historyIndex], false);
  }
});

reloadBtn.addEventListener('click', () => {
  if (historyIndex >= 0) {
    loadUrl(historyStack[historyIndex], false);
  }
});

openBtn.addEventListener('click', () => {
  const url = currentUrl();
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
});

copyBtn.addEventListener('click', async () => {
  const url = currentUrl();
  if (!url) return;

  try {
    await navigator.clipboard.writeText(url);
    copyBtn.textContent = 'Copied';
    setTimeout(() => (copyBtn.textContent = 'Copy URL'), 1200);
  } catch {
    copyBtn.textContent = 'Copy failed';
    setTimeout(() => (copyBtn.textContent = 'Copy URL'), 1200);
  }
});

loadUrl('https://example.com', true);
