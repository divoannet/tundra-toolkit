import { useEffect, useRef, useState } from 'react';

import StickerPack from './stickerPack';

export default function () {
  const ref = useRef(null);

  const [ data, setData ] = useState<IStickerPack[]>([]);

  const updateStickerPack = async (pack: IStickerPack) => {
    const newData = [ ...data ];
    const index = newData.findIndex(item => item.id === pack.id);
    newData[ index ] = { ...pack };
    await chrome.storage.local.set({ stickerPack: newData });
    setData(newData);
  }

  const addStickerPack = async () => {
    const newData = [ ...data ];
    const indexes = data.map(item => item.id);
    const newIndex = newData.length ? Math.max(...indexes) + 1 : 0;
    newData.push({
      id: newIndex,
      name: `New Pack ${ newIndex + 1 }`,
      items: [],
    });

    await chrome.storage.local.set({ stickerPack: newData })
    setData(newData);
    ref.current.scrollIntoView();
  }

  const removeStickerPack = async (packId: number) => {
    const newData = [ ...data ];
    const index = newData.findIndex(item => item.id === packId);
    if (index < 0) return;

    newData.splice(index, 1);

    await chrome.storage.local.set({ stickerPack: newData });
    setData(newData);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await chrome.storage.local.get('stickerPack');

      const stickerPack = result.stickerPack || [];

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
          <button className="button small" title="Добавить стикерпак" onClick={ addStickerPack }>Добавить</button>
        </div>
      </div>
      <div>
        { data.map((pack => (
          <StickerPack
            key={ pack.id }
            onChange={ updateStickerPack }
            onRemove={ removeStickerPack }
            pack={ pack }
          />
        ))) }
        {!data.length && (
          <div className="emptyList">
            Список пока пуст. Создайте свой первый стикерпак по кнопке "Добавить".
          </div>
        )}
        <div ref={ ref }></div>
      </div>
    </section>
  )
}