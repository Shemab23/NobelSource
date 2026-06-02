import { type Request, type Response } from "express";
import { PostService } from "../services/post";
import { type AuthRequest } from "../types/request";
import { EntityService } from "../services/entities";
import { CloudinaryService } from "../services/cloudnary";
import type { Post, PostContent } from "../dataBase/schema";

const postService = new PostService();

export class PostController {

  static async createPost(req: Request, res: Response) {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.userContext) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    // 1. Extract all payload fields from form-data text parameters
    const {
      title,
      body,
      description,
      unit,
      type,
      price_cents,
      currency,
      location,
      tags,
      category,
      status
    } = req.body;

    // Validate absolute baseline required structural parameters
    if (!title || !body || !unit || !type || !price_cents || !location || !category) {
      return res.status(400).json({ msg: "Missing required fields inside post content", ans: null });
    }

    // Explicitly parse incoming numeric string properties safely
    const parsedPrice = Number(price_cents);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ msg: "price_cents must be a valid positive number", ans: null });
    }

    // 2. Process tag parsing array adjustments safely
    let parsedTags: string[] = [];
    if (tags) {
      try {
        // Supports handling either a pure stringified JSON array '["a","b"]' or plain comma-split tokens 'a,b'
        parsedTags = tags.startsWith("[") ? JSON.parse(tags) : tags.split(",").map((t: string) => t.trim());
      } catch {
        parsedTags = [tags];
      }
    }

    // 3. Handle multiple file streams through the array buffer pipeline
    const filesDict = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const mediaFiles = filesDict?.media || [];

    let uploadedUrls: string[] = [];
    if (mediaFiles.length > 0) {
      uploadedUrls = await Promise.all(
        mediaFiles.map(async (file) => {
          const uploadedItem = await CloudinaryService.uploadBuffer(file.buffer, "posts/media");
          return uploadedItem.url;
        })
      );
    }

    // 4. Construct type-compliant payload matching PostContent specification interface
    const contentPayload: PostContent = {
      title: title.trim(),
      body: body.trim(),
      description: description ? description.trim() : undefined,
      media: uploadedUrls.length > 0 ? uploadedUrls : undefined,
      unit: unit as PostContent["unit"],
      type: type as PostContent["type"],
      price_cents: parsedPrice,
      currency: (currency || "USD") as PostContent["currency"],
      location: location.trim(),
      tags: parsedTags.length > 0 ? parsedTags : undefined,
      category: category.trim()
    };

    // 5. Invoke transaction service block execution pipeline
    const result = await postService.createPost(
      contentPayload,
      authReq.userContext.entity_id,
      status ?? "active"
    );

    if (!result.ans) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}



  static async getPostById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Missing post id", ans: null });
    }

    const result = await postService.getPostById(id  as string);

    if (!result.ans) {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}


  static async updatePost(req: AuthRequest, res: Response) {
  try {
    if (!req.userContext) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    const { id } = req.params;

    const patch =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const result = await postService.updatePost(id  as string, patch);

    if (!result.ans) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}

static async archivePost(req: AuthRequest, res: Response) {
  try {
    if (!req.userContext) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    const { id } = req.params;

    const result = await postService.archivePost(id  as string);

    if (!result.ans) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}

  static async softDeletePost(req: AuthRequest, res: Response) {
  try {
    if (!req.userContext) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    const { id } = req.params;

    const result = await postService.softDeletePost(id  as string);

    if (!result.ans) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}

static async deletePost(req: AuthRequest, res: Response) {
  try {
    if (!req.userContext) {
      return res.status(401).json({ msg: "Unauthorized", ans: null });
    }

    const { id } = req.params;

    const result = await postService.deletePost(id as string);

    if (!result.ans) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: null });
  }
}


  static async searchPosts(req: Request, res: Response) {
  try {
    const query = req.query.q as string;
    const limit = Number(req.query.limit);

    if (!query) {
      return res.status(400).json({ msg: "Missing search query", ans: [] });
    }

    const result = await postService.searchPosts(query, limit);

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: [] });
  }
}
static async listActivePosts(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit);

    const result = await postService.listActivePosts(limit);

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: [] });
  }
}

  static async getGlobalFeed(req: Request, res: Response) {
  try {
    let limit = Number(req.query.limit);
    let offset = Number(req.query.offset);

    if (!Number.isFinite(limit) || limit <= 0) limit = 10;
    if (!Number.isFinite(offset) || offset < 0) offset = 0;

    const result = await postService.getGlobalFeed(limit, offset);

    return res.status(200).json(result);
  } catch (e: any) {
    return res.status(500).json({ msg: e.message, ans: [] });
  }
}
}
