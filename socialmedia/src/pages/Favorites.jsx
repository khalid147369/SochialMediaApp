import { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Empty, Layout, theme } from "antd";
import Post from "../components/Post";
import ErrorBoundary from "../components/ErrorBoundary";
import { getFavorites } from '../features/favoritesSlice';
import { useNavigate  } from 'react-router-dom';
import PostsSkeleton from '../components/PostsSkeleton';
import "../App.css"
import Cookies from 'universal-cookie';
import { backendUrl } from '../config';
import Avata from '../components/Avata';
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
  return (
      <Layout style={favorites.lenght >0? {height:"fit-content"}:{height:"100vh"}} className=" p-10">
           <div className="fixed z-10 right-3 top-3 md:right-5 md:top-6 h-fit w-fit ">
                  <Avata
                    isClicked={isAvatarClosed}
                    content={user.userName}
                    imageSrc={`${backendUrl}${user.avatar}`}
                  />
                </div>
        <Layout className="h-fit backroundgridient">
          <Content
            className="flex mx-auto md:mx-0 flex-col items-center gap-10 h-fit w-fit md:w-auto bg-transparent"
            style={{
              margin: "24px 25px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            
            { loading ? <PostsSkeleton />: favorites.length===0?<Empty className=" absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" description={"no favorites to show"}/>:favorites &&
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
                />
              ))}
          </Content>
        </Layout>
      </Layout>
  );
}

export default Favorites;