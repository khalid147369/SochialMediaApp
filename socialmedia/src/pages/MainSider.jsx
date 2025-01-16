import  { useState ,useRef ,useEffect } from 'react';
import { Menu ,Layout} from 'antd';
import { HomeOutlined, UploadOutlined ,BookOutlined } from '@ant-design/icons';
const { Sider } = Layout;
import { Link ,useLocation } from 'react-router-dom';

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
              className="fixed h-screen hidden md:block z-20"
              trigger={null}
              collapsible
              collapsed={collapsed}
            >
              <div className="demo-logo-vertical" />
              <div className=" my-2 bg-red-400"></div>
              <Menu
                theme="dark"
                mode="inline"
                ref={ref}
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
                    icon: <Link to={"/Favorites"}><BookOutlined/></Link>,
                    label: "My Favorites",
                  },
                  {
                    key: "3",
                    icon: <Link to={"/MyPosts"}><UploadOutlined  /></Link> ,
                    label: "My Posts",
                  },
                ]}
              />
            </Sider>

  )
}

export default MainSider