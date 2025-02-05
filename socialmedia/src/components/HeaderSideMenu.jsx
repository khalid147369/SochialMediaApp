import React, { useState } from 'react';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  HomeOutlined,
  BookOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { red } from '@mui/material/colors';
const items =[
    {
      key: "1",
      icon: <Link to={"/"} ><HomeOutlined className='bg-transparent' /></Link>,

      label: "Home",
    },
    {
      key: "2",
      icon: <Link to={"/Favorites"}><BookOutlined/></Link>,
      label: "My Favorites",
    },
    {
      key: "3",
      icon: <Link to={"/MyPosts"}><UploadOutlined  /></Link> ,
      label: "My Posts",
    },
  ]
const HeaderSideMenu = ({className ,onSelect,selectedKeys}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [collapse, setCollapse] = useState("collapse");
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    collapse?
    setCollapse(""):
    setCollapse("collapse")
  };



  return (
    <><Button
        type="primary"
        onClick={toggleCollapsed}
        className=' w-10'
        style={{
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
    <div
    className={`${className} ${collapse}`}
      style={{
        width: 256,
      }}
    >
      
  
      <Menu
      className={`  relative -left-4  `}
      onSelect={onSelect}
      defaultSelectedKeys={["1"]}
      selectedKeys={selectedKeys}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
     
      
     
    </div></>
  
  );
};
export default HeaderSideMenu;