import { useEffect, useState } from 'react';

import './style.css';

export function BlackListOptions() {

  const [ data, setData ] = useState<IBoardStore[]>([]);

  const handleRemoveClick = (boardID: string, forumID: string, user: { userName: string, userID: string }) => {
    const isConfirmed = confirm(`Разбанить ${user.userName}?`);

    if (!isConfirmed) return;

    const newData = data.map(board => {
      if (board.boardID !== boardID) return board;

      const newForums = board.forums.map(forum => {
        if (forum.forumID !== forumID) return forum;

        const newUsers = forum.users.filter(item => item.userID !== user.userID);

        return newUsers.length ? {
          ...forum,
          users: newUsers,
        } : null;
      }).filter(item => item !== null);

      return newForums.length ? {
        ...board,
        forums: newForums,
      } : null;
    }).filter(item => item !== null);

    setData(newData);
    chrome.storage.local.set({
      ignoreList: newData,
    });
  }

  useEffect(() => {

    const fetchData = async () => {
      const storage = await chrome.storage.local.get([ 'ignoreList' ]);
      const storedData = storage[ 'ignoreList' ] || {};

      setData(storedData);
    }

    fetchData();
  }, []);

  return (
    <ul class="blackList">
      { data.map(({ boardID, boardName, forums }) => (
        <li class="blackListBoardItem" key={ boardID }>
          { boardName }
          <ul class="blackListForum">
            { forums.map(({ forumID, forumName, users }) => (
              <li class="blackListForumItem" key={ forumID }>
                { forumName }
                <ul class="blackListUsers">
                  { users.map(user => (
                    <li class="blackListUserItem" key={ user.userID }>
                      { user.userName }
                      <span
                        class="blackListRemoveItem"
                        onClick={() => handleRemoveClick(boardID, forumID, user)}>x</span>
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
