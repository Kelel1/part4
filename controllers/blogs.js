const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, _id: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})


blogsRouter.post('/', async (request, response, next) => {

  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

  const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id,
      likes: body.likes === undefined ? 0 : body.likes,
      
    })
  
  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({error: 'Title or url missing'})
  }

  
    
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }

})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {

  try{
    const body = request.body
    const blogToUpdate = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes:body.likes,
    }
    const blog = await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true })
    if (blog) {
      response.json(blog.toJSON())
    }
  } catch(exception) {
    next(exception)
  }
})
  

module.exports = blogsRouter