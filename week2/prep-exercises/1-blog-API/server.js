const express = require('express');
const fs = require('fs');
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());

// 1. Create a new blog post (POST /blogs)
app.post('/blogs', (req, res) => {
    const { title, content } = req.body;  // Extract title and content from the request body
    
    // Check if both title and content are provided
    if (title && content) {
        // Write content to a file with the title as the filename
        fs.writeFileSync(`${title}.txt`, content);
        res.send('Blog post created');  // Respond with success message
    } else {
        res.status(400).send('Title and content are required');  // Error response if missing data
    }
});

// 2. Update an existing blog post (PUT /posts/:title)
app.put('/posts/:title', (req, res) => {
    const { title } = req.params;  // Get the title from the URL parameter
    const { content } = req.body;  // Get the updated content from the request body
    
    // Check if the blog post exists by verifying the file
    if (fs.existsSync(`${title}.txt`)) {
        // If it exists, overwrite the file with the new content
        fs.writeFileSync(`${title}.txt`, content);
        res.send('Blog post updated');  // Respond with success message
    } else {
        res.status(404).send('This post does not exist!');  // Respond with error if the post doesn't exist
    }
});

// 3. Delete a blog post (DELETE /blogs/:title)
app.delete('/blogs/:title', (req, res) => {
    const { title } = req.params;  // Get the title from the URL parameter
    
    // Check if the blog post exists by verifying the file
    if (fs.existsSync(`${title}.txt`)) {
        // If it exists, delete the file
        fs.unlinkSync(`${title}.txt`);
        res.send('Blog post deleted');  // Respond with success message
    } else {
        res.status(404).send('This post does not exist!');  // Respond with error if the post doesn't exist
    }
});

// 4. Read a single blog post (GET /blogs/:title)
app.get('/blogs/:title', (req, res) => {
    const { title } = req.params;  // Get the title from the URL parameter
    
    // Check if the blog post exists by verifying the file
    if (fs.existsSync(`${title}.txt`)) {
        // If it exists, read the file and send the content as a response
        const content = fs.readFileSync(`${title}.txt`, 'utf-8');
        res.send(content);  // Send the content of the blog post
    } else {
        res.status(404).send('This post does not exist!');  // Respond with error if the post doesn't exist
    }
});

// 5. Read all blog posts (GET /blogs)
app.get('/blogs', (req, res) => {
    // Read all files in the current directory
    const files = fs.readdirSync('./');
    
    // Filter out only .txt files and map them to an array of titles
    const posts = files.filter(file => file.endsWith('.txt'))
                       .map(file => ({ title: file.replace('.txt', '') }));
    
    res.json(posts);  // Send the list of posts as JSON
});

// Default route for testing the server
app.get('/', function (req, res) {
    res.send('Hello World');  // Respond with a simple message
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
