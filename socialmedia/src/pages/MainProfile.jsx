import React,{useEffect} from "react";
import MyPosts from "./MyPosts";
import MainProfileHeader from "../components/MainProfileHeader";
import { useNavigate, useParams } from "react-router-dom";
import {getUserById} from"../features/userSlice"
import { useDispatch, useSelector } from "react-redux";

function MainProfile() {
const {id} = useParams()
const dispatch = useDispatch()
const {author ,userAuthor ,pageNumber} = useSelector(state=>state.user)
const {myPosts ,loading ,errors} = useSelector(state=>state.myPosts)
  useEffect(()=>{
    dispatch(getUserById(id))
  },[dispatch,id])
  return (
    <MyPosts myPosts={author.posts||[]} loading={loading} errors={errors} pageNumber={pageNumber} >
      <MainProfileHeader author={author||[]} AuthorLoading={userAuthor}  />
    </MyPosts>
  );
}

export default MainProfile;
