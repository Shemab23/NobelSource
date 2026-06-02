import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
});

export class CloudinaryService {

  static uploadBuffer(
    buffer: Buffer,
    folder: string
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `platform/${folder}`, timeout: 180000 },
        (error, result) => {
          if (error || !result) return reject(error);

          resolve({
            url: result.secure_url,
            publicId: result.public_id
          });
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }

  static async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return { msg: "success", ans: result };
    } catch (e: any) {
      return { msg: e.message, ans: null };
    }
  }

  static extractPublicId(url: string): string | null {
    try {
      const parts = url.split("/");
      const file = parts.pop();
      if (!file) return null;

      const [name] = file.split(".");
      if(!name) return null;

      const folderIndex = parts.indexOf("platform");

      if (folderIndex === -1) return name;

      const folder = parts.slice(folderIndex).join("/");
      return `${folder}/${name}`;
    } catch {
      return null;
    }
  }
}
