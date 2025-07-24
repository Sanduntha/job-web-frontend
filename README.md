---

# 🚀 JobSphere Frontend — AI-Powered Job Posting Platform (React)

## 🌐 Overview

**JobSphere** is a modern, responsive **Job Posting Website Frontend** built with **React.js**, designed for multiple user roles:

* 👤 **Jobseeker** – Browse and apply for jobs, upload CV, view AI-based CV rating.
* 🏢 **Employer** – Post jobs, review applicants, use AI to analyze CVs.
* 🧑‍🏫 **Trainer** – Offer training programs to jobseekers.
* 🛠️ **Admin** – Manage users, job posts, and platform settings.

✨ **AI CV Parsing** – Integrated via backend API, shows CV match rate (%) and insights.

---

## 🎯 Key Frontend Features

* 🔐 **Role-Based UI Dashboards**
* 📝 **Job Listings, Apply, and Save Jobs**
* 📊 **AI CV Rating Display** via Axios API call
* 📁 **CV Upload with SweetAlert2 feedback**
* 🧩 **Modular React Components**
* 💻 **Material UI (MUI)** – Responsive, elegant design
* 🔔 **Alerts/Prompts** – SweetAlert2 for user interactions
* 🌐 **Axios Integration** – Seamless API calls to backend

---

<!-- ## 🖼️ UI Preview (Screenshots)

| Login Page                        | Jobseeker Dashboard                       | Employer CV Parse                       |
| --------------------------------- | ----------------------------------------- | --------------------------------------- |
| ![Login](./screenshots/login.png) | ![Dashboard](./screenshots/jobseeker.png) | ![AI Parse](./screenshots/ai-parse.png) |

> 📌 *Add your screenshots inside `/screenshots` folder* -->

<!-- --- -->

## 🧱 Tech Stack (Frontend)

| Technology  | Purpose                            |
| ----------- | ---------------------------------- |
| React.js    | Frontend framework                 |
| Material UI | UI components                      |
| Axios       | HTTP requests to backend/API       |
| SweetAlert2 | User alerts, confirmations, modals |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Sanduntha/job-web-frontend
cd job-web-frontend

# Install dependencies
npm install

# Start the frontend server
npm run dev
```

---

## ⚙️ Environment Variables (.env)

Create a `.env` file in root directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```
---

## 🤖 AI CV Parsing Integration (Frontend)

* **CV Upload** ➜ Sent via `Axios` POST to backend AI endpoint.
* **Response** ➜ CV Match % and details shown via SweetAlert2 or card.

```js
axios.post(`${API_URL}/parse-cv`, formData)
  .then(res => Swal.fire(`CV Match Rate: ${res.data.score}%`, res.data.summary, 'success'))
  .catch(err => Swal.fire('Error', 'Failed to parse CV', 'error'));
```

---

## 🚀 Future Frontend Features

* Dark mode toggle 🌙
* Pagination for job listings
* Chat between jobseekers and employers
* Advanced filter UI for jobs

---

## 🙌 Contributing

Contributions, issues, and feature requests are welcome!
Clone, improve, and submit pull requests anytime.

---

## 👨‍💻 Author

**Sandun Tharaka Perera**
🌐 [Portfolio](https:sanduntharaka.me) | 💼 [LinkedIn](https://www.linkedin.com/in/sandun-perera-11a61b211/) | 📧 [youremail@example.com](mailto:sanduntharaka9651@gmail.com)

---