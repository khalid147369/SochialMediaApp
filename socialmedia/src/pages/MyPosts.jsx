import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Empty, Layout, theme } from "antd";
import Post from "../components/Post";
import ErrorBoundary from "../components/ErrorBoundary";
import { getMyPosts } from "../features/myPostsSlice";
import { useNavigate } from "react-router-dom";
import PostsSkeleton from '../components/PostsSkeleton';
import '../App.css'
import Cookies from "universal-cookie";
function MyPosts() {
  const { Content } = Layout;
  const dispatch = useDispatch();
  const { myPosts, loading, errors } = useSelector((state) => state.myPosts || {});
  const navigate = useNavigate();
 const cookie = new Cookies();
  const refreshToken = cookie.get("refreshToken")
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  if (!refreshToken) {
    navigate("/login")
  }
  useEffect(() => {
    dispatch(getMyPosts());
  }, [dispatch]);

  useEffect(() => {
    if (myPosts && myPosts.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [myPosts]);

  useEffect(() => {
    if (errors && errors.response && errors.response.status === 401) {
      navigate("/login");
    }
  }, [errors, navigate]);

  return (
      <Layout style={myPosts.lenght >0? {height:"fit-content"}:{height:"100vh"}} className="  p-10 ">
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
            { loading ? <PostsSkeleton /> : myPosts.length===0?<Empty className=" absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" description={"no posts to show"}/>: myPosts &&
              myPosts.map((post) => (
                <Post
                  key={post.id}
                  PostId={post.id}
                  title={post.title}
                  descreption={post.description}
                  imageName={post.imagePost}
                  avatarSrc={post.avatar}
                  likes={post.likes}
                  commentsLenght={post.commentsLenght}
                  createdAt={post.publicatedAt}

                />
              ))}
          </Content>
        </Layout>
      </Layout>
  );
}

export default MyPosts;
