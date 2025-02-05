import React from "react";
import Card from "@ant-design/icons";
import { Avatar } from "antd";
import Avata from "./Avata";
import { backendUrl } from "../config";
import {motion} from 'framer-motion'

function CommentResponse({ AvatarContent, content,dateDime,title }) {
  return (
  
      <motion.div initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1,width:"20%", y: 0 }}
      exit={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} className=" mb-5 flex gap-5 relative p-3 bg-slate-800 bg-opacity-5   w-full h-fit rounded-lg  ">
        <div>
          <Avatar src={`${backendUrl}${AvatarContent}`} />
        </div>

        <div>
          <div className="flex gap-5">
            <p className=" font-bold ">{title}</p>
            <p >{dateDime}</p>
          </div>

          <p>{content}</p>
        </div>
      </motion.div>
   
  );
}

export default CommentResponse;
