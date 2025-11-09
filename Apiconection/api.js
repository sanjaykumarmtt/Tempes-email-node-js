import dotenv from "dotenv"
import axios from "axios";
import jwt from "jsonwebtoken";

let currentJwtToken = null;

async function generate_Email() {
    dotenv.config();
    const api = process.env.API_EMAIL;

    const randomUsername = generateRandomUsername();
    const password = generateRandomPassword();
    const address = randomUsername + "@2200freefonts.com";

    const User_Add = { address, password }
    const response = await axios.post(api + "accounts", User_Add);

    const data_login = await axios.post(api + "token", User_Add);
    console.log(data_login);
    if (data_login.data.token) {
        currentJwtToken = data_login.data.token;
        console.log("New JWT Token successfully fetched.");
    } else {
        throw new Error("Failed to get JWT Token from Mail.tm");
    }
    // console.log(login)
    return User_Add;
}
async function Delete_email() {
    dotenv.config();
    const api = process.env.API_EMAIL;

    if (currentJwtToken != null) {
        const decodedToken = jwt.decode(currentJwtToken)
        const email_id = decodedToken.id;
        const response = await axios.delete(api + "accounts/" + email_id, { headers: { Authorization: `Bearer ${currentJwtToken}` }, });
        // console.log(response.status)
        return response;
        // "Temporary mail delete successful";


    } else {
        throw new Error("Intrernal server error");
    }




}
async function get_Message() {
    dotenv.config();
    const api = process.env.API_EMAIL;
    if (currentJwtToken != null) {
        console.log("sanjay")
        const response = await axios.get(api + "messages?page=1", { headers: { Authorization: `Bearer ${currentJwtToken}` }, });
        // console.log(response)
        const data_mas = response.data;
        const massage = data_mas['hydra:member'];
        console.log(massage)
        return data_mas;
    } else {
        return new Error("Intrernal server error");
    }
}
async function Removes_a_Message(id) {
    dotenv.config();
    const api = process.env.API_EMAIL;
    if (currentJwtToken != null) {
        const response = await axios.delete(api + "messages/" + id, { headers: { Authorization: `Bearer ${currentJwtToken}` }, });
        return response;
    } else {
        throw new Error("Intrernal server error");
    }
}
const getPdfStream = async (id) => {
    try {
        dotenv.config();
        const api = process.env.API_EMAIL;
        if (currentJwtToken != null) {
            const response = await axios({
                method: 'GET',
                url: api + "messages/" + id + "/download",
                responseType: 'stream',
                headers: {

                    'Authorization': `Bearer ${currentJwtToken}`,
                }
            });

            return {
                stream: response.data,
                headers: response.headers
            };
        } else {
            throw new Error("Intrernal server error");
        }

    } catch (error) {
        console.error('Service Layer Error: Could not fetch PDF from external API.', error.message);
        throw new Error('Failed to fetch PDF data.');
    }
};

function generateRandomUsername() {
    return Math.random().toString(36).substring(2, 12);
}


function generateRandomPassword(length = 12) {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
}
async function getJwtToken() {
    if (!currentJwtToken) {
        await Api_Cration();
        return currentJwtToken;
    }
    console.log(currentJwtToken)
    return currentJwtToken;
}


export { generate_Email, getJwtToken, Delete_email, get_Message, Removes_a_Message ,getPdfStream}