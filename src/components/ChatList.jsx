import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'preact/hooks';

const GET_CHATS = `
  query MyChats {
    chats(order_by: {created_at: desc}) {
      id
      created_at
    }
  }
`;

const CREATE_CHAT = `
  mutation CreateChat {
    insert_chats_one(object: {}) {
      id
    }
  }
`;

export default function ChatList({ user, onSelect, selectedChat }) {
  const { data, refetch } = useQuery(GET_CHATS);
  const [createChat] = useMutation(CREATE_CHAT);

  async function handleNewChat() {
    const res = await createChat();
    refetch();
    onSelect(res.data.insert_chats_one);
  }

  return (
    <div style={{ width: 250, borderRight: '1px solid #ccc', padding: 16 }}>
      <button onClick={handleNewChat}>New Chat</button>
      <ul>
        {data?.chats?.map(chat => (
          <li key={chat.id} style={{ background: selectedChat?.id === chat.id ? '#eee' : 'transparent', cursor: 'pointer' }}
              onClick={() => onSelect(chat)}>
            Chat {chat.id.slice(0, 8)}
          </li>
        ))}
      </ul>
    </div>
  );
}