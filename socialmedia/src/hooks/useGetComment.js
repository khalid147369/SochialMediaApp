import axios from "axios";
import { useState ,useContext } from "react";
import { backendUrl } from "../config";
import { CommentsContext } from "../context/CommentsContext";

const useGetComment = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useGetComment must be used within a CommentsProvider");
  }
  const { setComments } = context;
  const getComments = async (token, PostId) => {
    try {
        const response = await axios.get(`${backendUrl}/api/comments/${PostId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      setComments(response.data);
      console.log(response.data);
      return {comments : response.data};
    } catch (error) {

      console.error("Error fetching comments:", error);
      return "error in fetshing comments"
    }
  };

  return {  getComments };
};

export default useGetComment;
