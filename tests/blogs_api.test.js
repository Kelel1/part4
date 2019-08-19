const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

// Initialize database before tests
beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObject = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObject.map(blog => blog.save())
    await Promise.all(promiseArray)

})
// Test that request to api responds with status code 200
test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

// Test that uniq blog identifiers are named id
test('unique blog identifiers are named id', async () => {
    const newBlog = {
        title: 'Test id name parameter',
        author: 'Lawrence Elder',
        url: 'www.id.com',
        likes: 200
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        

    const blogsAtEnd = await helper.blogsInDb()
    const blogID = blogsAtEnd.pop()
    expect(blogID.id).toBeDefined()

})

// Test that HTTP POST request can be made to /api/blogs
test('a new blog can be added', async () => {
    const newBlog = {
        title: 'Testing post request to Database',
        author: 'Albert Elder',
        url: 'www.testBlogs.com',
        likes: 99,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)
        .expect('Content-type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
}) 

// Test that to verify if likes is missing or not
test('if note without likes is not added, will default to 0', async () => {
    const newBlog = {
        title: 'Testing adding blogs without likes',
        author: 'Morgan Elder',
        url: 'www.nolikes.com',
    }    

    await api
        .post('/api/blogs')
        .send(newBlog)
        
    const blogsAtEnd = await helper.blogsInDb()
    const blogLikes = blogsAtEnd.pop()
    expect(blogLikes.likes).toBe(0)
})

// Test to show missing title/url properties show status code 400
test('that a blog without title and url return status code 400', async () => {
    const newBlog = {
        author: 'Albert Elder',
        url: 'www.code400.com' 
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

// Test the delete function
test('a blog can be deleted', async () => {

    const newBlog = {
        title: 'Testing post request to Database',
        author: 'Albert Elder',
        url: 'www.testBlogs.com',
        likes: 99,
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const blogz = blogsAtEnd[1]

    await api
        .delete(`/api/blogs/${blogz.id}`)
        .expect(204)
    
    const blogsAtEnd1 = await helper.blogsInDb()
    
    expect(blogsAtEnd1.length).toBe(
        helper.initialBlogs.length
    )
    const urls = blogsAtEnd1.map(b => b.url)

    expect(urls).not.toContain(blogz.url)
})

test('a specific blog can be updated', async () => {

    const newBlog = {
        title: 'Testing put request to Database',
        author: 'Remy Elder',
        url: 'www.updateBlogs.com',
        likes: 999,
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(200)

    const blogAtStart = await helper.blogsInDb()
  
    const blogToUpdate = blogAtStart[blogAtStart.length - 1]
    console.log(blogToUpdate)

    const updateFirst = {
        title: 'Testing put request to Database',
        author: 'Remy Elder',
        url: 'www.updateBlogsworks.com',
        likes: 777,
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updateFirst)
      .expect(200)
})
afterAll(() => {
    mongoose.connection.close()
})