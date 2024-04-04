import { useEffect, useRef, useState } from 'react';

import './style.css';

type Props = {
  pack: IStickerPack;
  onChange: (pack: IStickerPack) => void;
}

export default function ({ pack, onChange }: Props) {
  const dragItem = useRef();
  const dragOverItem = useRef();

  const [ data, setData ] = useState<IStickerPack['items']>([]);

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

    const newData = [ ...data ];
    const itemIndex = Number(dragItem.current);
    const targetIndex = Number(dragOverItem.current);

    newData.splice(itemIndex, 1);
    newData.splice(targetIndex, 0, data[itemIndex]);
    dragItem.current = null;
    dragOverItem.current = null;

    onChange({
      id: pack.id,
      name: pack.name,
      items: newData,
    })
  }

  useEffect(() => {
    setData(pack.items || []);
  }, [ pack ]);

  return (
    <div className="stickerList">
      <div className="stickerListHeader">
        <h4>{ pack.name }</h4>
      </div>
      <div className="stickerListContent">
        { data ? data.map((sticker, index) => (
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
    </div>
  )
}