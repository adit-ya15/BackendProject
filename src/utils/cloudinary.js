import { v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        //upload the file to cloudinary
        const respose = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded successfullly
        // console.log("file is uploaded on cloudinary",
        //     respose.url);
        fs.unlinkSync(localFilePath) //remove the file from local uploads folder
            return respose;
    } catch (error) {
        // remove local temp file if upload failed (ignore errors)
        try { fs.unlinkSync(localFilePath); } catch (e) { /* ignore */ }
        console.error("Cloudinary upload failed:", error);
        return null;
    }
}



export {uploadOnCloudinary}

