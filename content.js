const hideUserPosts = {
    init: function() {
        const pun = document.getElementById('pun');
        if (! pun) return;

        this.isGuest = pun.classList.contains('isguest');
        this.posts = document.querySelectorAll('.post') || [];
        if (this.posts.length === 0) return;

        const crumbs = document.getElementById('pun-crumbs1');
        const forumLinks = crumbs.querySelectorAll('a');
        this.forumName = forumLinks[forumLinks.length - 1].text.toLocaleLowerCase();

        this.updateContextMenu = this.updateContextMenu.bind(this);

        this.getHideInfo();
        this.addListeners();
    },

    getHideInfo: async function() {
        chrome.runtime.sendMessage({
            type: 'getForumInfo',
            hostname: location.hostname,
            forumName: this.forumName
        }, result => {
            this.hidePosts(result);
        });
    },

    hidePosts: function(data) {
        if (Object.keys(data) === 0) return;

        this.posts.forEach(post => {
            if (post.classList.contains('topicpost')) return;

            const id = this.getUserId(post);
            if (Object.keys(data).includes(id)) {
                post.classList.toggle('hvHiddenPost', data[id].hidden);
            }
        })
    },

    addListeners: function() {
        document.addEventListener('contextmenu', this.updateContextMenu);

        chrome.runtime.onMessage.addListener((request) => {
            if (request.type === 'updateHiddenUsers') {
                this.getHideInfo();
            }
        });
    },

    updateContextMenu: function(event) {
        const target = event.target;

        if (! target.closest('.pa-author')) {
            chrome.runtime.sendMessage({
                type: 'updateContextMenu',
                forumName: this.forumName,
                hostname: location.hostname
            });
            return;
        };

        const post = target.closest('.post');

        chrome.runtime.sendMessage({
            type: 'updateContextMenu',
            selection: event.target.text,
            forumName: this.forumName,
            hostname: location.hostname,
            data: {
                userName: event.target.text,
                userId: this.getUserId(post),
            }
        })
    },

    getUserId: function(post) {
        const profileMenuItem = this.isGuest
                ? post.querySelector('.pa-author')
                : post.querySelector('.pl-email');

        if (!profileMenuItem) return '0';

        const profileLink = profileMenuItem.querySelector('a');
        return profileLink.href.match(/(\d+)$/)[0];
    }
}

hideUserPosts.init();