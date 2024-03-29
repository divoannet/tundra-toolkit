import { useEffect, useState } from 'react';

interface IBoardStore {
  [boardId: string]: {
    [forumId: string]: {
      userID: string,
      userName: string,
    }[],
  }
}

export function BlackListOptions() {

  const [ data, setData ] = useState<IBoardStore>({});
  const [ boards, setBoards ] = useState({})

  const getBoardName = (boardID: string) => {
    return boards[boardID].boardName || `Форум #${boardID}`;
  }

  const getForumName = (boardId: string, forumId: string) => {
    console.log('boards', boards[boardId], forumId);
    return boards[boardId]?.forums?.[forumId] || `Раздел #${forumId}`;
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
    <div>
      <ul>
        {Object.entries(data).map(([boardId, board]) => (
          <li key={boardId}>
            {getBoardName(boardId)}
            <ul>
              {Object.entries(board).map(([forumId, forum]) => (
                <li key={forumId}>
                  {getForumName(boardId, forumId)}
                  <ul>
                    {forum.map(user => (
                      <li key={user.userID}>
                        {user.userName}
                        <span>x</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
