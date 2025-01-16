import  { createContext, useState, useEffect } from "react";
import useGetComment from "../hooks/useGetComment";

export const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {

  const [comments, setComments] = useState([]);


  return (
    <CommentsContext.Provider value={{ comments, setComments }}>
      {children}
    </CommentsContext.Provider>
  );
};

// Wrap your application or the relevant part of your component tree with CommentsProvider.




