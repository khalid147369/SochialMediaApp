import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Empty, Layout, theme } from "antd";
import Post from "../components/Post";
import ErrorBoundary from "../components/ErrorBoundary";
import { getMyPosts } from "../features/myPostsSlice";
import { useNavigate } from "react-router-dom";
import PostsSkeleton from '../components/PostsSkeleton';
import '../App.css'
import Cookies from "universal-cookie";
import Avata from "../components/Avata";
import { backendUrl } from "../config";
function MyPosts() {
  const { Content } = Layout;
  const dispatch = useDispatch();
  const { myPosts, loading, errors } = useSelector((state) => state.myPosts || {});
  const navigate = useNavigate();
  const { user , userLoading } = useSelector((state) => state.user);
  const [collapsed, setCollapsed] = useState(true);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
  const isAvatarClosed = () => {
    setCollapsed(true);
  };
  console.log(user)
  if(!userLoading && user.length ==0){
    navigate("/login")
    }  
  return (
      <Layout style={{ height: "calc(100vh - 64px)" }} className="  overflow-y-auto   ">
            <div className="fixed z-10 right-3 top-3 md:right-5 md:top-6 h-fit w-fit ">
                          <Avata
                            isClicked={isAvatarClosed}
                            content={user.userName}
                            imageSrc={`${backendUrl}${user.avatar}`}
                          />
                        </div>
        <Layout className="h-fit backroundgridient ">
          <Content
            className="flex mx-0 px-0 md:mx-0 flex-col items-center  h-fit w-full md:w-auto bg-transparent"
            style={{
              // margin: "24px 25px",
              // padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            { loading ? <div style={{ height: "calc(100vh - 64px)" }} className='  w-screen'>
                                      <PostsSkeleton />
                                      <PostsSkeleton />
                                      <PostsSkeleton />
                                    </div> : myPosts.length===0?<Empty className=" absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" description={"no posts to show"}/>: myPosts &&
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
                  postColor={post.postColor}
                  
                />
              ))}
          </Content>
        </Layout>
      </Layout>
  );
}

export default MyPosts;
