import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.NOTION_SECRET;
const DATABASE_ID = process.env.NODEMAIL_DATABASE;

export const getBlogPosts = async (req, res) => {
    try {
       
        const metadataRes = await fetch(
            `https://api.notion.com/v1/databases/${DATABASE_ID}`, 
            {
                method: 'GET', 
                headers: {
                    "Notion-Version": "2022-06-28",
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const databaseMetadata = await metadataRes.json();
        
        let coverImageUrl = null;
        if (databaseMetadata.cover) {
            coverImageUrl = databaseMetadata.cover.type === 'external' 
                ? databaseMetadata.cover.external.url 
                : databaseMetadata.cover.file.url;
        }

     
        const fetchRes = await fetch(
            `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
            {
                method: 'POST',
                headers: {
                    "Notion-Version": "2022-06-28",
                    Authorization: `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({}) 
            },
        );

        const data = await fetchRes.json();

        if (data.status === 'error' || data.object === 'error') {
            return res.status(data.status || 500).json({
                status: 'error',
                message: data.message || "Notion API- is get issuies",
            });
        }

        
        res.status(200).json({
            status: 'success',
            count: data.results.length,
            posts: data.results,
            cover_image_url: coverImageUrl, 
        });

    } catch (error) {
        console.error("Notion API Error:", error.message);
        res.status(500).json({
            status: 'error',
            message: "Notion API-Not get data",
        });
    }
};