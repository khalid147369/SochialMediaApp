import { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Empty, Layout, theme, Typography } from "antd";
import Post from "../components/Post";
import ErrorBoundary from "../components/ErrorBoundary";
import { getFavorites } from '../features/favoritesSlice';
import { useNavigate  } from 'react-router-dom';
import PostsSkeleton from '../components/PostsSkeleton';
import "../App.css"
import Cookies from 'universal-cookie';
import { backendUrl } from '../config';
import Avata from '../components/Avata';
import { EditOutlined } from '@ant-design/icons';
function Favorites() {
  const { Content } = Layout;
  const dispatch = useDispatch();
  const { favorites, loading, errors } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.user);
  const [collapsed, setCollapsed] = useState(true);

  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

  useEffect(() => {
    if (favorites && favorites.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [favorites]);

  useEffect(() => {
    if (errors && errors.response && errors.response.status === 401) {
      navigate("/login");
    }
  }, [errors, navigate]);
  const isAvatarClosed = () => {
    setCollapsed(true);
  };
  if(user.length===0){
    navigate("/login")
    } 
  return (
      <Layout style={favorites.length === 0 ?  { height: "fit-content"  } :{ height: "calc(100vh - 20px)" }} className="   md:p-10  ">
        
           <div className="fixed z-10 right-3 top-3 md:right-5 md:top-6 h-fit w-fit  ">
                  <Avata
                    isClicked={isAvatarClosed}
                    content={user.userName}
                    imageSrc={`${backendUrl}${user.avatar}`}
                  />
                </div>
        <Layout className="h-fit backroundgridient overflow-y-auto   ">
          <Content
            className="flex mx-0 px-0  md:mx-0 flex-col items-center   h-fit w-full md:w-auto bg-transparent "
            style={{
              margin: "24px 25px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            
            { loading ?  <div style={{ height: "calc(100vh - 64px)" }} className='  w-screen'>
                          <PostsSkeleton />
                          <PostsSkeleton />
                          <PostsSkeleton />
                        </div>: favorites.length===0?<Empty className=" absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" description={"no favorites to show"}/>:favorites &&
              favorites.map((post) => (
                <Post
                  key={post.id}
                  PostId={post.id}
                  title={post.title}
                  descreption={post.description}
                  imageName={post.imagePost}
                  avatarSrc={post.avatar}
                  likes={post.likes}
                  commentsLenght={ post.commentsLenght +1}
                  createdAt={post.publicatedAt}
                  postColor={post.postColor}
                  
                />
              ))}
          </Content>
        </Layout>
      </Layout>
  );
}

export default Favorites;