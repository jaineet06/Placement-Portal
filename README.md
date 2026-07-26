# Placement Portal 🚀

## 📌 Overview

The Placement Portal is a MERN stack-based web application designed to streamline the campus recruitment process. It provides a centralized platform where students can explore opportunities and admins manage the complete hiring workflow.

> ⚠️ This project is currently under active development with continuous improvements in validation, performance, and code quality.

---

## Demo Video
https://github.com/user-attachments/assets/5669a5f1-5004-48d5-ba77-5badaf396512






  
---

## ✨ Current Status

* ✅ Core features implemented
* 🔄 Codebase improvements in progress
* 🛠️ Validation using Zod being integrated
* 🧪 Testing and optimization ongoing

---

## 🎯 Features

### 👨‍🎓 Student (Client Side)

* Register and login
* Account activation after admin approval
* Upload and manage resume
* View job opportunities
* Search and filter jobs
* Apply for jobs
* Track application status
* Receive email notifications for:

  * Selection ✅
  * Rejection ❌

---

### 🛠️ Admin (Core Controller)

> ⚡ Admin fully controls job management (no recruiter role)

* Approve or reject student registrations
* Add and manage company job postings
* View all job listings
* View applicants for each job
* Access student details and resumes
* Verify users
* Manage platform activity

---

## 🧱 Project Structure

### 🔹 Backend (Server)

```id="bknd12"
server/
│── configs/        # Config files (DB, mail, etc.)
│── controllers/    # Business logic
│── middlewares/    # Auth & request handling
│── models/         # Mongoose schemas
│── routes/         # API routes
│── services/       # External services (mail, etc.)
│── utils/          # Helper functions
│── validations/    # Zod schemas (in progress)
│── index.js        # Entry point
```

---

### 🔹 Frontend (Client - Student Side)

```id="clnt34"
client/
│── src/
│   │── components/
│   │── pages/
│   │── services/
│   │── utils/
│   │── App.jsx
│   │── main.jsx
```

---

### 🔹 Admin Panel (Frontend)

```id="admin56"
admin/
│── src/pages/
│   │── AdminLayout.jsx
│   │── CreateJob.jsx
│   │── JobListing.jsx
│   │── JobDetails.jsx
│   │── ListOfStudents.jsx
│   │── StudentDetails.jsx
│   │── VerifyUsers.jsx
│   │── News.jsx
```

---

## ⚙️ Tech Stack

* **Frontend (Client + Admin):** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Validation:** Zod (in progress)
* **Email Service:** Nodemailer

---

## 🔧 Ongoing Improvements

* Implementing strong validation using Zod
* Improving API error handling
* Refactoring code for better scalability
* Enhancing authentication & security
* Cleaning and optimizing codebase

---


## 🧪 Running the Project

```bash id="run456"
# Clone the repository
git clone <your-repo-link>

# Navigate to project folder
cd placement-portal

# Install dependencies for server
cd server && npm install

# Install dependencies for client
cd ../client && npm install

# Install dependencies for admin
cd ../admin && npm install

# Run all (use separate terminals)
npm run dev
```

---

## 🤝 Contribution

This project is actively being developed. Feedback and suggestions are welcome!

---

## 📄 License

This project is currently for educational purposes.

---

## 💡 Note

This portal follows an **admin-driven model**, where all job postings and student approvals are controlled by the admin. The system is continuously improving with better validation, performance optimization, and scalable architecture.
