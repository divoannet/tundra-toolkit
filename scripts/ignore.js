const IGNORE_LIST_KEY = `hvIgnoreList_${location.host}`;
const IGNORE_USERLIST_KEY = `hvIgnoreUserList_${location.host}`;
const EXCLUDE_IGNORE_LIST_KEY = `hvExcludeIgnoreUserList_${location.host}`;

const ignoreStyles = {
  style: null,
  ignoreList: [],
  ignoreUserList: {},
  exclude: [],
  init: async function () {
    const forumId = document.querySelector('#pun-viewtopic')?.dataset.forumId;

    if (!forumId) return;

    await chrome.storage.local.set({
      host: location.host,
      forumId,
    });

    this.style = document.createElement('style');
    document.head.appendChild(this.style);

    await this.loadIgnoreList();
    this.generateStyle();
    this.hideQuotes();
  },
  loadIgnoreList: async function() {
    const storedData = await chrome.storage.local.get([IGNORE_LIST_KEY, IGNORE_USERLIST_KEY, EXCLUDE_IGNORE_LIST_KEY]);
    const forumId = document.querySelector('#pun-viewtopic').dataset.forumId;
    this.ignoreList = storedData[IGNORE_LIST_KEY]?.[forumId] || [];
    this.exclude = storedData[EXCLUDE_IGNORE_LIST_KEY]?.[forumId] || [];
    this.ignoreUserList = storedData[IGNORE_USERLIST_KEY] || {};
  },
  updateStyle: async function () {
    await this.loadIgnoreList();
    this.generateStyle();
    this.hideQuotes();
  },
  hideQuotes: function() {
    document.querySelectorAll('.quote-box').forEach(el => {
      const cite = el.querySelector('cite');
      if (!cite) return;

      const userList = Object.keys(this.ignoreUserList).reduce((result, item) => {
        return this.ignoreList.includes(item) ? [ ...result, this.ignoreUserList[item] ] : result;
      }, []);

      userList.forEach(iUser => {
        if (cite.innerText.toLocaleLowerCase().includes(iUser.toLocaleLowerCase())) {
          el.classList.add('hidden');
        };
      });
    });
  },
  generateStyle: function () {
    const defaultStyles = '#pun.ignoreDisabled .post { display: block !important; }\n' +
      '#pun .post.topicpost { display: block !important; }\n' +
      '.hidden { display: none; }';
    let styleArray = [];
    this.ignoreList.forEach(userId => !this.exclude.includes(userId) && styleArray.push(`.post[data-user-id="${userId}"]`));

    this.style.innerHTML = styleArray.join(', ') + ' {display: none} \n' + defaultStyles;
  },
};

document.addEventListener('DOMContentLoaded', handleDOMLoaded);
document.addEventListener('DOMContentLoaded', () => ignoreStyles.init());

chrome.runtime.onMessage.addListener(async function(request) {
  if (request.message === "ignore_update") {
    await ignoreStyles.updateStyle();
  }
});


async function handleDOMLoaded() {
  const forumId = document.querySelector('#pun-viewtopic')?.dataset.forumId;

  if (!forumId) return;

  const storedData = await chrome.storage.local.get([IGNORE_LIST_KEY, IGNORE_USERLIST_KEY]);
  const storedIgnoreList = storedData[IGNORE_LIST_KEY]?.[forumId] || [];
  const ignoreUserList = storedData[IGNORE_USERLIST_KEY] || {};

  const addUserToIgnoreList = async (event) => {
    if (event.target.dataset.link !== "ignoreLink") return;

    event.preventDefault();

    const { userId } = event.target.dataset;

    let ignoreList = storedIgnoreList.includes(userId)
      ? storedIgnoreList.filter(item => item !== userId)
      : [...storedIgnoreList, userId];

    if (!storedIgnoreList.includes(userId)) {
      const fetchData = await fetch(`/api.php?method=users.get&user_id=${userId}`);
      const { response: { users: [ user ] } } = await fetchData.json();

      if (!user) return;

      const userData = {
        ...ignoreUserList,
        [userId]: user.username,
      }

      await chrome.storage.local.set({ [IGNORE_USERLIST_KEY]: userData });
    }

    await chrome.storage.local.set({ [IGNORE_LIST_KEY]: {
      ...storedData[IGNORE_LIST_KEY],
      [forumId]: ignoreList,
    }});
    await ignoreStyles.updateStyle();
  }

  const addIgnoreLink = el => {
    const userId = el.dataset.userId;

    const postLinks = el.querySelector('.post-links > ul');

    const linkText = storedIgnoreList.includes(userId) ? 'Не игнорировать' : 'Игнорировать';

    postLinks.insertAdjacentHTML(
      'beforeend',
      `<li class="pl-ignore"><a href="#" data-link="ignoreLink" data-user-id="${userId}">${linkText}</a></li>`);
    postLinks.addEventListener('click', addUserToIgnoreList);
  }

  document.querySelectorAll('.post').forEach(addIgnoreLink);
}
