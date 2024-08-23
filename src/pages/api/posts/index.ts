import { NextApiRequest, NextApiResponse } from "next"
import { verify } from "jsonwebtoken"
import { getAllPosts } from "@/apis/posts/getPost"
import { parseCookies } from "nookies"
import { createPost } from "@/apis/posts/createPost"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const cookies = parseCookies({ req })
        const token = cookies["token"]

        if (!token) {
            return res
                .status(401)
                .json({ message: "토큰이 제공되지 않았습니다." })
        }

        const decoded = verify(token, process.env.JWT_SECRET as string) as any
        const userIdx = decoded.idx

        if (req.method === "GET") {
            await getAllPosts(req, res)
        }else if ( req.method === "POST"){
            await createPost(req, res, userIdx)
        }
        else {
            res.status(400).json({
                message: "지원하지 않는 메서드입니다.",
            })
        }
    } catch (error) {
        console.error("API 처리 중 오류 발생:", error)
        res.status(500).json({
            message: "서버 오류가 발생했습니다.",
        })
    }
}

export default handler
