import React, { useState } from "react";
import UploadButton from "./UploadButton";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import useSendPost from "../hooks/useSendPost";
const { TextArea } = Input;

const TextAreaCBT = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const { sendPost, convertImageToBase64 } = useSendPost();

  const handleImage = (url) => {
    console.log(url);
    setImage(url);
  };

  const handleSubmit = async () => {
    let imageBase = null;
    if (image) {
      imageBase = await convertImageToBase64(image);
      console.log(image)
    }
    
if ( imageBase != null &&  image.name !== null) {
  let imageBase64 = imageBase.split(",")[1];
  console.log("tee")
    const newPost = { Description:description, imageBase64:imageBase64||null,imageName:image.name||null };
    sendPost(newPost);
    setDescription("");
    setImage(null);
  }else{
    console.log("tee")
      const newPost = { Description:description, imageBase64:null,imageName:null };
      sendPost(newPost);
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
