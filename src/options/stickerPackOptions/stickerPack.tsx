import { useEffect, useRef, useState } from 'react';

import { checkImageURL } from '../../utils';

import './style.css';

type Props = {
  pack: IStickerPack;
  onChange: (pack: IStickerPack) => void;
}

export default function ({ pack, onChange }: Props) {
  const dragItem = useRef();
  const dragOverItem = useRef();

  const [ edit, setEdit ] = useState<boolean>(false);
  const [ name, setName ] = useState<string>('');
  const [ items, setItems ] = useState<IStickerPack['items']>([]);
  const [ textItems, setTextItems ] = useState<string>('');

  const handleNameChange = ({ target }) => {
    setName(target.value);
  }

  const handleItemsChange = ({ target }) => {
    setTextItems(target.value);
  }

  const showEditPack = () => setEdit(true);

  const hideEditPack = () => {
    setName(pack.name);
    setEdit(false);
  }

  const savePack = () => {
    const clearedItems = textItems.split('\n').filter(item => checkImageURL(item));

    onChange({
      id: pack.id,
      name,
      items: clearedItems,
    });
    setEdit(false);
  }

  const handleDragStart = event => {
    dragItem.current = event.currentTarget.dataset.index;
    event.currentTarget.classList.add('moving');
  }

  const handleDragEnter = event => {
    dragOverItem.current = event.currentTarget.dataset.index;

    event.currentTarget.classList.toggle(
      'hoveredLeft',
      Number(dragItem.current) > Number(dragOverItem.current));
    event.currentTarget.classList.toggle(
      'hoveredRight',
      Number(dragItem.current) < Number(dragOverItem.current));
  }

  const handleDragLeave = event => {
    event.currentTarget.classList.remove('hoveredLeft');
    event.currentTarget.classList.remove('hoveredRight');
  }

  const drop = event => {
    event.currentTarget.classList.remove('moving');
    if (
      typeof dragItem.current !== 'string'
      || typeof dragOverItem.current !== 'string'
      || dragItem.current === dragOverItem.current
    ) return;

    const newData = [ ...items ];
    const itemIndex = Number(dragItem.current);
    const targetIndex = Number(dragOverItem.current);

    newData.splice(itemIndex, 1);
    newData.splice(targetIndex, 0, items[ itemIndex ]);
    dragItem.current = null;
    dragOverItem.current = null;

    onChange({
      id: pack.id,
      name: pack.name,
      items: newData,
    })
  }

  useEffect(() => {
    setName(pack.name || 'UNKNOWN');
    setItems(pack.items || []);
    setTextItems(pack?.items?.join('\n') || '');
  }, [ pack ]);

  return (
    <div className="stickerList">
      <div className="stickerListHeader">
        { edit ? (
          <div>
            <input type="text" value={ name } onChange={ handleNameChange }/>
          </div>
        ) : (
          <h4>{ name }</h4>
        ) }
        <div className="actions">
          { !edit && <button className="button small" onClick={ showEditPack }>🖋️</button> }
          { edit && <button className="button success small" onClick={ savePack }>✔️️</button> }
          { edit && <button className="button small" onClick={ hideEditPack }>❌️</button> }
        </div>
      </div>
      { edit ? (
        <div className="stickerListContent edited">
          <textarea rows={10} value={textItems} onChange={ handleItemsChange } />
        </div>
      ) : (
        <div className="stickerListContent">
          { items ? items.map((sticker, index) => (
            <div
              onDragStart={ handleDragStart }
              onDragEnter={ handleDragEnter }
              onDragLeave={ handleDragLeave }
              onDragEnd={ drop }
              draggable
              className="stickerItem"
              key={ sticker }
              data-index={ index }
            >
              <img src={ sticker }/>
            </div>
          )) : '' }
        </div>
      ) }
    </div>
  )
}