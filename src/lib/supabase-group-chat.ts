
// This file serves as a compatibility layer for components still using the old import path
// We should migrate all components to use the new imports in the future

export { 
  SupaGroup, 
  SupaGroupMember, 
  SupaChatMessage 
} from './chat/types';

export { 
  getGroupDetails 
} from './chat/group-operations';

export { 
  getGroupMessages,
  sendTextMessage,
  sendImageMessage
} from './chat/message-operations';

export { 
  getPublicImageUrl,
  ensureChatMediaBucketExists
} from './chat/media-operations';

export { 
  listenForGroupMessages,
  enableRealtimeForChat
} from './chat/realtime-operations';
