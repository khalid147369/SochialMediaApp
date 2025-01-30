import { useState, useEffect } from "react";
import TextAreaCBT from "../components/TextAreaCBT";
import Avata from "../components/Avata";
import PostsSkeleton from "../components/PostsSkeleton";

import { Layout, theme } from "antd";
import Post from "../components/Post";

import './Home.css'
import ErrorBoundary from "../components/ErrorBoundary"; // Import ErrorBoundary component
import { backendUrl } from "../config";
import Cookies from "universal-cookie"; // Import universal-cookie
import { useDispatch, useSelector } from "react-redux";
import { getallPosts, sendPost } from "../features/postsSlice";

// ============================================================
const { Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(true);
  // const { posts = [], setPosts } = postsContext;
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.user);
  console.log(posts);
console.log(user);
  useEffect(() => {
    dispatch(getallPosts());
  }, [dispatch]);


  useEffect(() => {
    if (posts && posts.length > 0) {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }, [posts]);

  // Function to handle new post submission
  const handleNewPost = async (newPost) => {
    dispatch(sendPost(newPost));
    console.log(newPost);
  };


  

  const isAvatarClosed = () => {
    setCollapsed(true);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  // handle errors-----------------/

  
  // show all posts
  const showPosts = posts.map((post) => (
    <Post
    
      key={post.id}
      PostId={post.id}
      title={post.title}
      descreption={post.description}
      imageName={post.imagePost}
      avatarSrc={post.avatar}
      likes={post.likes}
      createdAt={post.publicatedAt}
      commentsLenght={post.commentsLenght}
    />
  ));

  return (
      <Layout className="h-fit   lg:max-w-5xl mx-auto" >
        <Layout className=" bg-transparent " >
          <div className="fixed z-10 right-3 top-3 md:right-5 md:top-6 h-fit w-fit ">
            <Avata
            
              isClicked={isAvatarClosed}
              content={user.userName}
              imageSrc={`${backendUrl}${user.avatar}`}
            />
          </div>
          <Content
            className=" bg-transparent  mx-auto md:mx-0 h-fit w-fit flex flex-col items-center gap-10 md:items-center md:w-auto mb-20"
            style={{
              margin: "24px 25px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {!loading ? posts && showPosts : <PostsSkeleton  />}
            
          </Content>
          <div className="fixed right-1/2 transform translate-x-1/2 bottom-2 h-2">
            <TextAreaCBT onSubmit={handleNewPost} />
          </div>
        </Layout>
      </Layout>
  );
};

export default Home;
