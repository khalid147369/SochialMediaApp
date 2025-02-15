import React from "react";
import { Divide, User } from "lucide-react";
import { Divider } from "@mui/material";
import { backendUrl } from "../config";

export function ContactList({ contacts, selectedContactId, onSelectContact }) {
  return (
    <div className=" flex flex-col  w-full h-full overflow-y-auto">
      {contacts.map((contact) => (
        <><button
          key={contact.id}
          onClick={() => onSelectContact(contact)}
          className={`w-full bg-white  p-4 flex  items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
            selectedContactId === contact.id ? "bg-blue-50" : ""
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            {contact.avatar ? (
              <img
                src={`${backendUrl}/${contact.avatar}`}
                alt={contact.userName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900 truncate">
                {contact.userName}
              </h3>
            </div>
            {/* <p className="text-sm text-gray-500 truncate">
              {contact.lastMessage}
            </p> */}
          </div>
          {/* {contact.unreadCount && contact.unreadCount > 0 && (
            <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
              {contact.unreadCount}
            </div>
          )} */}
          
        </button><Divider/></>
      ))}
      
    </div>
  );
}
