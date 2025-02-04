import { useEffect ,useState } from "react";
import { useLocation } from "react-router-dom";

const useChangeMenu = ()=>{
    const [selectedKey, setSelectedKey] = useState(localStorage.getItem("selectedKey") || "1");
    const location = useLocation();
  console.log(selectedKey)
    useEffect(() => {
      if (location.pathname === "/") {
        setSelectedKey("1");
      }
    }, [location]);

    return {selectedKey ,setSelectedKey}
}




export default useChangeMenu;