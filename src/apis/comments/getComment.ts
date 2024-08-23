import { PrismaClient } from "@prisma/client"
import { NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function getCommentsByPostIdx(
    res: NextApiResponse,
    postIdx: number
) {
    try {
        const comments = await prisma.comment.findMany({
            where: {
                postIdx: postIdx,
            },
        })
        res.status(200).json(comments)
    } catch (error) {
        console.error("Error fetching comments:", error)
        res.status(500).json({ message: "Error fetching posts" })
    }
}

export async function getCommentByIdx( idx: number) {
    return prisma.comment.findUnique({
        where: { idx: idx },
    })
}
