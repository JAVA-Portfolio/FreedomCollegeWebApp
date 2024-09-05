
document.getElementById("viewAllStudentsBtn").addEventListener("click", function () {
    fetch('/api/students/all')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("studentsTableBody");
            tableBody.innerHTML = ''; // Clear any existing rows

            if (data.length > 0) {
                data.forEach(student => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${student.studentId}</td>
                        <td>${student.name}</td>
                        <td>${student.email}</td>
                        <td>${student.phoneNumber}</td>
                        <td>${student.birthdate}</td>
                        <td>${student.gender}</td>
                        <td>${student.major}</td>
                        <td class="table-actions">
                            <a href="#" class="btn btn-primary btn-sm" onclick="enableEditing(this)">Update</a>
                            <a href="#" class="btn btn-danger btn-sm" onclick="deleteStudent(${student.studentId})">Delete</a>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                document.getElementById("studentsTableContainer").style.display = 'block'; // Show the table
                document.getElementById("updateStatus").innerText = ''; // Clear any previous error message
            } else {
                document.getElementById("updateStatus").innerText = 'No students found.'; // Display error message
                document.getElementById("studentsTableContainer").style.display = 'none'; // Hide the table
            }
        })
        .catch(error => {
            console.error('Error fetching students:', error);
            document.getElementById("updateStatus").innerText = 'Error fetching students.'; // Display error message
            document.getElementById("studentsTableContainer").style.display = 'none'; // Hide the table if an error occurs
        });
});

document.querySelector("#searchForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const query = document.querySelector("input[name='query']").value.trim();

    const tableBody = document.getElementById("studentsTableBody");
    const updateStatus = document.getElementById("updateStatus");
    const errorMessageContainer = document.getElementById("errorMessageContainer");

    // Clear the table and status message before making a new search
    tableBody.innerHTML = '';
    updateStatus.innerText = '';
    errorMessageContainer.style.display = 'none'; // Hide errorMessageContainer initially

    if (query) {
        fetch(`/api/students/search?query=${query}`)
            .then(response => {
                if (response.ok) {
                    return response.json(); // Parse response body as JSON
                } else if (response.status === 404) {
                    throw new Error("Student not found."); // Throw error if student not found
                } else {
                    throw new Error("Error fetching student data."); // Throw error for other HTTP status codes
                }
            })
            .then(student => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.studentId}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.phoneNumber}</td>
                    <td>${student.birthdate}</td>
                    <td>${student.gender}</td>
                    <td>${student.major}</td>
                    <td class="table-actions">
                        <a href="#" class="btn btn-primary btn-sm">Update</a>
                        <a href="#" class="btn btn-danger btn-sm" onclick="deleteStudent(${student.studentId})">Delete</a>
                    </td>
                `;
                tableBody.appendChild(row);
                document.getElementById("studentsTableContainer").style.display = 'block'; // Show the table
                updateStatus.innerText = ''; // Clear any previous error message
                errorMessageContainer.style.display = 'none'; // Hide errorMessageContainer
            })
            .catch(error => {
                console.error('Error fetching student:', error);
                updateStatus.innerText = error.message; // Display error message
                updateStatus.style.display = 'block'; // Show updateStatus
                errorMessageContainer.style.display = 'block'; // Show errorMessageContainer
                document.getElementById("studentsTableContainer").style.display = 'none'; // Hide the table if an error occurs
            });
    } else {
        updateStatus.innerText = 'Please enter a search query.'; // Display error message if query is empty
        updateStatus.style.display = 'block'; // Show updateStatus
        errorMessageContainer.style.display = 'block'; // Show errorMessageContainer
        document.getElementById("studentsTableContainer").style.display = 'none'; // Hide the table if query is empty
    }
});





function enableEditing(button) {
    const row = button.closest("tr");

    // Hide all other rows
    const allRows = document.querySelectorAll("#studentsTableBody tr");
    allRows.forEach(r => {
        if (r !== row) {
            r.style.display = 'none';
        }
    });

    const texts = row.querySelectorAll(".text");
    const inputs = row.querySelectorAll(".editable");
    texts.forEach(text => text.style.display = 'none');
    inputs.forEach(input => input.style.display = 'inline');
    button.style.display = 'none'; // Hide the "Update" button
    row.querySelector(".btn-success").style.display = 'inline'; // Show the "Save" button
}

function saveUpdate(button, studentId) {
    const row = button.closest("tr");
    const inputs = row.querySelectorAll(".editable");
    const updatedStudent = {
        name: inputs[0].value,
        email: inputs[1].value,
        phoneNumber: inputs[2].value,
        birthdate: inputs[3].value,
        gender: inputs[4].value,
        major: inputs[5].value
    };

    // Fetch CSRF Token
    const csrfToken = document.querySelector("meta[name='_csrf']").getAttribute("content");
    const csrfHeader = document.querySelector("meta[name='_csrf_header']").getAttribute("content");

    fetch(`/api/students/update/${studentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken  // Include CSRF token in headers
        },
        body: JSON.stringify(updatedStudent)
    })
        .then(response => {
            if (response.ok) {
                // Update successful logic

                // Reload list of students and show updated row
                document.getElementById("viewAllStudentsBtn").click(); // Simulate click to fetch students again
            } else {
                // Error handling
                console.error('Failed to update student.');
            }
        })
        .catch(error => {
            console.error('Error updating student:', error);
            // Error handling
        });
}

//DELETING THE STUDENT
function deleteStudent(studentId) {
    // Fetch CSRF Token
    const csrfToken = document.querySelector("meta[name='_csrf']").getAttribute("content");
    const csrfHeader = document.querySelector("meta[name='_csrf_header']").getAttribute("content");

    fetch(`/api/students/delete/${studentId}`, {
        method: 'DELETE',
        headers: {
            [csrfHeader]: csrfToken  // Include CSRF token in headers
        }
    })
        .then(response => {
            if (response.ok) {
                // Delete successful logic

                // Reload list of students
                document.getElementById("viewAllStudentsBtn").click(); // Simulate click to fetch students again
            } else {
                // Error handling
                console.error('Failed to delete student.');
            }
        })
        .catch(error => {
            console.error('Error deleting student:', error);
            // Error handling
        });
}

// CREATING A NEW STUDENT ON THE TABLE
document.querySelector(".btn-primary").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default action
    const tableBody = document.getElementById("studentsTableBody");
    tableBody.innerHTML = ''; // Clear any existing rows
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="editable" placeholder="Student ID" disabled></td>
        <td><input type="text" class="editable" placeholder="Name"></td>
        <td><input type="text" class="editable" placeholder="Email"></td>
        <td><input type="text" class="editable" placeholder="Phone Number"></td>
        <td><input type="text" class="editable" placeholder="Birthdate"></td>
        <td><input type="text" class="editable" placeholder="Gender"></td>
        <td>
            <select class="editable">
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
            </select>
        </td>
        <td class="table-actions">
            <a href="#" class="btn btn-success btn-sm" onclick="saveNewStudent(this)">Save</a>
        </td>
    `;
    tableBody.appendChild(row);
    document.getElementById("studentsTableContainer").style.display = 'block'; // Show the table
});

function saveNewStudent(button) {
    const row = button.closest("tr");
    const inputs = row.querySelectorAll(".editable");
    const newStudent = {
        name: inputs[1].value,
        email: inputs[2].value,
        phoneNumber: inputs[3].value,
        birthdate: inputs[4].value,
        gender: inputs[5].value,
        major: inputs[6].value
    };

    // Fetch CSRF Token
    const csrfToken = document.querySelector("meta[name='_csrf']").getAttribute("content");
    const csrfHeader = document.querySelector("meta[name='_csrf_header']").getAttribute("content");

    fetch('/api/students/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken  // Include CSRF token in headers
        },
        body: JSON.stringify(newStudent)
    })
        .then(response => {
            if (response.ok) {
                // Save successful logic

                // Reload list of students
                document.getElementById("viewAllStudentsBtn").click(); // Simulate click to fetch students again
            } else {
                // Error handling
                console.error('Failed to save new student.');
            }
        })
        .catch(error => {
            console.error('Error saving new student:', error);
            // Error handling
        });
}
