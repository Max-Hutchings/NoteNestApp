import "./navbar.css"
import React, {useState, useContext} from "react";
import { Link } from 'react-router-dom';
import {useMediaQuery} from "react-responsive";
import Create from '@mui/icons-material/Create';
import NavbarAddons from "./navbar_addons/NavbarAddons";
import MenuIcon from '@mui/icons-material/Menu';
import {useSelector, useDispatch} from "react-redux"
import {logout} from "../../services/slices/UserAthenticationSlice"


function Navbar(){

    const user = useSelector(state => state.auth.user)
    const isAuthenticated = !!user

    const dispatch = useDispatch();
    const logoutUser = () => dispatch(logout)


    const isMobile = useMediaQuery({query: '(max-width: 767px)'});
    const [mobileMenu, setMobileMenu] = useState(false)

    function toggleMobileMenu(){
        setMobileMenu(mobileMenu => !mobileMenu)
    }

    return(
        <nav className={"navbar navbar-expand-lg"}>
            <div className={"container-fluid"}>
                <Link className={"navbar-icon-title"} to={"/"}>
                    <Create
                        sx={{
                            fontSize: "2rem",

                        }}/>
                    NoteNest
                </Link>
                {isMobile ? (
                    <>
                        <MenuIcon
                            onClick={toggleMobileMenu}
                            isAuthenticated={isAuthenticated}
                        />
                        {mobileMenu ? <NavbarAddons logoutUser={logoutUser} toggleMobileMenu={toggleMobileMenu} mobileFirst={true}/> : null}
                    </>
                ) : (
                    <NavbarAddons logoutUser={logoutUser}/>
                )}

            </div>

        </nav>
    )
}


export default Navbar