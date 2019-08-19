const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({error: 'Title or url missing'})
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
  })
  try {
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
    next(exception)
  }

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
      const blog = await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, {new: true})
      if (blog) {
        response.json(blog.toJSON())
      }
    } catch(exception) {
      next(exception)
    }
  })
  
})

module.exports = blogsRouter