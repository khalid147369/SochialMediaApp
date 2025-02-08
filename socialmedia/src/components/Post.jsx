import { useState, useEffect, useContext, Fragment } from "react";
import BookmarkBorderSharpIcon from "@mui/icons-material/BookmarkBorderSharp";
import CommentTextArea from "./CommentTextArea";
import CommentResponse from "./CommentResponse";
import { CommentsContext } from "../context/CommentsContext";
import useSendComment from "../hooks/useSendComment";
import useGetComment from "../hooks/useGetComment";
import { useLocation } from "react-router-dom";
import "./Post.css";
import {
  EllipsisOutlined,
  LikeOutlined,
  LikeFilled,
  CommentOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Avatar, Card, Popover, Empty } from "antd";
import { backendUrl } from "../config";
import axios from "axios";
import Cookies from "universal-cookie";
// import { Button } from "antd/es/radio";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deletePosts } from "../features/myPostsSlice";
import PublicIcon from "@mui/icons-material/Public";

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
  postColor,
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
        {location.pathname === "/MyPosts" && (
          <Button
            onClick={() => {
              dispatch(deletePosts(PostId));
            }}
            onMouseEnter={() => setcolor2("text-white")}
            onMouseLeave={() => setcolor2("text-red-500")}
            className={`${color2}  w-full  flex gap-5`}
          >
            <DeleteOutlined className=" text-xl " />
            <p>delete post</p>
          </Button>
        )}
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
      return `${minutes} min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} h`;
    } else if (diffInSeconds < 2592000) {
      // Less than 30 days
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} d`;
    } else if (diffInSeconds < 31536000) {
      // Less than a year
      const months = Math.floor(diffInSeconds / 2592000); // 30 days per month
      return `${months} m`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000); // Approximate year (365 days)
      return `${years} y`;
    }
  };

  const date = new Date(createdAt);
  const now = Date.now();
  // const DifferenceDate = date -now
  const DifferenceDate = now - date;
  var publicatedAfter = Math.floor(DifferenceDate / 1000);
  return (
    <div className="  md:mx-auto md:w-1/2 shadow-sm h-fit w-full mb-1  ">
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className=" relative postBackround rounded-none custom-card-actions h-fit overflow-hidden w-full    "
          actions={[
            <Popover
              key="ellipses"
              placement="top"
              title={text}
              content={content}
              trigger="click"
            >
              <EllipsisOutlined className=" text-xl " />
            </Popover>,
            <div onClick={handleComment} key="chat">
              <ChatBubbleOutlineIcon className=" text-xl mt-2 " />
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
            className=" h-fit   "
            avatar={
              <div className="ml-2">
                <div className=" flex items-center gap-2">
                  {avatarSrc === null ? (
                    <Avatar>{title[0]}</Avatar>
                  ) : (
                    <Avatar src={`${backendUrl}${avatarSrc}`} />
                  )}
                  <div>
                    <p className=" text-sm">{title}</p>
                    <div className="flex items-center">
                      <p className="font-normal text-slate-600 text-sm md:text-xl">{`${handleDate(
                        publicatedAfter
                      )}  .`}</p>
                      <PublicIcon className=" text-slate-600 text-sm md:text-xl" />
                    </div>
                  </div>
                </div>
              </div>
            }
            description={
              <div className="flex flex-col  ">

                {imageName ? (
                  <div className=" flex flex-col">
                    <p className=" relative font-normal text-black mt-2 ml-2 mb-1 z-30">{descreption}</p>
                    
                      <img
                      style={{height:"450px"}}
                        className=" "
                        alt="example"
                        src={`${backendUrl}${imageName}`}
                      />
                    
                  </div>
                ) : (
                  <p
                    style={{ background: postColor }}
                    className="h-80 ml-2  md:h-96 flex items-center text-4xl text-white justify-center font-bold"
                  >
                    {descreption}
                  </p>
                )}
                <div className="mt-3 mb-1 flex justify-between w-full">
                  <div className="flex absolute left-5 gap-1">
                    <CommentOutlined />
                    <div>{commentsLenght}</div>
                  </div>
                  <div className="flex absolute right-5 gap-1">
                    <p>{like}</p>
                    <LikeFilled />
                  </div>
                </div>
              </div>
            }
          />
        </Card>

        {showComment ? (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ transition: "2s" }}
            className="fixed   inset-0 bg-gray-100   bg-opacity-55  flex items-center justify-center z-20"
          >
            <Card className="w-96 px-0 postBackround ">
              <div className=" cursor-pointer" onClick={handleCloseCommentBox}>
                X
              </div>
              {cmnts.length == 0 ? (
                <p className="overflow-y-auto p-5 max-h-80 w-full ">
                  <Empty
                    className="flex flex-col justify-center items-center"
                    image={
                      "https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    }
                    description={"this Post doesn't have comments yet"}
                  />
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
          </motion.div>
        ) : (
          ""
        )}
      </motion.div>
    </div>
  );
};
export default Post;
