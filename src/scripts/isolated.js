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
    chrome.storage.local.get('ignoreList').then(({ ignoreList = [] }) => {
      const boardList = ignoreList.find(item => item.boardID === boardID);
      const forumList = boardList?.forums.find(item => item.forumID === forumID)?.users || [];

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
      boardUrl,
      forumID,
      forumName,
      data: newUsers,
    } = data;

    chrome.storage.local.get('ignoreList').then(({ ignoreList = [] }) => {
      const boardIndex = ignoreList.findIndex(item => item.boardID === boardID);

      const newData = boardIndex >= 0 ? ignoreList.map(board => {
        if (board.boardID !== boardID) return board;
        const forumIndex = board.forums.findIndex(item => item.forumID === forumID);

        const newForumData = forumIndex >= 0 ? board.forums.map(forum => {
          if (forum.forumID !== forumID) return forum;

          return {
            ...forum,
            users: newUsers,
          }
        }) : [
          ...board.forums,
          {
            forumID,
            forumName,
            users: newUsers,
          }
        ]

        return {
          ...board,
          forums: newForumData,
        }
      }) : [
        ...ignoreList,
        {
          boardID,
          boardName,
          boardUrl,
          forums: [
            {
              forumID,
              forumName,
              users: newUsers,
            }
          ],
        }
      ];

      chrome.storage.local.set({
        ignoreList: newData,
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

  if (request.type === 'tundra_toolkit_ignore_toggle') {
    window.postMessage({
      type: 'tundra_toolkit_ignore_toggle',
    })
  }
});
