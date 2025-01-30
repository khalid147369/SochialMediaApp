import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, theme } from "antd";
import Post from "../components/Post";
import ErrorBoundary from "../components/ErrorBoundary";
import { getFavorites } from '../features/favoritesSlice';
import { useNavigate  } from 'react-router-dom';
import PostsSkeleton from '../components/PostsSkeleton';
import "../App.css"
function Favorites() {
  const { Content } = Layout;
  const dispatch = useDispatch();
  const { favorites, loading, errors } = useSelector((state) => state.favorites);
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

  return (
      <Layout className="h-fit">
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
            
            {errors && <p>Error: {errors.message}</p>}
            { loading ? <PostsSkeleton />:favorites &&
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