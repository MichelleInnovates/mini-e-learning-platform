// script.js - E-Learning Platform JavaScript

// Course data
const coursesData = [
    {
        id: 1,
        title: "JavaScript Fundamentals",
        description: "Master the basics of JavaScript programming from variables to functions.",
        lessons: [
            { id: 1, title: "Introduction to JavaScript", content: "Learn what JavaScript is and why it's important" },
            { id: 2, title: "Variables and Data Types", content: "Understanding how to store and manipulate data" },
            { id: 3, title: "Functions and Scope", content: "Create reusable code with functions" },
            { id: 4, title: "Arrays and Objects", content: "Work with complex data structures" },
            { id: 5, title: "DOM Manipulation", content: "Interact with web pages dynamically" }
        ],
        completed: false
    },
    {
        id: 2,
        title: "Web Design Basics",
        description: "Learn the fundamentals of creating beautiful and responsive websites.",
        lessons: [
            { id: 1, title: "HTML Structure", content: "Build the foundation of web pages" },
            { id: 2, title: "CSS Styling", content: "Make your pages look amazing" },
            { id: 3, title: "Responsive Design", content: "Create sites that work on any device" },
            { id: 4, title: "Flexbox and Grid", content: "Modern layout techniques" }
        ],
        completed: false
    },
    {
        id: 3,
        title: "Python for Beginners",
        description: "Start your programming journey with Python, one of the most popular languages.",
        lessons: [
            { id: 1, title: "Getting Started with Python", content: "Install and run your first program" },
            { id: 2, title: "Python Syntax", content: "Learn the rules of writing Python code" },
            { id: 3, title: "Data Structures", content: "Lists, tuples, and dictionaries" },
            { id: 4, title: "Control Flow", content: "If statements and loops" },
            { id: 5, title: "Functions and Modules", content: "Organize your code effectively" },
            { id: 6, title: "File Handling", content: "Read and write files in Python" }
        ],
        completed: false
    },
    {
        id: 4,
        title: "Database Design",
        description: "Understand how to design and work with relational databases.",
        lessons: [
            { id: 1, title: "Introduction to Databases", content: "What are databases and why use them" },
            { id: 2, title: "SQL Basics", content: "Query data with SQL" },
            { id: 3, title: "Normalization", content: "Design efficient database structures" },
            { id: 4, title: "Relationships", content: "Connect data across tables" }
        ],
        completed: false
    }
];

// Global variable to track current course
let currentCourseId = null;

/**
 * Initialize the application
 */
function init() {
    renderCourses();
}

/**
 * Render all course cards on the home page
 */
function renderCourses() {
    const courseGrid = document.getElementById('courseGrid');
    courseGrid.innerHTML = '';

    coursesData.forEach(course => {
        const card = createCourseCard(course);
        courseGrid.appendChild(card);
    });
}

/**
 * Create a course card element
 * @param {Object} course - Course object
 * @returns {HTMLElement} Course card element
 */
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    card.onclick = () => showCourseDetail(course.id);
    
    card.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <div class="course-meta">
            <span class="lesson-count">${course.lessons.length} Lessons</span>
            <span class="progress-badge ${course.completed ? 'completed' : ''}">
                ${course.completed ? '✓ Completed' : 'Not Started'}
            </span>
        </div>
    `;
    
    return card;
}

/**
 * Show the course detail page for a specific course
 * @param {number} courseId - ID of the course to display
 */
function showCourseDetail(courseId) {
    currentCourseId = courseId;
    const course = coursesData.find(c => c.id === courseId);
    
    if (!course) {
        console.error('Course not found');
        return;
    }
    
    // Hide home page and show detail page
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('courseDetailPage').classList.remove('hidden');
    
    // Update course information
    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseDescription').textContent = course.description;
    
    // Update progress bar
    updateProgress(course);
    
    // Render lessons
    renderLessons(course.lessons);
    
    // Update complete button state
    updateCompleteButton(course);
    
    // Hide status message
    document.getElementById('statusMessage').classList.add('hidden');
}

/**
 * Render lessons list for a course
 * @param {Array} lessons - Array of lesson objects
 */
function renderLessons(lessons) {
    const lessonsList = document.getElementById('lessonsList');
    lessonsList.innerHTML = '';
    
    lessons.forEach(lesson => {
        const lessonItem = createLessonItem(lesson);
        lessonsList.appendChild(lessonItem);
    });
}

/**
 * Create a lesson item element
 * @param {Object} lesson - Lesson object
 * @returns {HTMLElement} Lesson item element
 */
function createLessonItem(lesson) {
    const lessonItem = document.createElement('div');
    lessonItem.className = 'lesson-item';
    lessonItem.innerHTML = `
        <h4>Lesson ${lesson.id}: ${lesson.title}</h4>
        <p>${lesson.content}</p>
    `;
    return lessonItem;
}

/**
 * Update the progress bar display
 * @param {Object} course - Course object
 */
function updateProgress(course) {
    const progress = course.completed ? 100 : 0;
    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
    progressBar.textContent = progress + '%';
}

/**
 * Update the complete button state
 * @param {Object} course - Course object
 */
function updateCompleteButton(course) {
    const completeBtn = document.getElementById('completeCourseBtn');
    
    if (course.completed) {
        completeBtn.textContent = '✓ Course Completed';
        completeBtn.classList.remove('btn-success');
        completeBtn.classList.add('btn-secondary');
    } else {
        completeBtn.textContent = 'Mark Course as Completed';
        completeBtn.classList.remove('btn-secondary');
        completeBtn.classList.add('btn-success');
    }
}

/**
 * Mark the current course as completed
 */
function completeCourse() {
    const course = coursesData.find(c => c.id === currentCourseId);
    
    if (!course) {
        console.error('Course not found');
        return;
    }
    
    if (!course.completed) {
        // Mark course as completed
        course.completed = true;
        
        // Update progress bar
        updateProgress(course);
        
        // Update button
        updateCompleteButton(course);
        
        // Show success message
        showStatusMessage('🎉 Congratulations! You completed this course!');
        
        // Update the home page courses (so status shows when user goes back)
        renderCourses();
    }
}

/**
 * Display a status message
 * @param {string} message - Message to display
 */
function showStatusMessage(message) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.classList.remove('hidden');
}

/**
 * Show the home page and hide the course detail page
 */
function showHomePage() {
    document.getElementById('courseDetailPage').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
    currentCourseId = null;
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);