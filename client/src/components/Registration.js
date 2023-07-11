import React from "react"
import { useNavigate } from "react-router-dom"
import "../css/style.css"

export default function Registration() {
    const navigate = useNavigate()
    const [credentials, setCredentials] = React.useState({
        name: "",
        email: "",
        password: "",
        age: ""
    })
    const [errorText, setErrorText] = React.useState("")

    function HandleChange(event) {
        const { name, value } = event.target
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value.trim(" ")
        }))
    }

    async function RegistrationRequest(event) {
        event.preventDefault()

        try {
            const userDetails = await fetch("/users", {
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                },
                "body": JSON.stringify(credentials)
            }).then(response => response.json())
            localStorage.setItem("token", userDetails.token)
            console.log(userDetails)
            if (userDetails.error) {
                throw new Error()
            }
            setErrorText("")
            navigate("/home", { replace: true })
        } catch (e) {
            setErrorText("User already exists! Try logging in.")
        }

    }

    function UserLogin() {
        navigate("/login", { replace: true })
    }

    return (
        <div>
            <h1 className="lr--heading">Paper Pad</h1>
            <form className="lr--form registration--form" onSubmit={RegistrationRequest}>
                <h4>Welcome to Paper Pad!</h4>
                <h2>Register your account</h2>
                <label>Username</label>
                <input
                    className="lr--text--input"
                    name="name"
                    value={credentials.name}
                    type="text"
                    placeholder="Enter username"
                    autoComplete="username"
                    required
                    onChange={HandleChange}></input>
                <label>Email</label>
                <input
                    className="lr--text--input"
                    name="email"
                    value={credentials.email}
                    type="email"
                    placeholder="Enter email"
                    autoComplete="email"
                    required
                    onChange={HandleChange}></input>
                <label>Password</label>
                <input
                    className="lr--text--input"
                    name="password"
                    value={credentials.password}
                    type="password"
                    placeholder="Enter password"
                    minLength="7"
                    maxLength="20"
                    required
                    onChange={HandleChange}></input>
                <label>Age</label>
                <input
                    className="lr--text--input"
                    name="age"
                    value={credentials.age}
                    type="number"
                    min="0"
                    placeholder="Enter age"
                    required
                    onChange={HandleChange}></input>
                <label className="lr--error">{errorText}</label>
                <input type="submit" className="lr--submit" value="Register"></input>
                <hr></hr>
                <button className="register" onClick={UserLogin}>Login</button>
            </form>
        </div>
    )
}