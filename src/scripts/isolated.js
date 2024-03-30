window.addEventListener('message', ({ data }) => {

  if (data.type === 'tundra_toolkit_init_data') {
    const {
      boardID,
      forumID,
      userID,
    } = data;

    // store data
    chrome.storage.local.set({
      forumData: {
        boardID,
        userID,
        forumID,
      }
    });

    // init ignore script
    chrome.storage.local.get('ignoreList').then(result => {
      const ignoreList = result.ignoreList || {};
      const boardList = ignoreList[boardID] || {};
      const forumList = boardList[forumID] || [];

      window.postMessage({
        type: 'tundra_toolkit_init_ignore',
        forumData: {
          boardID,
          forumID,
          userID,
        },
        data: forumList,
      })
    });
  }

  if (data.type === 'tundra_toolkit_update_ignore_list') {
    const {
      boardID,
      boardName,
      forumID,
      forumName,
      data: forumData,
    } = data;

    chrome.storage.local.get('ignoreList').then(result => {
      const ignoreList = result.ignoreList || {};
      const boardList = ignoreList[boardID] || {};

      const newData = {
        ...ignoreList,
        [boardID]: {
          ...boardList,
          [forumID]: forumData,
        }
      }

      chrome.storage.local.set({
        ignoreList: newData,
      })

    });

    // update forums data
    chrome.storage.local.get('boards').then(result => {
      const boards = result.boards || {};
      const newData = {
        ...boards,
        [boardID]: {
          boardName,
          forums: {
            ...(boards[boardID]?.forums || {}),
            [forumID]: forumName,
          },
        }
      };

      chrome.storage.local.set({
        boards: newData,
      })

    });
  }
});

chrome.runtime.onMessage.addListener(request => {
  if (request.type === 'tundra_toolkit_insert_sticker') {
    window.postMessage({
      type: 'tundra_toolkit_insert_sticker',
      src: request.src,
    })
  }
});
