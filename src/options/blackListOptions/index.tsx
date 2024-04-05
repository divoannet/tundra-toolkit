import { useEffect, useState } from 'react';

import './style.css';

export function BlackListOptions() {

  const [ data, setData ] = useState<IBoardStore[]>([]);

  const handleRemoveClick = (boardID: string, forumID: string, user: { userName: string, userID: string }) => {
    const isConfirmed = confirm(`Разбанить ${ user.userName }?`);

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
      const storedData = storage[ 'ignoreList' ] || [];

      setData(storedData);
    }

    fetchData()
  }, []);

  return (
    <section>
      <h3>Чёрный список</h3>
      <ul class="blackList">
        { data.map(({ boardID, boardName, boardUrl, forums }) => (
          <>
            <li class="blackListBoardItem" key={ boardID }>
              <a href={ `https://${ boardUrl }` } target="_blank">{ boardName }</a>
            </li>
            <ul class="blackListForum">
              { forums.map(({ forumID, forumName, users }) => (
                <>
                  <li className="blackListForumItem" key={ forumID }>
                    <a href={ `https://${ boardUrl }/viewforum.php?id=${ forumID }` } target="_blank">{ forumName }</a>
                  </li>
                  <ul class="blackListUsers">
                    { users.map(user => (
                      <li className="blackListUserItem" key={ user.userID }>
                        <a href={ `https://${ boardUrl }/profile.php?id=${ user.userID }` }
                           target="_blank">{ user.userName }</a>
                        <button
                          className="button small icon-only blackListRemoveItem"
                          title="Амнистировать пользователя"
                          onClick={ () => handleRemoveClick(boardID, forumID, user) }
                        >
                          X
                        </button>
                      </li>
                    )) }
                  </ul>
                </>
              )) }
            </ul>
          </>
        )) }
      </ul>

      {!data.length && (
        <div className="emptyList">
          Список пока пуст. Кнопка "Игнорировать" появится в постах пользователей на форуме.
        </div>
      )}
    </section>
  )
}
