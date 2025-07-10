import { Link } from "react-router-dom";

//REACT-ICONS
import { FaLongArrowAltLeft } from "react-icons/fa";


export const ArrowBack: React.FC = () => {

    return (

        <Link to="/">
        <FaLongArrowAltLeft
          className="relative top-5 left-11 cursor-pointer"
          size={40}
        />
      </Link>

    )

}
