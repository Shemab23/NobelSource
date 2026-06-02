import type { Login, LoginResponse, Register, RegisterResponse } from "./types/auth";
import type { AssignDisputePayload, CreateDisputePayload, JudgementPayload, RateDisputePayload } from "./types/dispute";
import type { CreateEntityPayload } from "./types/entity";
import type { CreateItemPayload, UpdateItemAmountPayload } from "./types/item";
import type { CreateLogisticsPayload, PaymentConfirmPayload, UpdateLogisticsStatusPayload } from "./types/logistic";
import type { CreateMessagePayload, RespondMessagePayload } from "./types/message";
import type { PatchPostPayload } from "./types/post";
import type { CreateRoomPayload, PatchRoomPayload } from "./types/room";
import type { RemoveMemberPayload } from "./types/room_member";
import type { PatchUserProfilePayload, UpdateUserRolePayload } from "./types/user";

export type BodyProp = Login | Register | LoginResponse| RegisterResponse | FormData | CreateDisputePayload| AssignDisputePayload | JudgementPayload | RateDisputePayload
|CreateEntityPayload|CreateItemPayload|UpdateItemAmountPayload |CreateLogisticsPayload |UpdateLogisticsStatusPayload|PaymentConfirmPayload|PatchPostPayload|RemoveMemberPayload|CreateRoomPayload|PatchRoomPayload|PatchUserProfilePayload|UpdateUserRolePayload|CreateMessagePayload|RespondMessagePayload;


export type Method = "GET" | "POST" | "PUT" | "DELETE"| "PATCH";

export const FetchTemplate = async <T>(endpoint: string, method: Method = "GET", body?: BodyProp): Promise<T> => {
    const isFormData = body instanceof FormData;
    const Headers: HeadersInit = {};

    if (body && !isFormData) Headers['content-type'] = 'application/json';

    try {
        const response = await fetch(
            endpoint,
            {
                method,
                credentials: "include",
                body: isFormData ? body : JSON.stringify(body),
                headers: Headers
              }
        );

        if (!response.ok) {
            const err = await response.json();
            console.error("BACKEND ERROR:", err);
            throw new Error(err.msg || err.message || "Request failed with status " + response.status);
        } else {
            return response.json();
        }
    } catch(err) {
        console.error("Fetch Template Exception:", err);
        throw err instanceof Error ? err : new Error("An unexpected server connection error occurred");
    }
}

