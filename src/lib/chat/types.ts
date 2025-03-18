
export interface Message {
  id: string;
  content: string;
  role: "user" | "bot";
  timestamp: number;
  chatId: string;
  bookmarked?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}
