import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

const configObject = {
    MONGO_URL: process.env.MONGO_URL,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    BASE_URL: process.env.BASE_URL,
    
}

export default configObject;




