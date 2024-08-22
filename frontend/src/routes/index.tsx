import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Signed } from "../pages/Signed";
import { Login } from "../pages/Login";
import { Sign } from "../pages/Sign";

export function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signed" element={<Signed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign" element={<Sign />} />
        </Routes>
    )
}