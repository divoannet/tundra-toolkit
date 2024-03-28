interface IStickersData {
  [packId: string]: IStickerPack;
}

interface IStickerPack {
  id: number,
  name: string,
  items: string[],
}