import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { backendUrl } from "../config";
import PostColorPicker from "./PostColorPicker";
function PopUpBox({ children, className, show }) {
  const { user } = useSelector((state) => state.user);

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${className} fixed inset-0 flex items-center justify-center z-10 bg-gray-100 bg-opacity-55`}
    >
      <div className="w-fit md:w-2/4 lg:w-2/5 flex  items-center bg-slate-400 p-4 rounded-lg  h-fit">
      <span onClick={show} className=" self-start    cursor-pointer">
          X
        </span>
        
          <Avatar
            src={`${backendUrl}/${user.avatar}`}
            className=" self-start absolute transform -translate-x-1/2 left-1/2  border border-gray-300 border-dashed"
            shape="square"
            size={64}
            icon={<UserOutlined />}
          />
          
        

        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              className: `${
                child.props.className || ""
              } mt-0   flex-col  gap-5 h-fit mt-20 `,
            });
          }
          return child;
        })}
      </div>
    </motion.div>
  );
}

export default PopUpBox;
