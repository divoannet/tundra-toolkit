
import './style.css';

type Props = {
  pack: IStickerPack;
}

export default function ({ pack }: Props) {
  return (
    <div className="stickerList">
      <div className="stickerListHeader">
        <h4>{ pack.name }</h4>
      </div>
      <div className="stickerListContent">
        { pack.items.map(sticker => (
          <div className="stickerItem" key={ sticker }>
            <img src={ sticker }/>
          </div>
        )) }
      </div>
    </div>
  )
}