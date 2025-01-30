import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { HomeOutlined, UploadOutlined } from "@ant-design/icons";
import BookmarkBorderSharpIcon from '@mui/icons-material/BookmarkBorderSharp';
import { Layout } from "antd";
import { Link, useLocation } from "react-router-dom";
const { Header } = Layout;

function MainHeader() {
  const [selectedKey, setSelectedKey] = useState(localStorage.getItem("selectedKey") || "1");
  const location = useLocation();

  const handleSelectMenu = (e) => {
    setSelectedKey(e.key);
    localStorage.setItem("selectedKey", e.key);
  };

  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedKey("1");
    }
  }, [location]);

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
        selectedKeys={[`${selectedKey}`]}
        defaultSelectedKeys={["1"]}
        onSelect={handleSelectMenu}
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
