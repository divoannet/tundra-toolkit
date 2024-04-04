import { useEffect, useRef, useState } from 'react';

type Props = {
  pack?: IStickerPack;
  onSave: (data: IStickerPack) => void;
  open: () => void;
  close: () => void;
}

export function EditDialog<Props>({
  pack,
  onSave,
  open,
  close,
}) {
  const ref = useRef();

  const initialState: IStickerPack = {
    id: 0,
    name: '',
    items: [],
  }

  const [newData, setNewData] = useState<IStickerPack>(initialState);

  const handleNameChange = event => {
    setNewData({ ...newData, name: event.target.value });
  }

  const handleItemsChange = event => {
    const values = event.target.value.split('\n');
    setNewData({ ...newData, items: values });
  }

  const handleSave = () => {
    onSave(newData);
  }

  useEffect(() => {
    if (open) {
      // @ts-ignore
      ref.current?.showModal();
    } else {
      // @ts-ignore
      ref.current?.close();
    }
  }, [open]);

  useEffect(() => {
    if (!pack) return;

    setNewData(pack);
  }, [pack]);

  return (
    <dialog class="editPackDialog" ref={ref} onCancel={close}>
      <div>
        <input type="text" value={newData.name} onChange={handleNameChange} />
      </div>
      <div>
        <textarea rows={4} value={newData.items.join('\n')}  onChange={handleItemsChange} />
      </div>
      <div class="editPackDialogActions">
        <button
          onClick={close}
          class="button"
        >
          Отмена
        </button>
        <button
          onClick={handleSave}
          class="button"
        >
          Сохранить
        </button>
      </div>
    </dialog>
  )
}
