import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../css/style.css"
import axios from "axios"

export default function Login() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")
    const navigate = useNavigate()
    const [credentials, setCredentials] = React.useState({
        email: "",
        password: ""
    })
    const [errorText, setErrorText] = React.useState("")

    useEffect(() => {
        function RedirectToHome() {
            navigate("/home", { replace: true })
        }

        const fetchUser = async () => {
            try {
                await axios.get("/users/me")
                RedirectToHome()
            } catch (e) {

            }
        }
        localStorage.getItem('token') && fetchUser()
    }, [navigate])

    function handleChange(event) {
        const { name, value } = event.target
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }))
    }

    async function LoginRequest(event) {
        event.preventDefault()
        try {
            const userDetails = await axios.post("/users/login", credentials).then(res => res.data)
            localStorage.setItem("token", userDetails.token)
            setErrorText("")
            navigate("/home", { replace: true })
        } catch (e) {
            setErrorText("Unable to login. Enter correct Email/Password.")
        }
    }

    function UserRegistration() {
        navigate("/registration", { replace: true })
    }

    return (
        <div>
            <h1 className="lr--heading">Paper Pad</h1>
            <form className="lr--form login--form" onSubmit={LoginRequest}>
                <h4>Welcome back!</h4>
                <h2>Login to your account</h2>
                <label>Email</label>
                <input
                    className="lr--text--input"
                    name="email"
                    value={credentials.email}
                    type="email"
                    placeholder="Enter email"
                    autoComplete="email"
                    required
                    onChange={handleChange} />
                <label>Password</label>
                <input
                    className="lr--text--input"
                    name="password"
                    value={credentials.password}
                    type="password"
                    placeholder="Enter password"
                    onChange={handleChange}
                    required />
                <label className="lr--error">{errorText}</label>
                <input type="submit" value="Login" className="lr--submit" />
                <hr></hr>
                <button className="register" onClick={UserRegistration}>New user? <b>Register Now</b></button>
            </form>
        </div>
    )
}