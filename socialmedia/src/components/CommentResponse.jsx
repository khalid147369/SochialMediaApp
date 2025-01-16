import React from "react";
import Card from "@ant-design/icons";
import { Avatar } from "antd";
import Avata from "./Avata";

function CommentResponse({ AvatarContent, content,dateDime,title }) {
  return (
    <>
      <div className=" mb-5 flex gap-5 relative p-3 bg-slate-200  w-full h-fit rounded-lg  ">
        <div>
          <Avata content={AvatarContent} />
        </div>

        <div>
          <div className="flex gap-5">
            <p className=" font-bold ">{title}</p>
            <p >{dateDime}</p>
          </div>

          <p>{content}</p>
        </div>
      </div>
    </>
  );
}

export default CommentResponse;
