import { useEffect, useState } from 'react';

import StickerPack from './stickerPack';

export default function () {

  const [ data, setData ] = useState<IStickersData>({});

  const updateStickerPack = async (pack: IStickerPack) => {
    const newData = { ...data };
    newData[ `pack${ pack.id }` ] = { ...pack };
    await chrome.storage.local.set({ stickerPack: newData });
    setData(newData);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await chrome.storage.local.get('stickerPack');

      const stickerPack = result.stickerPack || {};

      setData(stickerPack);
    }

    fetchData();
  }, []);

  return (
    <div>
      { Object.entries(data).map(([ packId, pack ]) => (
        <StickerPack
          key={ packId }
          onChange={ updateStickerPack }
          pack={ pack }
        />
      )) }
    </div>
  )
}