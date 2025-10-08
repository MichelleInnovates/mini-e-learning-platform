// app.js - Frontend wired to backend API with per-lesson progress

const apiBaseUrl = '';

let courses = [];
let currentCourseId = null;

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
}

async function loadCourses() {
    const response = await fetchJson(`${apiBaseUrl}/api/courses`);
    courses = response.data;
}

function getCourseById(courseId) {
    return courses.find(c => c.id === courseId);
}

function computeCourseProgress(course) {
    if (!course.lessons || course.lessons.length === 0) {
        return course.completed ? 100 : 0;
    }
    const completedCount = course.lessons.filter(l => l.completed).length;
    return Math.round((completedCount / course.lessons.length) * 100);
}

function renderCourses() {
    const courseGrid = document.getElementById('courseGrid');
    courseGrid.innerHTML = '';

    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.onclick = () => showCourseDetail(course.id);

        const progress = computeCourseProgress(course);

        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description}</p>
            <div class="course-meta">
                <span class="lesson-count">${course.lessons.length} Lessons</span>
                <span class="progress-badge ${progress === 100 ? 'completed' : ''}">
                    ${progress === 100 ? '✓ Completed' : progress + '%'}
                </span>
            </div>
        `;

        courseGrid.appendChild(card);
    });
}

async function showCourseDetail(courseId) {
    currentCourseId = courseId;
    const course = getCourseById(courseId);
    if (!course) return;

    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('courseDetailPage').classList.remove('hidden');

    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseDescription').textContent = course.description;

    updateProgressBar(course);
    renderLessons(course);
    updateCompleteButton(course);
    document.getElementById('statusMessage').classList.add('hidden');
}

function renderLessons(course) {
    const lessonsList = document.getElementById('lessonsList');
    lessonsList.innerHTML = '';

    course.lessons.forEach(lesson => {
        const item = document.createElement('div');
        item.className = 'lesson-item';
        item.innerHTML = `
            <div class="lesson-row">
                <input type="checkbox" class="lesson-checkbox" ${lesson.completed ? 'checked' : ''} />
                <div>
                    <h4>Lesson ${lesson.id}: ${lesson.title}</h4>
                    <p>${lesson.content}</p>
                </div>
            </div>
        `;

        const checkbox = item.querySelector('.lesson-checkbox');
        checkbox.addEventListener('change', async () => {
            try {
                const response = await fetchJson(`${apiBaseUrl}/api/courses/${course.id}/lessons/${lesson.id}/toggle`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' }
                });
                // Update local state from server response
                const updated = response.data;
                const idx = courses.findIndex(c => c.id === updated.id);
                courses[idx] = updated;

                // Rerender UI
                const updatedCourse = courses[idx];
                updateProgressBar(updatedCourse);
                updateCompleteButton(updatedCourse);
                renderCourses();
            } catch (e) {
                console.error(e);
            }
        });

        lessonsList.appendChild(item);
    });
}

function updateProgressBar(course) {
    const progress = computeCourseProgress(course);
    const bar = document.getElementById('progressBar');
    bar.style.width = progress + '%';
    bar.textContent = progress + '%';
}

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

async function completeCourse() {
    const course = getCourseById(currentCourseId);
    if (!course || course.completed) return;

    try {
        const response = await fetchJson(`${apiBaseUrl}/api/courses/${course.id}/complete`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        const updated = response.data;
        const idx = courses.findIndex(c => c.id === updated.id);
        courses[idx] = updated;

        showStatusMessage('🎉 Congratulations! You completed this course!');
        updateProgressBar(updated);
        updateCompleteButton(updated);
        renderCourses();
    } catch (e) {
        console.error(e);
    }
}

function showHomePage() {
    document.getElementById('courseDetailPage').classList.add('hidden');
    document.getElementById('homePage').classList.remove('hidden');
    currentCourseId = null;
}

function showStatusMessage(message) {
    const box = document.getElementById('statusMessage');
    box.textContent = message;
    box.classList.remove('hidden');
}

async function init() {
    try {
        await loadCourses();
        renderCourses();
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener('DOMContentLoaded', init);
window.showCourseDetail = showCourseDetail;
window.completeCourse = completeCourse;
window.showHomePage = showHomePage;


