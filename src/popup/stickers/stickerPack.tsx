import {useEffect, useState} from "react";

type PackProps = {
  pack: IStickerPack;
  opened: boolean;
  onChange: (newActiveTab: string) => void;
  removePack: (packId: string) => void;
  editStickerPack: (packId: string) => void;
}

export function StickerPack({
  pack,
  onChange,
  opened,
  editStickerPack,
}: PackProps) {

  const [titleImg, setTitleImg] = useState<string>('');

  const handleTitleClick = () => {
    onChange(`pack${pack.id}`)
  }

  const handleEditPack = event => {
    event.stopPropagation();
    editStickerPack(`pack${pack.id}`);
  }

  const handleStickerClick = async (event) => {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {
        type: 'tundra_toolkit_insert_sticker',
        src: event.target.src,
      });
    });
  }

  useEffect(() => {
    if (!pack.items.length) return;

    setTitleImg(pack.items[0]);
  }, [pack])

  return (
    <div class="stickerPack">
      <div class="stickerPackHeader">
        {titleImg && (
          <div
            className="stickerPackTitleIcon"
            style={`--bg-image: url(${titleImg});`}
            onClick={handleTitleClick}
          ></div>
        )}
        <h4 class="stickerPackTitle" onClick={handleTitleClick}>{pack.name}</h4>
        <div className="stickerPackTitleActions">
          <button className="button small" onClick={handleEditPack}>🖋️</button>
        </div>
      </div>
      {opened && (
        <div class="stickerPackContent">
          {pack.items.map(sticker => (
            <div class="stickerItem">
              <img src={sticker} key={sticker} onClick={handleStickerClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}