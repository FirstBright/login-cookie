import { PrismaClient } from "@prisma/client"
import { compare } from "bcrypt"
import { NextApiRequest, NextApiResponse } from "next"
import { sign } from "jsonwebtoken"
import { setCookie } from "nookies"

const prisma = new PrismaClient()

const loginUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { nickname, password } = req.body

    // Step 1: Validate Input
    if (!nickname || !password) {
        return res
            .status(400)
            .json({ message: "닉네임, 비밀번호이 필요합니다." })
    }

    // Step 2: Fetch User by Nickname
    const user = await prisma.user.findUnique({
        where: {
            nickname,
        },
    })

    if (user === null) {
        return res
            .status(400)
            .json({ message: "닉네임에 해당하는 유저가 없습니다." })
    }

    // Step 3: Compare Password
    const hashedPassword = user.password
    const isCollect = await compare(password, hashedPassword)
    if (!isCollect) {
        return res
            .status(400)
            .json({ message: "비밀번호가 일치하지 않습니다." })
    }

    // Step 4: Create JWT Payload
    const payload = {
        nickname: user.nickname,
        idx: user.idx,
        createAt: user.createdAt,
        updateAt: user.updatedAt,
    }

    // Step 5: Sign JWT
    const token = await sign(payload, process.env.JWT_SECRET , {
        expiresIn: "1h",
    })

    // Step 6: Set Cookie with JWT
    setCookie({ res }, "token", token, {
        maxAge: 60 * 60, // 1 hour
        path: "/", // Cookie path
        httpOnly: true, // Cannot be accessed by JavaScript
        secure: false, // Only sent over HTTPS
    })

    // Step 7: Respond with Success
    res.status(200).json({ status: "success" })
}

export default loginUser
