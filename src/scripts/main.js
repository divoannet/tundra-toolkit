const hvIgnoreList = {
  style: null,
  ignoreList: [],
  boardID: null,
  forumID: null,
  userID: null,
  init: async function (forumData, data) {
    this.boardID = forumData.boardID;
    this.forumID = forumData.forumID;
    this.userID = forumData.userID;

    this.ignoreList = data;

    this.style = document.createElement('style');
    document.head.appendChild(this.style);

    this.generateStyle();
    this.hideQuotes();
  },
  generateStyle: function () {
    const defaultStyles = '#pun.ignoreDisabled .post { display: block !important; }\n' +
      '#pun .post.topicpost { display: block !important; }\n' +
      '.hidden { display: none; }';
    let styleArray = [];
    this.ignoreList.forEach(user => !this.exclude.includes(user.userId) && styleArray.push(`.post[data-user-id="${ user.userId }"]`));

    this.style.innerHTML = styleArray.length ? styleArray.join(', ') + ' {display: none} \n' + defaultStyles : '';
  },
  hideQuotes: function() {
    document.querySelectorAll('.quote-box').forEach(el => {
      const cite = el.querySelector('cite');
      if (!cite) return;

      const userNames = this.ignoreList.map(item => item.userName);

      userNames.forEach(iUser => {
        el.classList.toggle('hidden', cite.innerText.toLocaleLowerCase().includes(iUser.toLocaleLowerCase()));
      });
    });
  },
}

main();

function main() {
  // Проверка, на форуме mybb мы или нет
  const ForumAPITicket = window[ 'ForumAPITicket' ];
  if (!ForumAPITicket) return;

  // Данные форума и пользователя для хранения
  // @ts-ignore
  const boardID = window.BoardID || 0;
  // @ts-ignore
  const userID = window.UserID || 0;
  // @ts-ignore
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
    // @ts-ignore
    const editor = window.FORUM?.get('editor') || null;

    if (!editor) {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(data.src);
    }

    // @ts-ignore
    window.smile(`[img]${data.src}[/img]`);
  }

  if (data.type === 'tundra_toolkit_init_ignore') {
    // @ts-ignore
    const topic = window.FORUM?.get('topic') || null;
    if (!topic) return;

    hvIgnoreList.init(data.forumData, data.data);
  }

});