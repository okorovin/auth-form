
export interface LoginPayload {
    email: string,
    password: string
}

export interface LoginResponse { success : boolean, userId: string }

export interface LoginError extends Error {
    status: number
    message: string
}


export interface VerifyCodePayload {
    code: string,
    userId: string
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const { email, password } = payload;
            if (email === "blocked@example.com") reject({ status: 403, message: "User is blocked" });
            else if (email === "server@example.com") reject({ status: 500, message: "Server error" });
            else if (email === "network@example.com") reject({ status: 0, message: "Network error" });
            else if (password !== "123456") reject({ status: 401, message: "Wrong password or email" });
            else resolve({ success: true, userId: "user-1" });
        }, 1000);
    });
}

export async function verifyCodeApi(payload: VerifyCodePayload): Promise<{ success: boolean }> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (payload.code !== "123456") reject({ status: 400, message: "invalid code" });
            else resolve({ success: true });
        }, 1000);
    });
}
