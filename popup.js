function save_options() {
    var hideInsteadOfRemoving = document.getElementById('hide_instead').checked;

    chrome.storage.sync.set(
        { hvHU_hideInstead: hideInsteadOfRemoving },
        function() {
            console.log('hvHU__popup.js  => save_options(): SAVED');
        }
    );
}

function restore_options() {
    chrome.storage.sync.get(['hvHU_hideInstead'], function(items) {
        document.getElementById('hide_instead').checked =
            items.hvHU_hideInstead;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('hide_instead').addEventListener('click', save_options);
