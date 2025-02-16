
import TextAreaCBT from "./TextAreaCBT";
import PopUpBox from "./PopUpBox";

function AddPostComponent({onClose }) {


  return (


        <PopUpBox className="custom-popup-box  z-50" show={onClose}>
          <TextAreaCBT className=" md:mt-0  flex gap-2 mx-auto items-center" />
        </PopUpBox>

  );
}

export default AddPostComponent;
