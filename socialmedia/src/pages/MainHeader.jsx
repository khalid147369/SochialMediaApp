import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { HomeOutlined, UploadOutlined } from "@ant-design/icons";
import BookmarkBorderSharpIcon from "@mui/icons-material/BookmarkBorderSharp";
import { Layout } from "antd";
import { Link, useLocation } from "react-router-dom";
import usechangeMenu from "../hooks/usechangeMenu";
import HeaderSideMenu from "../components/HeaderSideMenu";
const { Header } = Layout;

function MainHeader() {
  const { setSelectedKey, selectedKey } = usechangeMenu();

  const handleSelectMenu = (e) => {
    setSelectedKey(e.key);
    localStorage.setItem("selectedKey", e.key);
  };

  return (
    <Header
      className="flex md:hidden p-3 md:p-12 fixed"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div className="demo-logo" />

      <Menu
        theme="dark"
        mode="horizontal"
        style={{
          flex: 1,
          minWidth: 0,
          flexGrow: 1, // Ensure the menu takes up available space
        }}
      >
        <HeaderSideMenu
          onSelect={handleSelectMenu}
          className={" absolute top-16 "}
          selectedKeys={[`${selectedKey}`]}
        />
      </Menu>
    </Header>
  );
}

export default MainHeader;
