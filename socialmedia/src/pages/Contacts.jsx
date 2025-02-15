import React, { useState, useRef, useEffect } from "react";
import { Send, Menu, ArrowLeft } from "lucide-react";
import { ChatMessage } from "../components/ChatMessage";
import { ContactList } from "../components/ContactList";
import ChatUI from "./ChatUI";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {getFriends} from '../features/friendsSlice'
import { useOpenChat } from '../hooks/useOpenChat'

const SAMPLE_CONTACTS = [
  {
    id: 1,
    name: "Alice Johnson",
    lastMessage: "See you tomorrow!",
    lastMessageTime: new Date(),
    unreadCount: 2,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
  },

];

function Contacts() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContacts, setShowContacts] = useState(true);
  const messagesEndRef = useRef(null);
 const { friends} = useSelector((state)=>state.friends)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { ws} = useOpenChat()
  const {id} = useParams()
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
useEffect(()=>{
dispatch(getFriends())
},[dispatch])
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
//add user to chat 
  useEffect(() => {
if (id) {
  const friend = friends.find(fs=>fs.id ===id)
  setSelectedContact(friend)
}

  }, [friends,id]);
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    console.log(contact)
    setShowContacts(false);
  };
  const handleReturn = (state) => {
    setSelectedContact(state);
  };
  // Load messages for this contact (simulated)
  return selectedContact ? (
    <ChatUI selectedContact={handleReturn} contact={selectedContact} />
  ) : (<div >
            <div className="flex   items-center gap-2 bg-blue-500 text-white px-6 py-0">
          <button type="button" onClick={() =>navigate("/") } className="flex w-fit items-center focus:outline-none">
            <ArrowLeft />
          </button>
          
          <span>Chats</span>
        </div>
        <ContactList
      contacts={friends}
      selectedContactId={selectedContact}
      onSelectContact={handleSelectContact}
    />
  </div>

  );
}

export default Contacts;
