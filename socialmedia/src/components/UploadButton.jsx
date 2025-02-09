import React, { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Flex, message, Upload } from "antd";
import { FileImageOutlined } from "@ant-design/icons";

const UploadButton = ({ getImage, isEmpty ,UploadDescreption="Upload" }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (isEmpty == null) {
      setImageUrl(null);
    }
  }, [isEmpty]);

  const handleChange = (info) => {
    // if (isRemoving) {
    //   setIsRemoving(false);
    //   return;
    // }
    setIsRemoving(true)
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (imageUrl) {
      message.warning("File already exists");
      setLoading(false);
      return;
    }
    const url = URL.createObjectURL(info.file.originFileObj);
    setLoading(false);
    setImageUrl(url);
    getImage(info.file.originFileObj);
  };

  const handleRemove = () => {
    setIsRemoving(false);
    setImageUrl(null);
    getImage(null);
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
      {loading ? <LoadingOutlined /> : ""}
      <div
      className=" text-gray-100 font-light"
        style={{
          marginTop: 0,
          color: "#7777",
        }}
      >
        {UploadDescreption}
      </div>
    </button>
  );

  return (
    <Flex gap="small" className=" relative  " wrap>
      <Upload
        // name="avatar"
        listType="picture-card"
        className={isRemoving?`avatar-uploader pointer-events-none `:`avatar-uploader  `}
        showUploadList={false}
        onChange={handleChange}
      >
        {imageUrl ? (
          <div className="relative  ">
            <img
            style={{height:"102px",width:"102px"}}
            className=""
              src={imageUrl}
              alt="avatar"
              
            />
            
          </div>
        ) : (
          uploadButton
        )}
         
      </Upload>
     {imageUrl?<button
              className=" absolute transition z-10         -top-3 left-0   bg-opacity-50 bg-slate-600 text-white"
              onClick={handleRemove}
              style={{ marginTop: "11px",height:"105px" }}
            >
              <DeleteOutlined className=" transition hover:text-blue-500" /> 
            </button>:""}
      
    </Flex>
  );
};

export default UploadButton;
