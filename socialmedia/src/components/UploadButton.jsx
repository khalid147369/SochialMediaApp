import React, { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, message, Upload } from "antd";
import { FileImageOutlined } from "@ant-design/icons";

const UploadButton = ({ getImage, isEmpty }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  useEffect(() => {
    if (isEmpty == null) {
      setImageUrl(null);
    }
  }, [isEmpty]);

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    const url = URL.createObjectURL(info.file.originFileObj);
    setLoading(false);
    setImageUrl(url);
    getImage(info.file.originFileObj);
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
        width: "fit-content",
        height: "fit-content",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> :
      //  <FileImageOutlined />
      ""
       }
      <div
        style={{
          marginTop: 0,
          color:"#7777"
        }}
      >
        Upload 
      </div>
    </button>
  );
  return (
    <Flex gap="small" className="" wrap>
      <Upload
        // name="avatar"
        listType="picture-card"
        className="avatar-uploader  "
        
        showUploadList={false}
        
        
        onChange={handleChange}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </Flex>
  );
};
export default UploadButton;
