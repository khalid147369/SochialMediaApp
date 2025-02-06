import React,{useEffect, useState} from "react";
import { motion } from "framer-motion";
function PopUpBox({ children, className ,show=true }) {
  const childrenArray = React.Children.toArray(children);
  const thirdChild = childrenArray[2]; // Get the third child
const [isShwed,setIsShowed] = useState(show)
useEffect(()=>{
    setIsShowed(show)
},[show])
  return (
    isShwed?(<motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${className} fixed inset-0 flex items-center justify-center z-10 bg-gray-100 bg-opacity-55`}
    >
      <div className="w-3/5 md:w-2/4 lg:w-2/5 flex h-72 items-center bg-slate-400 p-4 rounded-lg">
        <span onClick={()=>setIsShowed(false)} className=" self-start cursor-pointer">X</span>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              className: `${
                child.props.className || ""
              } flex flex-col mt-0 gap-5 h-fit`,
            });
          }
          return child;
        })}
      </div>
      {thirdChild && (
        <div className="third-child">
          {React.cloneElement(thirdChild, {
            className: `${thirdChild.props.className || ""}  third-child-class`,
          })}
        </div>
      )}
    </motion.div>):""
  );
}

export default PopUpBox;
