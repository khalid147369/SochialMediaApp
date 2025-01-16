import React from "react";
import { Menu } from "antd";
import { HomeOutlined, UploadOutlined } from "@ant-design/icons";
import BookmarkBorderSharpIcon from '@mui/icons-material/BookmarkBorderSharp';
import { Layout } from "antd";
import { Link } from "react-router-dom";
const { Header } = Layout;

function MainHeader() {
  return (
    <Header
      className=" flex  md:hidden p-3 md:p-12 fixed"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        alignItems: "center",
      }}
    >
      <div className="demo-logo" />

      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={[
          {
            key: "1",
            icon: <Link to={"/"} ><HomeOutlined /></Link>,
            label: "Home",
          },
          {
            key: "2",
            icon: <Link to={"/Favorites"}><BookmarkBorderSharpIcon /></Link>,
            label: "My Favorites",
          },
          {
            key: "3",
            icon: <Link to={"/MyPosts"}><UploadOutlined /></Link>,
            label: "My Posts",
          },
        ]}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      />
    </Header>
  );
}

export default MainHeader;
