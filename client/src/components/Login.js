import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../css/style.css"

export default function Login() {
    const navigate = useNavigate()
    const [credentials, setCredentials] = React.useState({
        email: "",
        password: ""
    })
    const [errorText, setErrorText] = React.useState("")

    useEffect(() => {
        const FetchUser = async () => {
            const user = await fetch("/users/me", {
                "method": "GET",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("token")
                }
            }).then(response => response.json())
            const navigate = useNavigate()
            if (!user.error) {
                navigate("/home", { replace: true })
            }
        }
        FetchUser()
    }, [])

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
            const userDetails = await fetch("/users/login", {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                },
                "body": JSON.stringify(credentials)
            }).then(response => response.json())
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