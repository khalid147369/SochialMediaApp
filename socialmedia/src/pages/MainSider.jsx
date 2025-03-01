import  { useState ,useRef ,useEffect } from 'react';
import { Menu ,Layout} from 'antd';
import { HomeOutlined, UploadOutlined ,BookOutlined, WechatOutlined, BellOutlined } from '@ant-design/icons';
const { Sider } = Layout;
import { Link ,useLocation } from 'react-router-dom';
import "../App.css"
function MainSider() {
      const [collapsed, setCollapsed] = useState(true);
      const [selectedKey, setselectedKey] = useState(localStorage.getItem("selectedKey") || "1");
      const ref = useRef();
      const location = useLocation();
      // ref.current.target.defaultSelectedKeys=["2"];
      console.log(selectedKey);
      const handleSelectMenu =(e) =>{
        setselectedKey(e.key);
        localStorage.setItem("selectedKey",e.key);
      } 
useEffect(() => {
  if(location.pathname === "/"){
    setselectedKey("1");

  }
},[location]);
  return (
      <Sider
              onMouseEnter={() => setCollapsed(!collapsed)}
              onMouseLeave={() => setCollapsed(!collapsed)}
              className=" absolute mt-0 h-screen hidden md:block z-20 sider-backround "
              trigger={null}
              collapsible
              collapsed={collapsed}
              // theme='black'
            >
              <div className="demo-logo-vertical" />
              <div className=" my-2 "></div>
              <Menu
                theme="dark"
                mode="inline"
                className=' bg-transparent'
                ref={ref}
                selectedKeys={[`${selectedKey}`]}
                defaultSelectedKeys={["1"]}
                onSelect={handleSelectMenu}
                items={[
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
                    icon: <Link to={"/Contacts"}><WechatOutlined />  </Link> ,
                    label: "Contacts",
                  },
                  {
                    key: "4",
                    icon: <Link to={"/Notifications"}>< BellOutlined />  </Link> ,
                    label: "Notifications",
                  },
                ]}
              />
            </Sider>

  )
}

export default MainSider