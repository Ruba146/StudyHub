console.log("main.js loaded");
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("assignmentsContainer")) {
        loadAssignments();
    }
});

document.addEventListener("DOMContentLoaded", function () {
     if (document.getElementById("subjectsContainer")) {
         loadSubjects();
    }
});

function loadSubjects() {
    fetch("http://localhost:3000/subjects-list")
        .then(res => res.json())
        .then(data => {
            let table = `
             <table>
                 <tr>
                    <th>Subject</th>
                    <th>Code</th>
                    <th>Credits</th>
                    <th>Notes</th>
                 </tr>
             `;

            data.forEach(s => {
                table += `
                 <tr>
                    <td>${s.name}</td>
                    <td>${s.code}</td>
                    <td>${s.credits}</td>
                    <td>${s.notes || ""}</td>
                </tr>
                `;
            });
            table += "</table>";
             document.getElementById("subjectsContainer").innerHTML = table;
        });
}

function loadSubjectDropdown() {
    fetch("http://localhost:3000/subjects-list")
        .then(res => res.json())
        .then(data => {
            const dropdown = document.getElementById("subject");
            if (!dropdown) return; 
            dropdown.innerHTML = ""; 
            data.forEach(s => {
                const option = document.createElement("option");
                option.value = s.name;
                option.textContent = s.name;
                dropdown.appendChild(option);
            });
        });
}

document.addEventListener("DOMContentLoaded", loadSubjectDropdown);

function loadAssignments() {
    fetch("http://localhost:3000/assignments-list")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("assignmentsContainer");
            if (!container) return;
            if (data.length === 0) {
                container.innerHTML = "<p>No assignments yet.</p>";
                return;
            }
            const ongoing = data.filter(a => a.status !== "Completed");
            const completed = data.filter(a => a.status === "Completed");
            let html = "";

            html += `
                <h2>Current Tasks</h2>
                <div class="subject-block">
                    <table class="subject-block">
                        <tr>
                            <th>Title</th>
                            <th>Subject</th>
                            <th>Type</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
            `;
            ongoing.forEach(a => {
                html += `
                    <tr>
                        <td><input type="text" id="title-${a.id}" value="${a.title}"></td>
                        <td>${a.subject}</td>
                        <td>
                            <select id="type-${a.id}">
                                <option value="Assignment" ${a.type === "Assignment" ? "selected" : ""}>Assignment</option>
                                <option value="Quiz" ${a.type === "Quiz" ? "selected" : ""}>Quiz</option>
                                <option value="Exam" ${a.type === "Exam" ? "selected" : ""}>Exam</option>
                            </select>
                        </td>
                        <td><input type="date" id="due-${a.id}" value="${a.due_date ? a.due_date.split('T')[0] : ""}"></td>
                        <td>
                            <select id="status-${a.id}">
                                <option value="Not Started" ${a.status === "Not Started" ? "selected" : ""}>Not Started</option>
                                <option value="In Progress" ${a.status === "In Progress" ? "selected" : ""}>In Progress</option>
                                <option value="Completed" ${a.status === "Completed" ? "selected" : ""}>Completed</option>
                            </select>
                        </td>
                        <td>
                            <div class="action-buttons-vertical">
                                <button class="btn-finish"
                                        onclick="finishAssignment(${a.id})"
                                        ${a.status === "Completed" ? "disabled" : ""}>
                                    Finish
                                </button>
                                <button class="btn-save" onclick="saveEdit(${a.id})">Save</button>
                                <button class="btn-delete" onclick="deleteAssignment(${a.id})">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
            });

            html += `</table></div>`;

            html += `
<h2 style="margin-top:30px; display:flex; align-items:center; gap:10px;">
        <img src="../Media/taskdone.png" alt="Completed" style="width:80px; height:80px;">
        Completed Tasks
    </h2>                <div class="subject-block">
                    <table class="subject-block">
                        <tr>
                            <th>Title</th>
                            <th>Subject</th>
                            <th>Type</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
            `;
            completed.forEach(a => {
                html += `
                    <tr>
                        <td>${a.title}</td>
                        <td>${a.subject}</td>
                        <td>${a.type}</td>
                        <td>${a.due_date ? a.due_date.split('T')[0] : ""}</td>
                        <td>${a.status}</td>
                        <td>
                            <div class="action-buttons-vertical">
                                <button class="btn-delete" onclick="deleteAssignment(${a.id})">Delete</button>
                            </div>
                        </td>
                    </tr>
                `;
            });
            html += `</table></div>`;
            container.innerHTML = html;
        });
}

function finishAssignment(id) {
    fetch(`http://localhost:3000/finish-assignment/${id}`)
        .then(res => res.json())
        .then(() => loadAssignments());
}

function saveEdit(id) {
    const title = document.getElementById(`title-${id}`).value;
    const type = document.getElementById(`type-${id}`).value;
    const due_date = document.getElementById(`due-${id}`).value;
    const status = document.getElementById(`status-${id}`).value;
    fetch(`http://localhost:3000/edit-assignment/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, type, due_date, status })
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) loadAssignments();
        });
}

function deleteAssignment(id) {
    fetch(`http://localhost:3000/delete-assignment/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(() => loadAssignments());
}

function validateTask() {
    const title = document.getElementById("title").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    if (title === "") {
        alert("Title is required");
        return false;
    }
    if (title.length < 3) {
        alert("Title must be at least 3 characters");
        return false;
    }
    if (!dueDate) {
        alert("Due date is required");
        return false;
    }
    return true;
}