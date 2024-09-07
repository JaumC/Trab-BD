import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Signed } from "../pages/Signed";
import { Login } from "../pages/Login";
import { Sign } from "../pages/Sign";
import { MeuPerfil } from "../pages/MeuPerfil";
import { PreencherPet } from "../pages/PreencherCadastroPets";
import MeusPets from "../pages/MeusPets";

export function AppRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signed" element={<Signed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/MeuPerfil" element={<MeuPerfil/>} />
            <Route path="/PreencherCadastroPets" element={<PreencherPet/>} />
            <Route path="/MeusPets" element={<MeusPets/>} />
        </Routes>
    )
}