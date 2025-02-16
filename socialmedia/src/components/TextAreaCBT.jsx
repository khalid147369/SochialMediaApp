import React, { useState, useEffect, useRef } from "react";
import UploadButton from "./UploadButton";
import { Button, Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useWebSocket } from '../context/WebSocketContext';
import PostColorPicker from "./PostColorPicker";
const { TextArea } = Input;

const TextAreaCBT = ({ className }) => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [postColor, setPostColor] = useState("#1677ff");
  const dispatch = useDispatch();
  const { ws } = useWebSocket();
  const textAreaRef = useRef(null);

  const handleOnFocus = () => {
    setShowColorPicker(true);
    textAreaRef.current.resizableTextArea.textArea.className = `${textAreaRef.current.resizableTextArea.textArea.className} h-40`;
  };

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

  const handleSelectPostColor = (color) => {
    setPostColor(color.toHexString());
    console.log(color.toHexString());
  };

  const handleSubmit = async () => {
    let imageBase = null;
    if (image) {
      imageBase = await convertImageToBase64(image);
      console.log(image);
    }

    if (imageBase != null && image.name !== null) {
      let imageBase64 = imageBase.split(",")[1];
      console.log("tee");
      const newPost = { Description: description, imageBase64: imageBase64 || null, imageName: image.name || null, postColor };
      ws.send(JSON.stringify(newPost));
      setDescription("");
      setImage(null);
    } else {
      console.log("tee");
      const newPost = { Description: description, imageBase64: null, imageName: null, postColor };
      ws.send(JSON.stringify(newPost));
      setDescription("");
      setImage(null);
    }
  };

  return (
    <div className={className}>
      <UploadButton getImage={handleImage} isEmpty={image} />
      <div className="relative flex">
        <TextArea
          onFocus={handleOnFocus}
          ref={textAreaRef}
          className="min-w-40 md:w-80 transition"
          placeholder="type a message"
          autoSize={{
            minRows: 2,
            maxRows: 6,
          }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {showColorPicker && (
          <PostColorPicker
            className="absolute bottom-2 left-2"
            onChangeComplete={handleSelectPostColor}
          />
        )}
      </div>
        
        <button style={{ width: "67px"   }} className=" min-w-fit px-8 py-1 " onClick={handleSubmit}>
         Post
        </button>
    </div>
  );
};

export default TextAreaCBT;
