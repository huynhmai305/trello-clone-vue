export interface Card {
  id?: string;
  title?: string;
  dateCreated?: Date;
  listId?: string;
}

export interface List {
  id?: string;
  title?: string;
  cards?: Card[];
  dateCreated?: Date;
}
