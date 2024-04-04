import { useEffect, useRef, useState } from 'react';

import StickerPack from './stickerPack';

export default function () {
  const ref = useRef(null);

  const [ data, setData ] = useState<IStickersData>({});

  const updateStickerPack = async (pack: IStickerPack) => {
    const newData = { ...data };
    newData[ `pack${ pack.id }` ] = { ...pack };
    await chrome.storage.local.set({ stickerPack: newData });
    setData(newData);
  }

  const addStickerPack = async () => {
    const newData = { ...data };
    const indexes = Object.values(data).map(item => item.id);
    const newIndex = indexes.length ? Math.max(...indexes) + 1 : 0;
    newData[`pack${ newIndex }`] = {
      id: newIndex,
      name: `New Pack ${ newIndex + 1 }`,
      items: [],
    };

    await chrome.storage.local.set({ stickerPack: newData })
    setData(newData);
    ref.current.scrollIntoView();
  }

  const removeStickerPack = async (packId: string) => {
    const newData = { ...data };
    delete newData[ packId ];

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
    <section className="stickerPackOptions">
      <div className="stickerPackOptionsHeader">
        <div>
          <h3>Стикеры</h3>
          <h6>Можно перетаскивать стикеры для сортировки</h6>
        </div>
        <div>
          <button className="button small" title="Добавить стикерпак" onClick={addStickerPack}>Добавить</button>
        </div>
      </div>
      <div>
        { Object.entries(data).map(([ packId, pack ]) => (
          <StickerPack
            key={ packId }
            onChange={ updateStickerPack }
            onRemove={ removeStickerPack }
            pack={ pack }
          />
        )) }
        <div ref={ref}></div>
      </div>
    </section>
  )
}