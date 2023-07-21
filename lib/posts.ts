import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { cache } from 'react'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'blogposts')

export const getSortedPostsData = cache(()=> {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map((fileName)=> {
        const id = fileName.replace(/\.md$/, '')

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf-8')

        const matterResult = matter(fileContents)
            
        const blogPost: BlogPost = {
            id,
            title: matterResult.data.title,
            date: matterResult.data.date
        }

        return blogPost
    })

    return allPostsData.sort((a, b)=> a.date < b.date ? 1 : -1)
})

export const getPostData = async (id: string)=> {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf-8')

    const matterResult = matter(fileContents)

    const processedContent = await remark().use(html).process(matterResult.content)

    const contentHtml = processedContent.toString()

    const blogPostWithHTML: BlogPost & { contentHtml: string } = {
        id,
        title: matterResult.data.title,
        date: matterResult.data.date,
        contentHtml
    }

    return blogPostWithHTML
}