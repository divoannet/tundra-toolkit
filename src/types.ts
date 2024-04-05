interface IBoardStore {
  boardID: string;
  boardName: string;
  boardUrl: string;
  forums: IForumStore[];
}

interface IForumStore {
  forumID: string;
  forumName: string;
  users: IUserStore[];
}

interface IUserStore {
  userID: string;
  userName: string;
}

interface IStickerPack {
  id: number,
  name: string,
  items: string[],
}