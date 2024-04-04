chrome.runtime.onMessage.addListener(message => {
  if (message.type === 'tundra_toolkit_init_data') {
    chrome.contextMenus.create({
      id: 'tundra_toolkit_ignore_menu',
      title: 'Список заблокированных',
      contexts: ['page'],
    });

    chrome.contextMenus.create({
      id: 'tundra_toolkit_ignore_check',
      title: 'Открыть скрытые сообщения',
      contexts: ['page'],
    });
  }
})

chrome.contextMenus.onClicked.addListener((onClickData) => {

  if (onClickData.menuItemId === 'tundra_toolkit_ignore_menu') {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  }

  if (onClickData.menuItemId === 'tundra_toolkit_ignore_check') {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        type: 'tundra_toolkit_ignore_toggle',
      });
    });
  }

})
