import React, { useEffect, useState } from 'react';

import { StickerList } from './stickerList';
import { EditDialog } from './editDialog';

import './style.css';

export function Stickers() {

  const [ data, setData ] = useState<IStickersData>({});

  const [ loaded, setLoaded ] = useState<boolean>(false);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<boolean>(false);

  const [editPack, setEditPack] = useState<IStickerPack | null>(null);

  const updateData = (newData: IStickersData) => {
    setData(newData);
  }

  const addPack = () => {
    const indexes = Object.values(data).map(item => item.id);
    const newIndex = indexes.length ? Math.max(...indexes) + 1 : 0;

    setData({
      ...data,
      [ `pack${ newIndex}` ]: {
        id: newIndex,
        name: `New Pack ${ newIndex + 1 }`,
        items: [],
      }
    });
  }

  const removePack = (packId: string) => {
    const newData = { ...data };
    delete newData[ packId ];

    setData(newData);
  }

  const updateStickerPack = (packId: string, { name, items }: { name?: string, items?: string[] }) => {
    const newData = { ...data };
    newData[ packId ].name = name || newData[ packId ].name;
    newData[ packId ].items = items || newData[ packId ].items;

    setData(newData);
  }

  const onEditPack = (packId: string) => {
    const pack: IStickerPack = data[packId] || null;
    setEditPack(pack);
  }

  const handleSavePack = (newData: IStickerPack) => {
    const isNotUniq = Object.values(data).some(item => item.name === newData.name && item.id !== newData.id);
    if (isNotUniq) return;

    updateStickerPack(`pack${newData.id}`, newData);
    setEditPack(null);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await chrome.storage.local.get('stickerPack');

      const stickerPack = result.stickerPack || {};

      updateData(stickerPack);
    }

    fetchData()
      .then(() => {
        setError(false);
        setLoaded(true);
      })
      .catch(reason => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [])

  useEffect(() => {
    if (!loaded) return;

    const updateData = async () => {
      await chrome.storage.local.set({ stickerPack: data });
    }

    updateData().then(() => {
      console.log('Storage updated');
    })

  }, [data]);

  if (loading) {
    return (
      <div>
        . . . Loading . . .
      </div>
    )
  }

  if (error) {
    return (
      <div>
        Error
      </div>
    )
  }

  return (
    <div class="stickerListWrapper">
      { Object.keys(data).length
        ? (
          <div class="stickerList">
            <StickerList
              data={ data }
              removePack={ removePack }
              editStickerPack={ onEditPack }
            />
          </div>
        )
        : (
          <div class="stickerList stickerList_empty">
            <div class="stickerList_emptyIcon" onClick={ addPack }></div>
            <div class="stickerList_emptyTitle" onClick={ addPack }>Список пуст</div>
          </div>
        ) }
      <div class="stickerListActions">
        <button class="button" onClick={ addPack }>Добавить стикерпак</button>
      </div>

      <EditDialog
        pack={editPack}
        open={!!editPack}
        close={() => setEditPack(null)}
        onSave={handleSavePack}
      />
    </div>
  )
}