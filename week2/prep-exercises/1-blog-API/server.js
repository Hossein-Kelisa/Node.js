const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Ensure the 'blogs' directory exists
const blogDirectory = path.join(__dirname, 'blogs');
if (!fs.existsSync(blogDirectory)) {
  fs.mkdirSync(blogDirectory);
}

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Blog API');
});

// Route to get all blogs
app.get('/blogs', (req, res) => {
  const files = fs.readdirSync(blogDirectory);
  const blogs = files.map((file) => ({
    title: file.replace('.txt', '') // Remove .txt extension from the title
  }));

  res.send(blogs);
});

// Route to get a specific blog post
app.get('/blogs/:title', (req, res) => {
  const title = req.params.title;
  const filePath = path.join(blogDirectory, `${title}.txt`);

  if (fs.existsSync(filePath)) {
    const post = fs.readFileSync(filePath, { encoding: 'utf8' });
    res.send(post);
  } else {
    res.status(404).send('This post does not exist!');
  }
});

// Route to create a new blog post
app.post('/blogs', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send('Title and content are required');
  }

  const filePath = path.join(blogDirectory, `${title}.txt`);
  
  fs.writeFileSync(filePath, content);
  res.send('Post created successfully');
});

// Route to update an existing blog post
app.put('/blogs/:title', (req, res) => {
  const { title } = req.params;
  const { content } = req.body;
  const filePath = path.join(blogDirectory, `${title}.txt`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('This post does not exist!');
  }

  if (!content) {
    return res.status(400).send('Content is required');
  }

  fs.writeFileSync(filePath, content);
  res.send('Post updated successfully');
});

// Route to delete a blog post
app.delete('/blogs/:title', (req, res) => {
  const { title } = req.params;
  const filePath = path.join(blogDirectory, `${title}.txt`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('This post does not exist!');
  }

  fs.unlinkSync(filePath);
  res.send('Post deleted successfully');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
