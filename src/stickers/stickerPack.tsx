import {createContext} from "preact";
import {useEffect, useState} from "react";

const StickerData = createContext([]);

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
  removePack,
  editStickerPack,
}: PackProps) {

  const [titleImg, setTitleImg] = useState<string>('');

  const handleTitleClick = () => {
    onChange(`pack${pack.id}`)
  }

  const handleRemovePack = () => {
    const isConfirmed = confirm(`Удалить стикерпак "${pack.name}"? Это необратимо.`);
    if (!isConfirmed) return;

    removePack(`pack${pack.id}`);
  }

  const handleEditPack = () => {
    editStickerPack(`pack${pack.id}`);
  }

  const handleStickerClick = async (event) => {
    // @ts-ignore
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      const activeTab = tabs[0];
      // @ts-ignore
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
          ></div>
        )}
        <h4 class="stickerPackTitle" onClick={handleTitleClick}>{pack.name}</h4>
        <div className="stickerPackTitleActions">
          <button className="button" onClick={handleEditPack}>🖋️</button>
          <button className="button" onClick={handleRemovePack}>X</button>
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