import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Header(props) {
    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState("")
    const [avatar, setAvatar] = useState("")
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = token

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userData = await axios.get("/users/me").then(res => res.data)
                setUserDetails(userData)
            } catch (e) {
                RedirectToLogin()
            }
        }
        token && fetchUserDetails()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const fetchUserAvatar = async () => {
            try {
                const userAvatar = await axios.get(`/users/${userDetails._id}/avatar`).then(res => res.data)
                setAvatar(`data:image/png;base64, ${userAvatar}`)
            } catch (e) {
                setAvatar("")
            }
        }
        userDetails && fetchUserAvatar()
    }, [userDetails])

    useEffect(() => {
        setAvatar(props.avatar)
    }, [props.avatar])

    // eslint-disable-next-line
    function RedirectToLogin() {
        try {
            localStorage.removeItem('token')
            navigate("/login", { replace: false })
            // console.log("Logged you out!")
        } catch (e) {
            console.log("Unable to logout!")
        }
    }

    function RedirectToHome() {
        navigate("/home", { replace: false })
    }

    function RedirectToAbout() {
        navigate("/about", { replace: false })
    }

    function RedirectToProfile() {
        navigate("/profile", { replace: false })
    }

    return (
        <header className="navbar">
            <button className="menu-icon" onClick={() => props.setSidebarVisibility(prevValue => !prevValue)}>&#9776;</button>
            <h1 onClick={RedirectToHome} id="title">
                <span>Paper Pad</span>
            </h1>
            <div className="dropdown">
                {(avatar && <img className="profile-image" src={avatar} alt="Profile" />) || <img className="profile-image" src="user_icon.png" alt="Profile" />}
                <div className="dropdown-content">
                    <p onClick={RedirectToProfile}>Profile</p>
                    <p onClick={RedirectToAbout}>About</p>
                    <p onClick={RedirectToLogin}>Logout <img className="logout-icon" src="logout_icon.png" alt="" /></p>
                </div>
            </div>
        </header>
    )
}