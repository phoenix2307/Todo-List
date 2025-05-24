import {Main} from "@/app/Main"
import {PageNotFound} from "@/common/components"
import {Login} from "@/features/auth/ui/Login/Login"
import {Route, Routes} from "react-router"
import {ProtectedRoute} from "@/common/components/ProtectedRoute/ProtectedRoute";

export const Path = {
    Main: "/",
    Login: "login",
    NotFound: "*",
} as const

export const Routing = () => (
    <Routes>
        <Route path={Path.Main}
               element={
                   <ProtectedRoute>
                       <Main/>
                   </ProtectedRoute>
               }/>
        <Route path={Path.Login} element={<Login/>}/>
        <Route path={Path.NotFound} element={<PageNotFound/>}/>
    </Routes>
)
