import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { useState } from 'preact/hooks';

const GET_MESSAGES = `
  subscription ChatMessages($chat_id: uuid!) {
    messages(where: {chat_id: {_eq: $chat_id}}, order_by: {created_at: asc}) {
      id
      content
      is_bot
      created_at
    }
  }
`;

const SEND_MESSAGE = `
  mutation SendMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(object: {chat_id: $chat_id, content: $content, is_bot: false}) {
      id
    }
    sendMessage(chat_id: $chat_id, content: $content) {
      reply
    }
  }
`;

export default function ChatView({ chatId, user }) {
  const { data } = useSubscription(GET_MESSAGES, { variables: { chat_id: chatId } });
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    await sendMessage({ variables: { chat_id: chatId, content: input } });
    setInput('');
    setLoading(false);
  }

  return (
    <div style={{ flex: 1, padding: 16 }}>
      <div style={{ height: '80vh', overflowY: 'auto', marginBottom: 16 }}>
        {data?.messages?.map(msg => (
          <div key={msg.id} style={{ textAlign: msg.is_bot ? 'right' : 'left', margin: '8px 0' }}>
            <span style={{ background: msg.is_bot ? '#e0f7fa' : '#f1f8e9', padding: 8, borderRadius: 4 }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input value={input} onInput={e => setInput(e.target.value)} placeholder="Type your message..." style={{ flex: 1 }} />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}