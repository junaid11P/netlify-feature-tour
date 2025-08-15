<html lang="en">
  <head>
    <title>Chatbot App</title>
    <meta charset="UTF-8" />
  </head>
  <body>
    <script type="module">
      import { useEffect, useState } from 'preact/hooks';
      import { nhost } from '../nhost';
      import { ApolloProvider } from '@apollo/client';
      import { client } from '../apollo';
      import AuthForm from './AuthForm.jsx';
      import ChatList from './ChatList.jsx';
      import ChatView from './ChatView.jsx';

      export default function ChatApp() {
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [user, setUser] = useState(null);
        const [selectedChat, setSelectedChat] = useState(null);

        useEffect(() => {
          nhost.auth.onAuthStateChanged((event, session) => {
            setIsAuthenticated(!!session?.accessToken);
            setUser(session?.user || null);
          });
          setIsAuthenticated(nhost.auth.isAuthenticated());
          setUser(nhost.auth.getUser());
        }, []);

        if (!isAuthenticated) return <AuthForm />;

        return (
          <ApolloProvider client={client}>
            <div style={{ display: 'flex', height: '100vh' }}>
              <ChatList user={user} onSelect={setSelectedChat} selectedChat={selectedChat} />
              {selectedChat && <ChatView chatId={selectedChat.id} user={user} />}
            </div>
          </ApolloProvider>
        );
      }
    </script>
    <ChatApp />
  </body>
</html>