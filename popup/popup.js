const popupIgnoreList = {
  forumId: null,
  host: '',
  storedIgnoreList: [],
  ignoreUserList: {},
  exclude: {},
  init: async function () {
    await this.loadData();
    this.renderChecklist();
    document.querySelector('#ignoreList').addEventListener('click', event => this.toggleUser(event));
  },
  loadData: async function () {
    const { host } = await chrome.storage.local.get('host');
    this.host = host;

    const ignoreListKey = `hvIgnoreList_${host}`
    const userListKey = `hvIgnoreUserList_${host}`;
    const excludeUserList = `hvExcludeIgnoreUserList_${host}`;

    const storedData = await chrome.storage.local.get([
      ignoreListKey,
      userListKey,
      excludeUserList,
      'forumId'
    ]);

    this.forumId = storedData.forumId;
    this.storedIgnoreList = storedData[ignoreListKey]?.[storedData.forumId] || [];
    this.exclude = storedData[excludeUserList] || {};
    this.ignoreUserList = storedData[userListKey] || {};
  },
  renderChecklist: function () {
    const block = document.querySelector('#ignoreList');
      block.innerHTML = '';

    this.storedIgnoreList.forEach(userId => {
      const isVisible = this.exclude[this.forumId]?.includes(userId);
      block.insertAdjacentHTML(
        'beforeend',
        `<li class="ignoredUser ${isVisible ? 'visible' : 'invisible'}"><span>${this.ignoreUserList[userId]}</span><span title="${isVisible ? 'Скрыть' : 'Показать'}" class="toggleUser" data-user-id="${userId}"></span></li>`
      )
    });
  },
  toggleUser: async function (event) {
    const userId = event.target.dataset.userId;
    if (!userId) return;

    if (this.exclude[this.forumId] && this.exclude[this.forumId].includes(userId)) {
      this.exclude[this.forumId] = this.exclude[this.forumId].filter(item => item !== userId);
    } else {
      this.exclude[this.forumId] = this.exclude[this.forumId] ? [ ...this.exclude[this.forumId], userId ] : [ userId ];
    }

    const EXCLUDE_IGNORE_LIST_KEY = `hvExcludeIgnoreUserList_${this.host}`;
    await chrome.storage.local.set({ [EXCLUDE_IGNORE_LIST_KEY]: this.exclude });

    const [tab] = await chrome.tabs.query({active: true});
    await chrome.tabs.sendMessage(tab.id, { message: "ignore_update" });

    this.renderChecklist();
  },
};

popupIgnoreList.init();
