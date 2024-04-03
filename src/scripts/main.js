const hvIgnoreList = {
  style: null,
  ignoreList: [],
  boardID: null,
  boardName: null,
  forumID: null,
  forumName: null,
  userID: null,
  init: async function (forumData, data) {
    this.boardID = forumData.boardID;
    this.forumID = forumData.forumID;
    this.userID = forumData.userID;
    // @ts-ignore
    this.forumName = window.FORUM.get('topic.forum_name');
    this.getBoardName();

    this.ignoreList = data;

    this.style = document.createElement('style');
    document.head.appendChild(this.style);

    this.generateStyle();
    this.hideQuotes();
  },
  getBoardName: async function () {
    const fetchData = await fetch('/api.php?method=board.get&fields=title');
    const { response: { title } } = await fetchData.json();

    this.boardName = title;
  },
  generateStyle: function () {
    const defaultStyles = '#pun.ignoreDisabled .post { display: block !important; }\n' +
      '#pun .post.topicpost { display: block !important; }\n' +
      '.hidden { display: none; }';
    let styleArray = [];
    this.ignoreList.forEach(user => {
      styleArray.push(`.post[data-user-id="${ user.userID }"]`)
    });

    this.style.innerHTML = styleArray.length ? styleArray.join(', ') + ' {display: none} \n' + defaultStyles : '';
  },
  hideQuotes: function () {
    document.querySelectorAll('.quote-box').forEach(el => {
      const cite = el.querySelector('cite');
      if (!cite) return;

      const userNames = this.ignoreList.map(item => item.userName);

      userNames.forEach(iUser => {
        el.classList.toggle('hidden', cite.innerText.toLocaleLowerCase().includes(iUser.toLocaleLowerCase()));
      });
    });
  },
  addUser: function ({ userID, userName }) {
    const isConfirmed = confirm(`Игнорировать посты ${userName} в разделе [ ${this.forumName} ]?`);

    if (!isConfirmed) return;

    this.ignoreList.push({ userID, userName });
    this.generateStyle();
    this.hideQuotes();

    window.postMessage({
      type: 'tundra_toolkit_update_ignore_list',
      boardID: this.boardID,
      boardName: this.boardName,
      forumID: this.forumID,
      forumName: this.forumName,
      data: this.ignoreList,
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

  //   render ignore link

  const addIgnoreLink = post => {
    const postUserId = post.dataset.userId;

    if (!postUserId || +postUserId === userID) return;

    const postLinks = post.querySelector('.post-links > ul');
    const plEmail = postLinks.querySelectorAll('.pl-email');
    const last = [ ...plEmail ].pop();

    last.insertAdjacentHTML(
      'afterend',
      `<li class="pl-email ignore"><a href="#" data-link="ignoreLink" data-user-id="${postUserId}">Игнорировать</a></li>`);
    postLinks.addEventListener('click', addUserToIgnoreList);
  }

  document.querySelectorAll('.post').forEach(addIgnoreLink);

  async function addUserToIgnoreList(event) {
    if (event.target.dataset.link !== "ignoreLink") return;
    event.preventDefault();

    const { userId } = event.target.dataset;

    const fetchData = await fetch(`/api.php?method=users.get&user_id=${userId}`);
    const { response: { users: [ user ] } } = await fetchData.json();

    if (!user) {
      // notify
      return;
    }

    hvIgnoreList.addUser({
      userID: userId,
      userName: user.username,
    })
  }

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
    window.smile(`[img]${ data.src }[/img]`);
  }

  if (data.type === 'tundra_toolkit_init_ignore') {
    // @ts-ignore
    const topic = window.FORUM?.get('topic') || null;
    if (!topic) return;

    hvIgnoreList.init(data.forumData, data.data);
  }

});