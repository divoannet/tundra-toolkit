const hideUserPosts = {
    init: function() {
        const pun = document.getElementById('pun');
        if (!pun) return;

        this.isGuest = pun.classList.contains('isguest');
        this.posts = document.querySelectorAll('.post') || [];
        if (this.posts.length === 0) return;

        const crumbs = document.getElementById('pun-crumbs1');
        const forumLinks = crumbs.querySelectorAll('a');
        this.forumName = forumLinks[
            forumLinks.length - 1
        ].text.toLocaleLowerCase();

        this.updateContextMenu = this.updateContextMenu.bind(this);

        this.getHideInfo();
        this.addListeners();
    },

    getHideInfo: async function() {
        let hideInsteadOfRemoving = false;

        await chrome.storage.sync.get(['hvHU_hideInstead'], items => {
            hideInsteadOfRemoving = items.hvHU_hideInstead;
        });

        chrome.runtime.sendMessage(
            {
                type: 'getForumInfo',
                hostname: location.hostname,
                forumName: this.forumName
            },
            result => {
                this.hidePosts(result, hideInsteadOfRemoving);
            }
        );
    },

    hidePosts: function(data, hideInsteadOfRemoving) {
        if (Object.keys(data) === 0) return;

        this.posts.forEach(post => {
            if (post.classList.contains('topicpost')) return;

            const id = this.getUserId(post);
            if (id && Object.keys(data).includes(id)) {
                post.classList.toggle(
                    hideInsteadOfRemoving ? 'hvHiddenPost' : 'hvRemovedPost',
                    data[id].hidden
                );

                if (hideInsteadOfRemoving) {
                    this.configurePostSpoiler(post);
                }
            }
        });
    },

    configurePostSpoiler: function(post) {
        const spoiler = post.querySelector('.hvHiddenSpoiler');

        if (post.classList.contains('hvHiddenPost')) {
            if (!spoiler) {
                const postContainer = post.querySelector('.container');
                const postHeadingWidth = post.querySelector('h3 span')
                    .offsetWidth;
                const userName = post.querySelector('.pa-author a').textContent;

                const spoilerContent = `<div style="width:${postHeadingWidth}px;" class="quote-box spoiler-box hvHiddenSpoiler">Посты ${userName} скрыты. <button class="button" type="button"><strong>Посмотреть пост</strong></button></div>`;

                postContainer.insertAdjacentHTML('beforebegin', spoilerContent);

                this.hidePostUnderSpoiler(post);
            }
            return;
        }

        if (spoiler) {
            spoiler.remove();
        }
    },

    hidePostUnderSpoiler: function(post) {
        if (post.classList.contains('hvShow')) {
            post.classList.remove('hvShow');
        }

        const showButton = post.querySelector('.hvHiddenSpoiler button');

        if (showButton) {
            showButton.innerHTML = `<strong>Посмотреть пост</strong>`;

            const showPostUnderSpoiler = this.showPostUnderSpoiler.bind(this);

            showButton.addEventListener(
                'click',
                function _showPostListener() {
                    showPostUnderSpoiler(post);
                    showButton.removeEventListener(
                        _showPostListener,
                        () => {},
                        true
                    );
                },
                true
            );
        }
    },

    showPostUnderSpoiler: function(post) {
        if (!post.classList.contains('hvShow')) {
            post.classList.add('hvShow');
        }

        const spoiler = post.querySelector('.hvHiddenSpoiler');
        const hideButton = post.querySelector('.hvHiddenSpoiler button');

        if (hideButton) {
            hideButton.innerHTML = `<strong>Скрыть пост снова</strong>`;

            const hidePostUnderSpoiler = this.hidePostUnderSpoiler.bind(this);

            hideButton.addEventListener(
                'click',
                function _hidePostListener() {
                    hidePostUnderSpoiler(post);
                    hideButton.removeEventListener(
                        _hidePostListener,
                        () => {},
                        true
                    );
                },
                true
            );
        }
    },

    addListeners: function() {
        document.addEventListener('contextmenu', this.updateContextMenu);

        chrome.runtime.onMessage.addListener(request => {
            if (request.type === 'updateHiddenUsers') {
                this.getHideInfo();
            }
        });
    },

    updateContextMenu: function(event) {
        const target = event.target;

        if (!target.closest('.pa-author')) {
            chrome.runtime.sendMessage({
                type: 'updateContextMenu',
                forumName: this.forumName,
                hostname: location.hostname
            });
            return;
        }

        const post = target.closest('.post');

        const userId = this.getUserId(post);
        if (!userId) return;

        chrome.runtime.sendMessage({
            type: 'updateContextMenu',
            selection: event.target.text,
            forumName: this.forumName,
            hostname: location.hostname,
            data: {
                userName: event.target.text,
                userId
            }
        });
    },

    getUserId: function(post) {
        const profileMenuItem = this.isGuest
            ? post.querySelector('.pa-author')
            : post.querySelector('.pl-email');

        if (!profileMenuItem) return null;

        const profileLink = profileMenuItem.querySelector('a');
        if (!profileLink.href || /javascript\:/.test(profileLink.href))
            return null;

        return profileLink.href.match(/(\d+)$/)[0];
    }
};

hideUserPosts.init();
