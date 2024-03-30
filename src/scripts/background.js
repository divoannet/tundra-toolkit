chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'tundra_toolkit_ignore_menu',
    title: 'Чёрный список',
    contexts: ['page'],
  })
});

chrome.contextMenus.onClicked.addListener(() => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
})
