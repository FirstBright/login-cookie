import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"

const prisma = new PrismaClient()

export async function getAllPosts(req: NextApiRequest, res: NextApiResponse) {
    try {
        const posts = await prisma.post.findMany({
            include: {
                Comment: true,
            },
        })

        res.status(200).json(posts)
    } catch (error) {
        console.error("Error fetching posts:", error)
        res.status(500).json({ message: "Error fetching posts" })
    }
}

export const getPostByIdx = async (idx: number) => {
    return prisma.comment.findUnique({
        where: { idx: idx },
    })
}
