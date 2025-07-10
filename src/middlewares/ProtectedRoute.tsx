import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";


const ProtectedRouteForRedirect : React.FC<{ children: React.ReactNode}> = ({ children }) => {

    const {user} = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()
    const [isAllowed, setIsAllowed] = useState<boolean>(false)

    useEffect(() => {

        console.log(user)
        if(user) {

            setIsAllowed(false)
            navigate("/", {replace: true})
        }else {

            setIsAllowed(true)

        }

    }, [navigate, user])



    return isAllowed ? children : null

}


export default ProtectedRouteForRedirect