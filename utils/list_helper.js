_ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')


// Initial test blog entires
const initialBlogs = [
    {
        title: 'Web-Dev 2019',
        author: 'Kern Elder',
        url: 'www.web-devk.com',
        likes: 33
    },
    {
        title: 'React 2019',
        author: 'Lawrence Elder',
        url: 'www.react-k.com',
        likes: 153
    },
]


// Initial test user entires

const initialUsers = [
    {
        username: 'Kell',
        name: 'Kern',        
    },
    {
        username: 'Kd',
        name: 'Kadija',
    }
]
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const likes = blogs.map(blog => blog.likes)
    const total = (sum, blog) => {
        return sum + blog
    }
    
    return blogs.length === 0
        ? 0
        : likes.reduce(total)
}

const favoriteBlog = (blogs) => {

    if (blogs.length === 0) {
        return 'Void: Blog-list is empty!'
    } else {
        // sort by max likes
        const sortBlogs = blogs.sort(function(a,b){return a.likes - b.likes})
        const title = sortBlogs[sortBlogs.length - 1].title
        const author = sortBlogs[sortBlogs.length - 1].author
        const likes = sortBlogs[sortBlogs.length - 1].likes

        return {'author': author, 'likes': likes, 'title': title}

    }

}

const mostBlogs = (blogs) => {

    const authors = blogs.map(a => a.author)
    const count = _.countBy(authors, function(val){return val})
    const maxAuthorCount = Math.max(...Object.values(count))
    const maxAuthor = Object.keys(count).find(key => count[key] === maxAuthorCount)
    const result = { author: maxAuthor,blogs: maxAuthorCount}

    return result
}

const mostLikes = (blogs) => {
    const totalLikes = 0

    const authors = _.uniq(_.map(blogs, 'author'))
    const a = _.groupBy(blogs, 'author')

    
    return a['Edsger W. Dijkstra']
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}
module.exports = {
    blogsInDb,
    usersInDb,
    dummy,
    initialBlogs,
    initialUsers,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes

}