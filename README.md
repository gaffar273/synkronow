# 🚀 SynkroNow - Modern Task Management Platform

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://synkronow.vercel.app/)
[![GitHub](https://img.shields.io/badge/github-repository-blue)](https://github.com/gaffar273/synkronow)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> A powerful, full-stack task management system with role-based access control, built with the MERN stack.

**Live Demo:** [https://synkronow.vercel.app/](https://synkronow.vercel.app/)

---

## ✨ Features

### 👨‍💼 Admin Features
- **Isolated Workspaces** - Each admin has their own separate workspace
- **Project Management** - Create, update, and delete projects with unique codes
- **Task Creation** - Assign tasks to users via email or task codes
- **Request Management** - Approve/reject user access requests
- **Real-time Dashboard** - Track projects, tasks, and completion stats
- **User Management** - Manage users and their access codes

### 👤 User Features
- **Task Access Requests** - Request access to tasks using unique task codes
- **Personal Dashboard** - View all assigned tasks in one place
- **Task Management** - Update task status, add GitHub repo links
- **Profile Management** - Update personal information and access code
- **Real-time Notifications** - Get instant feedback on requests

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for modern UI
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### Deployment
- **Frontend:** Vercel
- **Backend:** Vercel Serverless Functions
- **Database:** MongoDB Atlas

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
2. git clone https://github.com/gaffar273/synkronow.git
cd synkronow

2. **Backend Setup**
cd backend
npm install
Create .env file

echo "MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000" > .env
Start backend

npm start 

3. **Frontend Setup**
4. cd client
npm install
Start frontend

npm run dev


4. **Access the app**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---


---

## 🎯 Key Highlights

✅ **Admin Isolation** - Each admin sees only their projects and tasks  
✅ **Role-Based Access** - Separate dashboards for admins and users  
✅ **Task Code System** - Unique codes for easy task access  
✅ **Request Approval** - Admins control who can access tasks  
✅ **Modern UI/UX** - Clean, responsive design with dark mode  
✅ **Secure Authentication** - JWT tokens with bcrypt password hashing  
✅ **RESTful API** - Well-structured backend architecture  
✅ **Deployed & Live** - Fully functional production app  

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Gaffar**

- GitHub: [@gaffar273](https://github.com/gaffar273)
- LinkedIn: (https://www.linkedin.com/in/abdul-gaffar-sk-07b373212/)

---

## 🙏 Acknowledgments

- Thanks to all contributors
- Built with passion and dedication
- Open to feedback and improvements

---

⭐ **Star this repo if you find it helpful!**

🔗 **Live Demo:** [https://synkronow.vercel.app/](https://synkronow.vercel.app/)





