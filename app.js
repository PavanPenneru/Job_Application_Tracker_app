

// Get LocalStorage Data
function getJobs() {
    return JSON.parse(localStorage.getItem("jobs") || "[]");
}

// Save to LocalStorage
function saveJobs(data) {
    localStorage.setItem("jobs", JSON.stringify(data));
}

// Dashboard Rendering
if (document.body.contains(document.getElementById("jobList"))) {
    const jobList = document.getElementById("jobList");
    const searchInput = document.getElementById("searchInput");

    function renderJobs() {
        const jobs = getJobs();
        const search = searchInput.value.toLowerCase();

        jobList.innerHTML = "";

        jobs
            .filter(job => job.company.toLowerCase().includes(search) || job.role.toLowerCase().includes(search))
            .forEach((job, index) => {
                const tr = document.createElement("tr");

                tr.innerHTML = `
                <td>${job.company}</td>
                <td>${job.role}</td>
                <td><span class="status" style="background:${getStatusColor(job.status)}">${job.status}</span></td>
                <td>${job.date}</td>
                <td><button onclick="deleteJob(${index})">Delete</button></td>
                `;

                jobList.appendChild(tr);
            });
    }

    searchInput.addEventListener("input", renderJobs);
    renderJobs();
}

// Add Job Page
if (document.body.contains(document.getElementById("jobForm"))) {
    const jobForm = document.getElementById("jobForm");

    jobForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const jobs = getJobs();

        const newJob = {
            company: document.getElementById("company").value,
            role: document.getElementById("role").value,
            status: document.getElementById("status").value,
            date: document.getElementById("date").value,
            notes: document.getElementById("notes").value
        };

        jobs.push(newJob);
        saveJobs(jobs);

        alert("Job added successfully!");
        jobForm.reset();
    });
}

// Delete Job
function deleteJob(index) {
    const jobs = getJobs();
    jobs.splice(index, 1);
    saveJobs(jobs);
    location.reload();
}

// Status Color Mapping
function getStatusColor(status) {
    switch (status) {
        case "Applied": return "#007bff";
        case "Interview Scheduled": return "#ff9800";
        case "In Progress": return "#9c27b0";
        case "Selected": return "#4caf50";
        case "Rejected": return "#f44336";
        default: return "#333";
    }
}

// Analytics Page
if (document.getElementById("statusChart")) {
    const jobs = getJobs();

    const statusCount = {
        Applied: 0,
        "Interview Scheduled": 0,
        "In Progress": 0,
        Selected: 0,
        Rejected: 0
    };

    jobs.forEach(job => statusCount[job.status]++);

    new Chart(document.getElementById("statusChart"), {
        type: "pie",
        data: {
            labels: Object.keys(statusCount),
            datasets: [{
                data: Object.values(statusCount)
            }]
        }
    });
}

const themeBtn = document.getElementById('theme-btn');

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
}
updateThemeBtn(savedTheme === 'dark');

themeBtn?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');  // toggles on BODY
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeBtn(isDark);
});

function updateThemeBtn(isDark) {
    if (!themeBtn) return;
    themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

