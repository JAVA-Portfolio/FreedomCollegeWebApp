// Selecting necessary elements
const studentContainer = document.querySelector('.student-container');
const navButtons = document.querySelectorAll('.nav-button');
const indicators = document.querySelectorAll('.indicator');

let currentIndex = 0; // Starting index of the visible student box

// Function to show the current student box
function showStudent(index) {
    const students = document.querySelectorAll('.student-box');
    students.forEach(student => {
        student.style.display = 'none'; // Hide all student boxes
    });
    students[index].style.display = 'block'; // Show the student box at the given index

    // Update active indicator
    indicators.forEach(indicator => {
        indicator.classList.remove('active');
    });
    indicators[index].classList.add('active');
}

// Function to navigate to the previous student box
function prevStudent() {
    currentIndex = (currentIndex - 1 + indicators.length) % indicators.length;
    showStudent(currentIndex);
}

// Function to navigate to the next student box
function nextStudent() {
    currentIndex = (currentIndex + 1) % indicators.length;
    showStudent(currentIndex);
}

// Event listeners for navigation buttons
navButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        if (index === 0) {
            prevStudent();
        } else {
            nextStudent();
        }
    });
});

// Initial display of the first student box
showStudent(currentIndex);
