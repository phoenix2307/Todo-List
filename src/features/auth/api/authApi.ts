import {LoginInputs} from "@/features/auth/lib/schemas";
import {instance} from "@/common/instance";
import {BaseResponse} from "@/common/types";

export const authApi = {
    login(payload: LoginInputs) {
        return instance.post<BaseResponse<{ userId: number; token: string }>>('/auth/login', payload)
    }
}