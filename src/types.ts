interface IBoardStore {
  boardID: string;
  boardName: string;
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