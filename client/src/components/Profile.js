import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"

export default function Profile() {
    const navigate = useNavigate()
    const [userDetails, setUserDetails] = useState("")
    const [avatar, setAvatar] = useState("")
    const [uploadBtnName, setUploadBtnName] = useState("Upload")
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = token

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


    async function HandleFileUpload(file) {
        if (file) {
            console.log(file)
            const formData = new FormData()
            formData.append('avatar', file)
            try {
                const resData = await axios.post("/users/me/avatar", formData, {
                    headers: {
                        "Content-Type": 'multipart/form-data'
                    }
                }).then(res => res.data)
                setAvatar(`data:image/png;base64, ${resData.avatar}`)
            } catch (e) {
                // console.log("File upload failed.")
            }
        }
    }

    async function DeleteProfilePicture() {
        try {
            axios.delete("users/me/avatar")
            setAvatar("")
            // console.log("Profile picture deleted successfully!")
        } catch (e) {
            // console.log("Failed to delete profile picture.")
        }
    }

    async function LogOutAll() {
        try {
            axios.post("/users/logoutAll")
            localStorage.removeItem('token')
            RedirectToLogin()
        } catch (e) {
            console.log("Failed to log out from all devices!")
        }
    }

    function toggleDeleteConfirmation() {
        setDeleteConfirmation(prevValue => !prevValue)
    }

    async function DeleteAccountRequest() {
        try {
            const resData = axios.delete("/users/me").then(res => res.data)
            setUserDetails(resData)
            localStorage.removeItem('token')
            RedirectToLogin()
        } catch (e) {
            console.log("Failed to delete account!")
        }
    }

    return (
        <>
            <Header
                avatar={avatar} />
            <div className="profile-section">
                <fieldset>
                    <legend className="profile-user-info-label">Profile picture:</legend>
                    {(avatar && <img className="profile-section-user-image" src={avatar} alt="Profile" />) || <img className="profile-section-user-image" src="user_icon.png" alt="Profile" />}
                    <div className="profile-section-buttons">
                        <label className="button upload-button"><img className="upload-icon" src="upload.png" alt="" />{uploadBtnName}<input type="file" name="file" accept=".png, .jpg, .jpeg" onChange={(event) => HandleFileUpload(event.target.files[0])} /></label>
                        {avatar && <label className="button delete-button" onClick={DeleteProfilePicture}><i className="gg-trash trash-icon"></i> Delete</label>}
                    </div>
                </fieldset>
            </div >
            <div className="profile-section">
                <fieldset>
                    <legend className="profile-user-info-label">User information:</legend>
                    <div className="profile-user-info-label">
                        <label>Username:</label>
                        <label>Email:</label>
                        <label>Age:</label>
                        <label>Joined on:</label>
                    </div>
                    {userDetails &&
                        <div className="profile-user-info">
                            <label>{userDetails.name}</label>
                            <label>{userDetails.email}</label>
                            <label>{userDetails.age}</label>
                            <label>{userDetails.createdAt.split("T")[0]}</label>
                        </div>
                    }
                </fieldset>
            </div>
            <div className="profile-section">
                <fieldset>
                    <legend className="profile-user-info-label">Account settings:</legend>
                    <div className="profile-user-info-label">
                        <label>Logout from all devices:</label><br />
                        <label>Delete account:</label>
                    </div>
                    <div className="profile-user-info profile-account-settings">
                        <label className="button logout-all-button" onClick={LogOutAll}>Log out all<img className="logout-all-icon" src="logout_icon.png" alt="" /></label>
                        <label className="button delete-button" onClick={toggleDeleteConfirmation}><i className="gg-trash trash-icon"></i> Delete</label>
                        {deleteConfirmation && <div className="delete-confirmation-section">
                            <p className="delete-confirmation-message">Are you sure?</p>
                            <div className="delete-confirmation">
                                <label className="button logout-all-button delete-confirmation-button" onClick={DeleteAccountRequest}>Yes</label>
                                <label className="button logout-all-button delete-confirmation-button" onClick={toggleDeleteConfirmation}>No</label>
                            </div>
                        </div>}
                    </div>
                </fieldset>
            </div>
        </>
    )
}