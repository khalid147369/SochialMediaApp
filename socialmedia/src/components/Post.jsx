import { useState, useEffect, useContext, Fragment } from "react";
import BookmarkBorderSharpIcon from "@mui/icons-material/BookmarkBorderSharp";
import CommentTextArea from "./CommentTextArea";
import CommentResponse from "./CommentResponse";
import { CommentsContext } from "../context/CommentsContext";
import useSendComment from "../hooks/useSendComment";
import useGetComment from "../hooks/useGetComment";
import { useLocation } from "react-router-dom";
import './Post.css'
import {
  EllipsisOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Avatar, Card, Popover, Empty } from "antd";
import { backendUrl } from "../config";
import axios from "axios";
import Cookies from "universal-cookie";
// import { Button } from "antd/es/radio";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deletePosts} from '../features/myPostsSlice'

const { Meta } = Card;

const Post = ({
  imageName,
  descreption,
  title,
  avatarSrc,
  likes,
  PostId,
  createdAt,
  commentsLenght,
  loading,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [like, setLike] = useState(likes);
  const [color, setcolor] = useState("");
  const [color2, setcolor2] = useState("text-red-500");
  const { comments } = useContext(CommentsContext);
  const { getComments } = useGetComment();
  const [cmnts, setCmnts] = useState(comments || []);
  const [showComment, setshowComment] = useState(false);
  const { sendComment } = useSendComment(); // Ensure hook is called correctly
  const [isSavedText, SetisSavedText] = useState("save post");
  const { user } = useSelector((state) => state.user);

  const location = useLocation();
const dispatch = useDispatch();

  useEffect(() => {
    // Load the liked state for this post from localStorage
    const savedLikes = JSON.parse(localStorage.getItem("likes")) || {};
    setIsLiked(savedLikes[PostId] || false);
  }, [PostId]);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    const savedLikes = JSON.parse(localStorage.getItem("likes")) || {};
    savedLikes[PostId] = newLikedState;
    localStorage.setItem("likes", JSON.stringify(savedLikes));

    if (isLiked === false) {
      axios
        .put(`${backendUrl}/api/Posts/like/${PostId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setLike(response.data.newLikes);
          setIsLiked(response.data.isLiked);
        });
    } else if (isLiked === true) {
      axios
        .put(`${backendUrl}/api/Posts/unlike/${PostId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setLike(response.data.newLikes);
          setIsLiked(response.data.isLiked);
        });
    }
  };
  const handleSavePoast = async () => {
    if (location.pathname == "/Favorites") {
      await axios
        .delete(`${backendUrl}/api/SavedPosts/${PostId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(async (response) => {
          
          console.log(response);
        });
    } else {
      axios.post(`${backendUrl}/api/SavedPosts/${PostId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  };
  const text = <span>Title</span>;
  useEffect(() => {
    location.pathname == "/Favorites"
      ? SetisSavedText("remove saved post")
      : SetisSavedText("save post");
  }, [location]);
  const content = (
    <div>
      <Fragment>
        <Button
          onClick={handleSavePoast}
          onMouseEnter={() => setcolor("text-white")}
          onMouseLeave={() => setcolor("")}
          className={`${color}  w-full flex gap-5`}
        >
          <BookmarkBorderSharpIcon className=" " />
          <p>{isSavedText}</p>
        </Button>
       {location.pathname==="/MyPosts"&&<Button
       onClick={()=>{dispatch(deletePosts(PostId))}}
          onMouseEnter={() => setcolor2("text-white")}
          onMouseLeave={() => setcolor2("text-red-500")}
          className={`${color2}  w-full  flex gap-5`}
        >
          <DeleteOutlined className=" text-xl " />
          <p>delete post</p>
        </Button>}
       
      </Fragment>

      <hr />
      <p>Content</p>
    </div>
  );

  const handleCloseCommentBox = (e) => {
    e.stopPropagation();
    setshowComment(!showComment);
    document.body.classList.remove("no-scroll");
  };
  const handleComment = async () => {
    setshowComment(!showComment);

    document.body.classList.add("no-scroll");

    const { comments } = await getComments(token, PostId);
    setCmnts(comments || []);
    console.log(comments);
  };

  const handleSendComment = async (comment) => {
    const { data } = await sendComment(
      token,
      title,
      comment,
      user.avatar,
      PostId
    );
    if (data) {
      const newComments = [...cmnts, data];
      setCmnts(newComments);
    }
    console.log(data);
  };
  const handleDate = (diffInSeconds) => {
    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minutes ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hours ago`;
    } else if (diffInSeconds < 2592000) {
      // Less than 30 days
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} days ago`;
    } else if (diffInSeconds < 31536000) {
      // Less than a year
      const months = Math.floor(diffInSeconds / 2592000); // 30 days per month
      return `${months} months ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000); // Approximate year (365 days)
      return `${years} years ago`;
    }
  };

  const date = new Date(createdAt);
  const now = Date.now()
  // const DifferenceDate = date -now
  const DifferenceDate = now - date;
  var publicatedAfter = Math.floor(DifferenceDate / 1000);
  console.log(cmnts)
  return (
    <div className=" w-80 md:w-1/2 shadow-sm h-fit ">
      <Card
        className=" relative postBackround custom-card-actions h-fit  "
        cover={
          imageName == null || imageName == "" ? (
            ""
          ) : (
            <img alt="example" className=" w-56 mx-auto" src={`${backendUrl}${imageName}`} />
          )
        }
        
        actions={[
          <Popover
          
            key="ellipses"
            placement="top"
            title={text}
            content={content}
            trigger="click"
          >
            <EllipsisOutlined className=" text-xl "  />
          </Popover>,
          <div onClick={handleComment} key="chat" >
            <ChatBubbleOutlineIcon className=" text-xl mt-2 "  />
          </div>,
          isLiked ? (
            <LikeFilled
              className=" text-xl text-blue-600 "
              key="like"
              onClick={handleLike}
              
            />
          ) : (
            <LikeOutlined
              className=" text-xl "
              key="like"
              onClick={handleLike}
            />
          ),
        ]}
      >
        <Meta
          avatar={
            avatarSrc == null ? (
              <Avatar>{title[0]}</Avatar>
            ) : (
              <Avatar src={`${backendUrl}${avatarSrc}`} />
            )
          }
          title={`${title}`}
          description={`${descreption}`}
        />

        <div className="relative top-4 flex justify-between ">
          <div className="flex gap-2">
            <CommentOutlined />
            <div>{commentsLenght}</div>
          </div>

          <div className="flex gap-1">
            <p>{like}</p>
            <LikeFilled className=" text-blue-600" />
          </div>
        </div>
        <div className=" relative z-10 -right-52 md:-right-60 lg:-right-80 -top-20 w-fit ">
          {handleDate(publicatedAfter)}
        </div>
      </Card>

      {showComment ? (
        <div className="fixed inset-0 bg-gray-100   bg-opacity-55  flex items-center justify-center z-20">
          <Card className="w-96 px-0 postBackround ">
            <div className=" cursor-pointer" onClick={handleCloseCommentBox}>
              X
            </div>
            {cmnts.length == 0 ? (
              <p className="overflow-y-auto p-5 max-h-80 w-full ">
                <Empty className="flex flex-col justify-center items-center"  image={"https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"}  description={"this Post doesn't have comments yet"} />
              </p>
            ) : (
              <div className="overflow-y-auto p-5 max-h-80">
                {cmnts.map((comment) => (
                  <CommentResponse
                    key={comment.id}
                    AvatarContent={comment.avatar}
                    content={comment.content}
                    dateDime={comment.date}
                    title={title}
                  />

                ))}
              </div>
            )}
            <CommentTextArea
              className="h-24 w-full mt-5 bg-slate-300"
              handleSendComment={(cm) => handleSendComment(cm)}
            />
          </Card>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default Post;
