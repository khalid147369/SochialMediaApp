import React, { useState } from "react";
import UploadButton from "./UploadButton";
import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";
import Upload from "antd/es/upload/Upload";
import { useSendPosts } from "../hooks/UseSendPosts"; // Assuming UseSendPosts is a regular function
import UseGetAllPosts from "../hooks/UseGetAllPosts";
import { refreshToken } from "../utils/refreshToken"; // Import refreshToken

const { TextArea } = Input;
const TextAreaCBT = () => {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const { data, error, sendPost } = useSendPosts();
  const { data: posts, loading, error: err } = UseGetAllPosts();
  const handleImage = (url) => {
    console.log(url);
    setImage(url);
  };

  const handleSubmit = async () => {
    const token = await refreshToken(); // Use refreshToken function
    await sendPost(token, description, image);
    if (data.status === 200) {
      setDescription("");
      setImage(null);
      console.log(posts);
    }
  };

  return (
    <div className=" flex gap-2">
      <div className=" absolute  -left-20 bottom-0">
        <UploadButton getImage={handleImage} isEmpty={image} />
      </div>
      <TextArea
        className=" relative min-w-40  md:w-96"
        placeholder="type a message"
        autoSize={{
          minRows: 2,
          maxRows: 6,
        }}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className="  absolute -right-20 bottom-1 w-16"
        onClick={handleSubmit}
      >
        <SendOutlined />
      </button>
      {error && console.log(`sending post: ${error.message}`)}
    </div>
  );
};
export default TextAreaCBT;
