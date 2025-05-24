import {useAppSelector} from "@/common/hooks";
import {selectIsLoggedIn} from "@/features/auth/model/auth-slice";
import {Navigate} from "react-router";
import {Path} from "@/common/routing";
import {ReactNode} from "react";

type Props = {
    children: ReactNode
}

export const ProtectedRoute = ({children}: Props) => {
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    if (!isLoggedIn) {
        return <Navigate to={Path.Login}/>
    }
    return children
}