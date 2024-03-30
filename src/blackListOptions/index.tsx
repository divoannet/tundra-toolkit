import { useEffect, useState } from 'react';

import './style.css';

interface IBoardStore {
  [ boardId: string ]: {
    [ forumId: string ]: {
      userID: string,
      userName: string,
    }[],
  }
}

export function BlackListOptions() {

  const [ data, setData ] = useState<IBoardStore>({});
  const [ boards, setBoards ] = useState({})

  const getBoardName = (boardID: string) => {
    return boards[ boardID ].boardName || `Форум #${ boardID }`;
  }

  const getForumName = (boardId: string, forumId: string) => {
    return boards[ boardId ]?.forums?.[ forumId ] || `Раздел #${ forumId }`;
  }

  const handleRemoveClick = (boardId: string, forumId: string, user: { userName: string, userID: string }) => {
    const isConfirmed = confirm(`Разбанить ${user.userName}?`);

    if (!isConfirmed) return;

    const forumBlackList = data[boardId][forumId] || [];
    const newForumBlackList = forumBlackList.filter(item => item.userID !== user.userID);

    const newData = {
      ...data,
      [boardId]: {
        ...data[boardId],
        [forumId]: newForumBlackList,
      },
    };

    setData(newData);
    chrome.storage.local.set({
      ignoreList: newData,
    });
  }

  useEffect(() => {

    const fetchData = async () => {
      const storage = await chrome.storage.local.get([ 'ignoreList', 'boards' ]);
      const storedData = storage[ 'ignoreList' ] || {};
      const storedBoards = storage[ 'boards' ] || {};

      setData(storedData);
      setBoards(storedBoards);
    }

    fetchData();
  }, []);

  return (
    <ul class="blackList">
      { Object.entries(data).map(([ boardId, board ]) => (
        <li class="blackListBoardItem" key={ boardId }>
          { getBoardName(boardId) }
          <ul class="blackListForum">
            { Object.entries(board).map(([ forumId, forum ]) => (
              <li class="blackListForumItem" key={ forumId }>
                { getForumName(boardId, forumId) }
                <ul class="blackListUsers">
                  { forum.map(user => (
                    <li class="blackListUserItem" key={ user.userID }>
                      { user.userName }
                      <span
                        class="blackListRemoveItem"
                        onClick={() => handleRemoveClick(boardId, forumId, user)}>x</span>
                    </li>
                  )) }
                </ul>
              </li>
            )) }
          </ul>
        </li>
      )) }
    </ul>
  )
}
