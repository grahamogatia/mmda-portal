import Login from "./pages/Login.tsx"
import {Route, Routes} from "react-router-dom";
import ProtectedRoute from "./lib/ProtectedRoute.tsx";
import Home from "./pages/Home.tsx";
import {useDB} from "@/api/database.ts";
import {useEffect} from "react";

function App() {

    useEffect(() => {
        const initDB = async () => {
            const db = await useDB();
            console.log("DB initialized:", db.name);
        };
        initDB();
    }, []);

    return (
        <Routes>
            <Route path="login" element={<Login />}/>
            <Route element={<ProtectedRoute/>}>
                <Route index element={<Home />}/>
            </Route>
        </Routes>
    )
}

export default App
