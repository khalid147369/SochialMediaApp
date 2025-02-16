import React from "react";
import { User } from "lucide-react";
import { Avatar } from "antd";
import { backendUrl } from "../config";

export function ChatMessage({ message, isReceived, timestamp ,Contactavatar,userAvatar }) {
  console.log("userAvatar",userAvatar)
  return (
    

    <div
      className={`flex ${isReceived ? "justify-start" : "justify-end"} mb-4 `}
    >
      {isReceived && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
          {Contactavatar? <Avatar src={`${backendUrl}/${Contactavatar}`}/>:<User className="w-5 h-5 text-gray-500" />}
          
        </div>
      )}
      <div
        className={`max-w-[70%] ${
          isReceived
            ? "bg-gray-200 text-gray-800"
            : "bg-blue-500 text-white ml-2"
        } rounded-lg px-4 py-2`}
      >
        <p className="break-words">{message}</p>
        <p
          className={`text-xs mt-1 ${
            isReceived ? "text-gray-500" : "text-blue-100"
          }`}
        >
          {/* {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} */}
        </p>
      </div>
      {!isReceived && (
        <div className="w-8  h-8 rounded-full bg-blue-100 flex items-center justify-center ml-2">
          {userAvatar? <Avatar src={`${backendUrl}${userAvatar}`}/>:<User className="w-5 h-5 text-blue-500" /> }

        </div>
      )}
    </div>
  );
}
