import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './context/UserContext';
import { PostsProvider } from './context/PostsContext'; // Assuming you have a PostsContext

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <PostsProvider>
        <App />
      </PostsProvider>
    </UserProvider>
  </StrictMode>,
)
