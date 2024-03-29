window.addEventListener('message', ({ data }) => {

  if (data.type === 'tundra_toolkit_init_data') {
    // store data
    chrome.storage.local.set({
      forumData: {
        boardID: data.boardID,
        userID: data.userID,
        forumID: data.forumID,
      }
    });

    // init ignore script
    chrome.storage.local.get('ignoreList').then(result => {
      const ignoreList = result.ignoreList || {};
      const boardList = ignoreList[data.boardID] || {};
      const forumList = boardList[data.forumID] || [];

      window.postMessage({
        type: 'tundra_toolkit_init_ignore',
        forumData: {
          boardID: data.boardID,
          forumID: data.forumID,
          userID: data.userID,
        },
        data: forumList,
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
