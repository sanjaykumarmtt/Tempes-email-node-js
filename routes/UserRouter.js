import express from "express"
import { Generate_Email,jwt_token ,delete_Email,get_new_Message,Removes_Message,downloadPdfController} from "../Controller/UserController.js"
import { getBlogPosts } from "../Notion/database_ Notion.js";

const route=express.Router();

route.get("/generate-email",Generate_Email);
route.get("/get-token",jwt_token);
route.delete("/delete-email",delete_Email);
route.get("/get_new_Message",get_new_Message);
route.delete("/removes_message/:id",Removes_Message);
route.get("/downloadPdfController/:id",downloadPdfController);
route.get("/blog-posts",getBlogPosts);

export default route;
 