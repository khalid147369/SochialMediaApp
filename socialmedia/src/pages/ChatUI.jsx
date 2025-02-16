import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, User } from 'lucide-react';
import { ChatMessage } from '../components/ChatMessage';
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../config';
import { getMessages } from '../features/friendsSlice'
import {useOpenChat} from '../hooks/useOpenChat'

function ChatUI({selectedContact,contact}) {
  const dispatch = useDispatch()

  const {ws} = useOpenChat()
  const {messages} = useSelector(state=>state.friends)

useEffect(()=>{
  dispatch(getMessages(contact.id))
},[dispatch,contact])
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {

      setNewMessage('');
      const data = {
        ReceiverId:contact.id,
    Content:newMessage
    
    }   

      ws.send(JSON.stringify(data))

    }
  };

  return (
    <div className="min-h-screen h-screen bg-gray-100 flex items-center justify-center md:p-4">
      <div className="flex flex-col w-full h-full max-w-2xl bg-white shadow-lg overflow-hidden">
        {/* Chat Header */}
        <div className="flex absolute w-full max-w-2xl  z-10  items-center gap-2 bg-blue-500 text-white px-6 pl-0">
          <button type="button" onClick={() =>selectedContact(null) } className="flex w-fit items-center focus:outline-none">
            <ArrowLeft />
          </button>

          {contact.avatar?<Avatar src={`${backendUrl}/${contact.avatar}`} />:<User/>}
          <span>{contact.userName}</span>
        </div>
        {/* Messages Container */}
        <div  className=" min-h-screen overflow-y-auto p-6 bg-white ">
          {messages.filter(mess =>mess.userId ==contact.id || mess.senderId ==contact.id || mess.senderId ==user.userId || mess.receiverID==contact.id ).map((message) => (
            <>
          <ChatMessage
              key={message.id}
              message={message.content}
              Contactavatar = {contact.avatar}
              userAvatar = {user.avatar}
              isReceived={message.senderId == user.userId || message.userId == user.userId ?false:message.userId ==contact.id || message.senderId ==contact.id ?true:""}
              timestamp={message.timestamp}
            />{console.log("isresieved >>>>",message.senderId)}</>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 sticky  mt-0  bottom-0 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-500 flex items-center gap-3 justify-center w-40 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              disabled={!newMessage.trim()}
            >

              <p>Send</p><Send className="w-5 h-5 " />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatUI;