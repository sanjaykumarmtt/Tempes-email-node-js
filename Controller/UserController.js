import { generate_Email, getJwtToken, Delete_email, get_Message, Removes_a_Message, getPdfStream } from "../Apiconection/api.js";

async function Generate_Email(req, res) {
    try {
        const dumyemail = await generate_Email();
        if (dumyemail == null) {
            return res.status(400).json({ error: "Not Generate Email" })
        }
        res.status(200).json(dumyemail);
    } catch (error) {
        res.status(500).json({ error: "Intrernal server error." + error })
    }
}
async function delete_Email(req, res) {
    try {
        await Delete_email();
        res.status(200).json({ massage: "Temporary mail delete successful" });
    } catch (error) {
        res.status(500).json({ error: "Intrernal server error." + error })
    }
}
async function jwt_token(req, res) {
    try {

        const token = await getJwtToken();
        if (token.isEmtey) {
            return res.status(400).json({ error: "token is Emtey" })
        }
        console.log(token + "  sanjay")
        res.status(200).json(token);
    } catch (error) {
        res.status(500).json({ error: "Intrernal server error." + error })
    }
}
async function get_new_Message(req, res) {
    try {

        const Message = await get_Message();
        if (Message == null) {
            return res.status(400).json({ error: "Message is Emtey" })
        }
        res.status(200).json(Message);
    } catch (error) {
        res.status(500).json({ error: "Intrernal server error." + error })
    }
}
async function Removes_Message(req, res) {
    const id = req.params.id;
    await Removes_a_Message(id);
    res.status(200).json({ massage: "Message delete successful" });

}
const downloadPdfController = async (req, res) => {

    try {
        const id = req.params.id;
        console.log(id);
        const { stream, headers } = await getPdfStream(id);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', headers['content-disposition'] || 'attachment; filename="downloaded_file.pdf"');

        if (headers['content-length']) {
            res.setHeader('Content-Length', headers['content-length']);
        }

        stream.pipe(res);

        stream.on('error', (pipeError) => {
            console.error('Piping Error:', pipeError);
            if (!res.headersSent) {
                res.status(500).send({ message: 'Error during file transfer.' });
            }
        });

    } catch (error) {
        console.error('Controller Error:', error.message);
        if (!res.headersSent) {
            res.status(500).send({ message: 'Internal Server Error: Could not process PDF download.' });
        }
    }
};



export { Generate_Email, jwt_token, delete_Email, get_new_Message, Removes_Message, downloadPdfController }