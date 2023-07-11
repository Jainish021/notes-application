import { useNavigate } from "react-router-dom"

export default function Header(props) {
    const navigate = useNavigate()
    const source = `data:image/jpeg;base64, ${props.userDetails.avatar}`

    function RedirectHome() {
        navigate("/home", { replace: true })
    }

    return (
        <header className="navbar">
            <h1 onClick={RedirectHome} id="title">
                <span>Paper Pad</span>
            </h1>
            <ul className="nav-options">
                <li className="nav-item">About</li>
                <li className="nav-item">Profile</li>
                {props.userDetails.avatar && <img className="profile--image" src={source} />}
            </ul>
        </header>
    )
}