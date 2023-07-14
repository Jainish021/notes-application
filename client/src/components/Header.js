import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Header() {
    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState("")
    const source = `data:image/jpeg;base64, ${userDetails.avatar}`
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userData = await axios.get("/users/me").then(res => res.data)
                setUserDetails(userData)
            } catch (e) {
                RedirectToLogin()
            }
        }
        localStorage.getItem('token') && fetchUserDetails()
    }, [RedirectToLogin])

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
            <h1 onClick={RedirectToHome} id="title">
                <span>Paper Pad</span>
            </h1>
            <div className="dropdown">
                {(userDetails.avatar && <img className="profile--image" src={source} alt="Profile" />) || <img className="profile--image" src="user_icon.png" alt="Profile" />}
                <div className="dropdown-content">
                    <p onClick={RedirectToProfile}>Profile</p>
                    <p onClick={RedirectToAbout}>About</p>
                    <p onClick={RedirectToLogin}>Logout <img className="logout-icon" src="logout_icon.png" alt="" /></p>
                </div>
            </div>
        </header>
    )
}