let hostNameKey = '';
let forumName = '';
let userOptions = {};
let menuItem = null;
let extCache = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    hostNameKey = 'hvHU|' + request.hostname;
    forumName = request.forumName;
    switch (request.type) {
        case 'getForumInfo':
            chrome.storage.local.get(
                hostNameKey,
                function(result) {
                    if (! result || ! result[hostNameKey]) {
                        sendResponse({});
                        return;
                    }
                    const forumData = result[hostNameKey][request.forumName] || {};
                    extCache[hostNameKey] = forumData;
                    sendResponse(forumData);

                    updateContextMenu();
                }
            );

            return true;
        case 'updateContextMenu':
            if (menuItem) {
                chrome.contextMenus.remove(menuItem);
                menuItem = null;
            }

            updateContextMenu();

            if (!request.selection) {
                userOptions = {};
                return;
            };

            userOptions = {
                ...request.data
            };
            const options = {
                id: 'hvhide_' + request.data.userId,
                title: 'Скрыть посты ' + request.data.userName + ' [' + forumName + ']',
                contexts: ['selection']
            };
            menuItem = chrome.contextMenus.create(options);
            break;
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    chrome.storage.local.get(
        hostNameKey,
        result => {
            const data = result[hostNameKey] || {};
            const [ action, id ] = info.menuItemId.split('_');
            switch (action) {
                case 'hvhide':
                    data[forumName] = {
                        ...data[forumName],
                        [ userOptions.userId ]: {
                            name: userOptions.userName,
                            hidden: true
                        }
                    };
                    break;
                case 'hvshow':
                    data[forumName][id].hidden = false;
                    break;
            }
            chrome.storage.local.set({ [ hostNameKey ]: data }, res => {
                chrome.tabs.sendMessage(tab.id, {
                    type: 'updateHiddenUsers',
                    data
                })
            });
        }
    );
});

function updateContextMenu() {
    const forumData = extCache[hostNameKey] || {};

    chrome.contextMenus.removeAll();
    menuItem = null;
    Object.keys(forumData).forEach(ukey => {
        forumData[ukey].hidden && chrome.contextMenus.create({
            id: 'hvshow_' + ukey,
            title: 'Показать посты ' + forumData[ukey].name,
            contexts: ['page']
        });
    });
}