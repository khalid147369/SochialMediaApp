import React, { useState } from "react";
import UploadButton from "./UploadButton";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { sendPost, getallPosts } from "../features/postsSlice";

const { TextArea } = Input;

const TextAreaCBT = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  const handleImage = (url) => {
    console.log(url);
    setImage(url);
  };

  const handleSubmit = async () => {
    const newPost = {  description, image };
    const resultAction = await dispatch(sendPost(newPost));
    if (sendPost.fulfilled.match(resultAction)) {
      setDescription("");
      setImage(null);
    }
    
  };

  return (
    <div className=" flex gap-2">
      <div className=" absolute   -left-20 bottom-0">
        <UploadButton getImage={handleImage} isEmpty={image} />
      </div>
      <TextArea
        className=" relative bottom-11 min-w-40  md:w-96"
        placeholder="type a message"
        autoSize={{
          minRows: 2,
          maxRows: 6,
        }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="  absolute  -right-20 bottom-1 w-16"
        onClick={handleSubmit}
      >
        <SendOutlined />
      </button>
    </div>
  );
};

export default TextAreaCBT;
