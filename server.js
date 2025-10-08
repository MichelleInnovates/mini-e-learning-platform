// server.js - Node.js Backend for E-Learning Platform
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files from 'public' folder

// In-memory data storage (simulating a database)
let courses = [
    {
        id: 1,
        title: "JavaScript Fundamentals",
        description: "Master the basics of JavaScript programming from variables to functions.",
        lessons: [
            { id: 1, title: "Introduction to JavaScript", content: "Learn what JavaScript is and why it's important", completed: false },
            { id: 2, title: "Variables and Data Types", content: "Understanding how to store and manipulate data", completed: false },
            { id: 3, title: "Functions and Scope", content: "Create reusable code with functions", completed: false },
            { id: 4, title: "Arrays and Objects", content: "Work with complex data structures", completed: false },
            { id: 5, title: "DOM Manipulation", content: "Interact with web pages dynamically", completed: false }
        ],
        completed: false
    },
    {
        id: 2,
        title: "Web Design Basics",
        description: "Learn the fundamentals of creating beautiful and responsive websites.",
        lessons: [
            { id: 1, title: "HTML Structure", content: "Build the foundation of web pages", completed: false },
            { id: 2, title: "CSS Styling", content: "Make your pages look amazing", completed: false },
            { id: 3, title: "Responsive Design", content: "Create sites that work on any device", completed: false },
            { id: 4, title: "Flexbox and Grid", content: "Modern layout techniques", completed: false }
        ],
        completed: false
    },
    {
        id: 3,
        title: "Python for Beginners",
        description: "Start your programming journey with Python, one of the most popular languages.",
        lessons: [
            { id: 1, title: "Getting Started with Python", content: "Install and run your first program", completed: false },
            { id: 2, title: "Python Syntax", content: "Learn the rules of writing Python code", completed: false },
            { id: 3, title: "Data Structures", content: "Lists, tuples, and dictionaries", completed: false },
            { id: 4, title: "Control Flow", content: "If statements and loops", completed: false },
            { id: 5, title: "Functions and Modules", content: "Organize your code effectively", completed: false },
            { id: 6, title: "File Handling", content: "Read and write files in Python", completed: false }
        ],
        completed: false
    },
    {
        id: 4,
        title: "Database Design",
        description: "Understand how to design and work with relational databases.",
        lessons: [
            { id: 1, title: "Introduction to Databases", content: "What are databases and why use them", completed: false },
            { id: 2, title: "SQL Basics", content: "Query data with SQL", completed: false },
            { id: 3, title: "Normalization", content: "Design efficient database structures", completed: false },
            { id: 4, title: "Relationships", content: "Connect data across tables", completed: false }
        ],
        completed: false
    }
];

// API Routes

// Get all courses
app.get('/api/courses', (req, res) => {
    res.json({
        success: true,
        data: courses
    });
});

// Get single course by ID
app.get('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
        res.json({
            success: true,
            data: course
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }
});

// Mark course as completed
app.put('/api/courses/:id/complete', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
        course.completed = true;
        // Mark all lessons as completed when course is completed
        course.lessons = course.lessons.map(lesson => ({ ...lesson, completed: true }));
        res.json({
            success: true,
            message: 'Course marked as completed',
            data: course
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }
});

// Reset course completion status
app.put('/api/courses/:id/reset', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
        course.completed = false;
        // Reset all lessons to not completed
        course.lessons = course.lessons.map(lesson => ({ ...lesson, completed: false }));
        res.json({
            success: true,
            message: 'Course reset to not completed',
            data: course
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }
});

// Add a new course
app.post('/api/courses', (req, res) => {
    const { title, description, lessons } = req.body;
    
    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: 'Title and description are required'
        });
    }
    
    const newCourse = {
        id: courses.length + 1,
        title,
        description,
        lessons: (lessons || []).map((l, idx) => ({
            id: l.id || idx + 1,
            title: l.title,
            content: l.content,
            completed: Boolean(l.completed)
        })),
        completed: false
    };
    
    courses.push(newCourse);
    
    res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: newCourse
    });
});

// Delete a course
app.delete('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex !== -1) {
        const deletedCourse = courses.splice(courseIndex, 1);
        res.json({
            success: true,
            message: 'Course deleted successfully',
            data: deletedCourse[0]
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Course not found'
        });
    }
});

// Toggle lesson completion
app.put('/api/courses/:id/lessons/:lessonId/toggle', (req, res) => {
    const courseId = parseInt(req.params.id);
    const lessonId = parseInt(req.params.lessonId);
    const course = courses.find(c => c.id === courseId);

    if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const lesson = course.lessons.find(l => l.id === lessonId);
    if (!lesson) {
        return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    lesson.completed = !lesson.completed;

    // If all lessons completed, mark course completed; else unset
    const allCompleted = course.lessons.length > 0 && course.lessons.every(l => l.completed);
    course.completed = allCompleted;

    res.json({
        success: true,
        message: 'Lesson toggled',
        data: course
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 E-Learning Platform Server running on http://localhost:${PORT}`);
    console.log(`📚 API available at http://localhost:${PORT}/api/courses`);
});

// Export for testing
module.exports = app;