// @ts-nocheck

main();

function main() {
  // Проверка, на форуме mybb мы или нет
  const ForumAPITicket = window[ 'ForumAPITicket' ];
  if (!ForumAPITicket) return;

  // Данные форума и пользователя для хранения
  const boardID = window.BoardID || 0;
  const userID = window.UserID || 0;
  const forumID = window.FORUM?.get('topic.forum_id') || null;

  window.postMessage({
    type: 'tundra_toolkit_init_data',
    boardID,
    userID,
    forumID,
  });
}

window.addEventListener('message', ({ data }) => {

  if (data.type === 'tundra_toolkit_insert_sticker') {
    const editor = window.FORUM?.get('editor') || null;

    if (!editor) {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(data.src);
    }

    window.smile(`[img]${data.src}[/img]`);
  }

});