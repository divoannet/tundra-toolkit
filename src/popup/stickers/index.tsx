import React, { useEffect, useState } from 'react';

import { StickerList } from './stickerList';
import { EditDialog } from './editDialog';

import './style.css';

export function Stickers() {

  const [ data, setData ] = useState<IStickerPack[]>([]);

  const [ loaded, setLoaded ] = useState<boolean>(false);
  const [ loading, setLoading ] = useState<boolean>(true);
  const [ error, setError ] = useState<boolean>(false);

  const [ editPack, setEditPack ] = useState<IStickerPack | null>(null);

  const updateData = (newData: IStickerPack[]) => {
    setData(newData);
  }

  const addPack = () => {
    const indexes = data.map(item => item.id);
    const newIndex = data.length ? Math.max(...indexes) + 1 : 0;

    const newData = [ ...data, {
      id: newIndex,
      name: `New Pack ${ newIndex + 1 }`,
      items: [],
    } ]

    console.log('newData', newData);

    setData(newData);
  }

  const removePack = (packId: number) => {
    const newData = [ ...data ];
    const index = newData.findIndex(item => item.id === packId);
    newData.splice(index, 1);
    setData(newData);
  }

  const updateStickerPack = (packId: number, { name, items }: { name?: string, items?: string[] }) => {
    const newData = [ ...data ];
    const index = newData.findIndex(item => item.id === packId);
    newData[ index ].name = name || newData[ index ].name;
    newData[ index ].items = items || newData[ index ].items;
    setData(newData);
  }

  const onEditPack = (packId: number) => {
    const pack = data.find(item => item.id === packId);
    setEditPack(pack);
  }

  const handleSavePack = (newData: IStickerPack) => {
    updateStickerPack(newData.id, newData);
    setEditPack(null);
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await chrome.storage.local.get('stickerPack');

      const stickerPack = result.stickerPack || [];

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

  }, [ data ]);

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
      { data.length
        ? (
          <div class="stickerList">
            <StickerList
              data={ data }
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
        <button class="button small" onClick={ addPack }>Добавить стикерпак</button>
      </div>

      <EditDialog
        pack={ editPack }
        close={ () => setEditPack(null) }
        onSave={ handleSavePack }
        onRemove={ removePack }
      />
    </div>
  )
}