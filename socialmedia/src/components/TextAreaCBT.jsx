import React, { useState } from "react";
import UploadButton from "./UploadButton";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {useWebSocket} from '../context/WebSocketContext'
const { TextArea } = Input;

const TextAreaCBT = ({className}) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
 const {ws} = useWebSocket()
  const handleImage = (url) => {
    console.log(url);
    setImage(url);
  };
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
    ws.send(JSON.stringify(newPost) );
    setDescription("");
    setImage(null);
  }else{
    console.log("tee")
      const newPost = { Description:description, imageBase64:null,imageName:null };
      ws.send(JSON.stringify(newPost) );
      setDescription("");
      setImage(null);
  }

  };

  return (
    <div className={className}>
      <div className=" ">
        <UploadButton getImage={handleImage} isEmpty={image} />
      </div>
      <TextArea
        className="  min-w-40  md:w-96"
        placeholder="type a message"
        autoSize={{
          minRows: 2,
          maxRows: 6,
        }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="   w-16"
        onClick={handleSubmit}
      >
        <SendOutlined />
      </button>
    </div>
  );
};

export default TextAreaCBT;
