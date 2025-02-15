import { Card, CardMedia } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { backendUrl } from "../config";
import "./Post.css";
import { Avatar, Button } from "antd";
import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
import {
  EditOutlined,
  PlusOutlined,
  SendOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import undifindUser from "../assets/undifindUser.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  sendFriendRequest,
  deleteRequest,
  checkIsfriend,
} from "../features/friendsSlice";
function MainProfileHeader({ author }) {
  const [isUser, setIsUser] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { isFriend } = useSelector((state) => state.friends);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addFriendRef = useRef();
  const cancelRef = useRef();
  useEffect(() => {
    console.log(author.userId);
    console.log(user.userId);
    if (author.userId == user.userId) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, [author, user.userId]);
  useEffect(() => {
    dispatch(checkIsfriend(author.userId));
  }, [dispatch, author.userId]);
  useEffect(() => {
    localStorage.setItem(
      author.userId,
      JSON.stringify({
        cancelRef:
        
          !JSON.parse(localStorage.getItem(author.userId))?.cancelRef && JSON.parse(localStorage.getItem(author.userId))?.addFriendRef != "hidden" ?  
          "hidden":"",
        addFriendRef:
          JSON.parse(localStorage.getItem(author.userId))?.addFriendRef || "",
      })
    );
  }, [author.userId]);
  return (
    <Card className="relative">
      <div className="absolute bottom-0 left-0 w-full h-1/2 z-20 postBackround px-4 ">
        <div className=" relative bg-white w-36 h-36  rounded-full bottom-24 overflow-hidden">
          {author.avatar === undefined || author.avatar === null ? (
            <img src={undifindUser} />
          ) : (
            <img src={`${backendUrl}/${author.avatar}`} />
          )}
        </div>
        <div className="relative flex flex-col gap-1  bottom-12 h-full">
          <h1 className=" relative bottom-10 left-8 font-bold text-2xl ">
            {author.userName}
          </h1>
          {isUser ? (
            <>
              <Button>
                <PlusOutlined />
                add post
              </Button>
              <Button
                onClick={() => navigate("/Profile")}
                className=" bg-blue-500 text-white"
              >
                <EditOutlined />
                Edit account
              </Button>
            </>
          ) : (
            <>
              {isFriend === true ? (
                <Button>
                  <UserOutlined />
                  freinds
                </Button>
              ) : (
                <>
                  <Button
                    ref={addFriendRef}
                    className={`${
                      JSON.parse(localStorage.getItem(author.userId))
                        ?.addFriendRef
                    }`}
                    onClick={() => {
                      console.log(author.userId);
                      dispatch(sendFriendRequest(author.userId)),
                        (addFriendRef.current.className = `${addFriendRef.current.className} hidden `),
                        cancelRef.current.classList.remove("hidden");
                      localStorage.setItem(
                        author.userId,
                        JSON.stringify({
                          cancelRef: "",
                          addFriendRef: "hidden",
                        })
                      );
                    }}
                  >
                    <UserAddOutlined />
                    Add freind
                  </Button>
                  <Button
                    className={`${
                      JSON.parse(localStorage.getItem(author.userId))?.cancelRef
                    } `}
                    ref={cancelRef}
                    onClick={() => {
                      dispatch(deleteRequest(author.userId));
                      (cancelRef.current.className = `${cancelRef.current.className} hidden`),
                        addFriendRef.current.classList.remove("hidden");
                      localStorage.setItem(
                        author.userId,
                        JSON.stringify({
                          cancelRef: "hidden",
                          addFriendRef: "",
                        })
                      );
                    }}
                  >
                    <UserDeleteOutlined />
                    cancel request
                  </Button>
                </>
              )}

              <Button
                onClick={() => navigate("/Profile")}
                className=" bg-blue-500 text-white"
              >
                <SendOutlined />
                Send message
              </Button>
            </>
          )}
        </div>
      </div>
      <CardMedia
        component="img"
        height="200"
        image={
          author.avatar === undefined || author.avatar === null
            ? undifindUser
            : `${backendUrl}/${author.avatar}`
        }
        alt="My Image"
      />
    </Card>
  );
}

export default MainProfileHeader;
