import { StickerPack } from './stickerPack';
import { useEffect, useState } from "react";

type ListProps = {
  data: IStickersData;
  removePack: (packId: string) => void;
  editStickerPack: (packId: string) => void;
}

export function StickerList({
  data,
  removePack,
  editStickerPack,
}: ListProps) {
  const [ activeTab, setActiveTab ] = useState<string>('');

  const handleActiveTabChange = (newTab: string) => {
    if (newTab === activeTab) {
      setActiveTab('');
    } else {
      setActiveTab(newTab);
    }
  }

  useEffect(() => {
    const [ key ] = Object.keys(data);

    setActiveTab(key);
  }, []);

  return (
    <div>
      { Object.entries(data).map(([ key, pack ]) => (
        <StickerPack
          key={ key }
          opened={ key === activeTab }
          pack={ pack }
          onChange={ handleActiveTabChange }
          removePack={removePack}
          editStickerPack={editStickerPack}
        />
      )) }
    </div>
  )
}

