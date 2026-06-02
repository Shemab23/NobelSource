import { authDocs } from "./auth.js";
import { entityDocs } from "./entity.js";
import { logisticsDocs } from "./logistics.js";
import { messageDocs } from "./message.js";
import { postDocs } from "./post.js";
import { roomDocs } from "./room.js";
import { roomMemberDocs } from "./room_member.js";
import { userDocs } from "./user.js";
import { itemsDocs } from "./items.js";
import { auditDocs } from "./audit.js";
import { disputesDocs } from "./dispute.js";

const health = [{
  name: "GET /health",
  description: "Health check.",
  request: null,
  response: {
    "msg":"success",
    "status":"active"
  },
  done: true
}];

const api = [ {
  name: "GET /api",
  description: "API root.",
  request: null,
  response: {
    "status":"ok",
    "message":"Welcome to the Nobelsource API"
  },
  done: true
}]

export const docs = {
  project: "Nobel Source Hub",
  groups: {
    api,
    health,
    auth: authDocs,
    users: userDocs,
    entities: entityDocs,
    messages: messageDocs,
    rooms: roomDocs,
    roomMembers: roomMemberDocs,
    logistics: logisticsDocs,
    posts: postDocs,
    items: itemsDocs,
    audit: auditDocs,
    disputes: disputesDocs
  }
};
