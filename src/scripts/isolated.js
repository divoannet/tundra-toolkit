window.addEventListener('message', event => {
  const { data } = event;
  if (data.type !== 'tundra_toolkit_init_data') return;

  // @ts-ignore
  chrome.runtime.onMessage.addListener(request => {
    if (request.type === 'tundra_toolkit_insert_sticker') {
      window.postMessage({
        type: 'tundra_toolkit_insert_sticker',
        src: request.src,
      })
    }
  });
});