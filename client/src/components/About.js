import Header from "../components/Header"

export default function About() {
    return (
        <>
            <Header />
            <div className="about">
                <p className="about-information">
                    This notes taking application is designed to provide users with a platform to create an account and store their personal notes securely.
                    The application utilizes a combination of various technologies to achieve this functionality, including Node.js for the backend, React.js
                    for the frontend, Express.js for the server, and MongoDB for the database. The application is deployed on the Heroku platform, ensuring
                    that it is accessible to users from any device with an internet connection.
                </p>
                <p>
                    The primary feature of this application is notes management, which allows users to perform CRUD operations on their notes. Users can create
                    new notes, view existing notes, update the content of their notes, and delete notes they no longer need. This comprehensive set of operations
                    provides users with complete control over their notes, enabling them to organize and modify them as desired.
                </p>
                <p>
                    In addition to the basic notes management functionality, the application also includes several additional features to enhance the user experience.
                    One such feature is the implementation of welcome emails. When users create an account, the application automatically sends a welcome email to
                    provide a personalized touch and ensure users feel valued and engaged from the start.
                </p>
                <p>
                    To improve usability, the application incorporates result sorting, pagination, and filtering capabilities. Result sorting allows users to arrange
                    their notes based on date updated. Pagination ensures that the notes are displayed in manageable
                    chunks, reducing clutter and making it easier for users to navigate through their notes. Furthermore, filtering options enable users to search for
                    specific notes based on various parameters, such as tags, categories, or keywords.
                </p>
                <p>
                    By leveraging these features, this notes taking application aims to provide users with a seamless and efficient way to manage their notes digitally.
                    With a user-friendly interface and a range of powerful functionalities, users can focus on their productivity and creativity, knowing that their
                    notes are securely stored and easily accessible whenever they need them.
                </p>
                <h3>Created by: Jainish Adesara</h3>
                <img className="developer-portrait" src="portrait.jpg" alt="Developer" />
                <div className="handles">
                    <a href="https://www.linkedin.com/in/jainish-adesara" target="_blank" rel="noreferrer" ><img className="handle-icon" src="linkedin.png" alt="linkedin" /></a>
                    <a href="https://github.com/Jainish021?tab=repositories" target="_blank" rel="noreferrer" ><img className="handle-icon" src="github.png" alt="github" /></a>
                    <a href="mailto:adesarajainish@gmail.com" target="_blank" rel="noreferrer" ><img className="handle-icon" src="email.svg" alt="email" /></a>
                </div>
            </div>
        </>
    )
}