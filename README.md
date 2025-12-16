# GradLink - Alumni-Student Networking Platform

<div align="center">

  [![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-v19.1-blue.svg)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-v8.15+-green.svg)](https://www.mongodb.com/)
  [![Frontend on Vercel](https://img.shields.io/badge/Frontend-Vercel-black.svg)](https://vercel.com/)
  [![Backend on Render](https://img.shields.io/badge/Backend-Render-46E3B7.svg)](https://render.com/)
</div>

## 🎯 Overview

**GradLink** is a comprehensive full-stack web application designed to bridge the gap between educational institutions' alumni and current students. Our platform facilitates meaningful professional networking, exclusive career opportunities, community-driven fundraising initiatives, and enhanced engagement within college ecosystems. With features like achievement badges, real-time notifications, and secure payment processing, GradLink creates a thriving digital community for educational institutions.

## 🚀 Features

### 👥 Alumni Networking
- 🔍 **View Profiles**: Explore detailed alumni and student profiles, including education, work company and position

### 📰 Social Feed
- 📝 **Create Posts**: Share updates, success stories, and professional tips  
- ❤️ **Like & Comment**: Engage with the community through likes and meaningful discussions  
- 📸 **Media Support**: Share images in posts

### 🏆 Achievement System
- 🎖️ **Donation Badges**: Earn badges for first donations, generous giving, and top supporter status
- 💼 **Career Badges**: Recognition for job posting milestones and recruitment activities
- 📈 **Progress Tracking**: Visual achievement progress across different categories
- 🌟 **Profile Showcase**: Display earned badges prominently on user profiles

### 💼 Job Portal
- 🧑‍💼 **Alumni-Posted Opportunities**: Jobs and internships shared by alumni for students  
- 🔎 **Browse & Apply**: Explore listings and apply directly within the platform

### 📧 Email Notification System
- **Welcome Emails**: Automated welcome messages sent to new users upon registration
- **Job Application Alerts**: Instant notifications to alumni when someone applies to their posted jobs
- **Skills-Matched Job Alerts**: Automatic emails to students when jobs matching their skills are posted

### 💰 Fundraising & Donations
- 🏫 **Event-Based Campaigns**: Support college events, infrastructure, scholarships, etc.  


## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 19 with modern hooks and functional components
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: shadcn/ui built on top of Radix UI primitives
- **Styling**: Tailwind CSS for responsive and modern design
- **Routing**: React Router v7 for client-side navigation
- **HTTP Client**: Axios with credentials for API communication

### Backend (Node.js + Express)
- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js with RESTful API architecture
- **Database**: MongoDB with Mongoose ODM for schema modeling
- **Authentication**: JWT-based authentication with access and refresh tokens
- **File Storage**: Cloudinary integration for image and document storage
- **Email Service**: Nodemailer for automated email notifications
- **Payment Processing**: Stripe integration for secure donations


## 🔧 Tech Stack

<div align="center">

### Frontend Technologies
![React](https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Latest-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.9-671DDF?style=for-the-badge&logo=axios&logoColor=white)

### Backend Technologies
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.1-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.15+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-8.15-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-9.0-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)

### Infrastructure & Services
![Cloudinary](https://img.shields.io/badge/Cloudinary-File_Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payments-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-Email_Service-339933?style=for-the-badge&logo=nodemailer&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-File_Upload-FF6600?style=for-the-badge&logo=multer&logoColor=white)

</div> 

## 📊 Database Schema

GradLink uses MongoDB with Mongoose ODM for data modeling. The database follows a document-based structure with well-defined relationships between collections.

### Entity Relationship Diagram

```mermaid
erDiagram
    User {
        ObjectId _id PK
        string role
        string email UK
        string fullname
        string password
        number graduationYear
        string major
        string skills
        string avatar
        string bio
        string company
        string position
        string location
        ObjectId college FK
        string refreshToken
        date createdAt
        date updatedAt
    }
    
    College {
        ObjectId _id PK
        string collegeName UK
        string phoneNumber
        string collegeEmail
        string location
        string majors
        string logo
        date createdAt
        date updatedAt
    }
    
    Job {
        ObjectId _id PK
        ObjectId postedBy FK
        ObjectId college FK
        string title
        string company
        string description
        string requiredSkills
        string type
        string location
        ObjectId applicants FK
        date createdAt
        date updatedAt
    }
    
    JobApplication {
        ObjectId _id PK
        ObjectId job FK
        ObjectId appliedBy FK
        ObjectId college FK
        string status
        string coverLetter
        string resumeUrl
        date createdAt
        date updatedAt
    }
    
    Post {
        ObjectId _id PK
        string content
        ObjectId college FK
        string media
        string category
        ObjectId author FK
        ObjectId likes FK
        date createdAt
        date updatedAt
    }
    
    Comment {
        ObjectId _id PK
        ObjectId postedBy FK
        string content
        ObjectId post FK
        date createdAt
        date updatedAt
    }
    
    Fundraiser {
        ObjectId _id PK
        ObjectId college FK
        string title
        string description
        string coverImage
        string category
        number targetAmount
        number currentAmount
        date createdAt
        date updatedAt
    }
    
    Donation {
        ObjectId _id PK
        number amount
        ObjectId donor FK
        ObjectId fundraiser FK
        ObjectId college FK
        string paymentIntentId
        date createdAt
        date updatedAt
    }

    User ||--|| College : belongs_to
    User ||--o{ Job : posts
    User ||--o{ JobApplication : applies
    User ||--o{ Post : creates
    User ||--o{ Comment : writes
    User ||--o{ Donation : makes
    
    College ||--o{ User : has_members
    College ||--o{ Job : contains
    College ||--o{ Post : contains
    College ||--o{ Fundraiser : creates
    
    Job ||--o{ JobApplication : receives
    Job }o--o{ User : has_applicants
    
    Post ||--o{ Comment : has
    Post }o--o{ User : liked_by
    
    Fundraiser ||--o{ Donation : receives
```

## 📱 User Roles & Permissions

### 🎓 Students
- Complete profile management with graduation tracking
- Browse and apply to exclusive alumni-shared job opportunities
- Participate in social discussions and content sharing
- Support fundraising initiatives through secure donations
- Access college statistics and community insights

### 👔 Alumni
- All student features plus additional privileges
- Create and manage job postings for the community
- Review and manage job applications with candidate insights
- Build professional reputation through platform contributions

## 🔄 GradLink Platform Overview

```mermaid
flowchart TD
    %% User Entry
    A[👤 User] --> B[🔑 Login/Register]
    B --> I1[📧 Welcome Email on Register]
    B --> C[📊 Dashboard]
    
    %% Core Features
    C --> D[👥 Networking]
    C --> E[💼 Jobs]
    C --> F[📱 Social]
    C --> G[💰 Fundraising]
    
    %% Networking Features
    D --> D1[📝 Complete Profile]
    D --> D2[🌐 Browse Alumni Network]
    D2 --> D2A[🔎 Search by Name]
    D2 --> D2B[🎓 Search by Grad Year]
    D2 --> D2C[📚 Search by Major]
    D2 --> D2D[🏢 Search by Company]
    
    %% Job Features
    E --> E1[🔍 Browse Job Listings]
    E --> E2[📄 Apply to Jobs]
    E --> E3{Alumni?}
    E3 -->|Yes| E4[📝 Post Job Opportunities]
    E3 -->|Yes| E5[📊 Manage Applications]
    E3 -->|Yes| E6[✅ Accept/Reject Candidates]
    
    %% Email Notifications for Jobs
    E2 --> I2[📧 Skills-Matched Job Alerts]
    E4 --> I3[📧 Application Received Alert]
    
    %% Social Features
    F --> F1[✍️ Create Posts]
    F --> F2[💬 Comment on Posts]
    F --> F3[❤️ Like Posts]
    F --> F4[📸 Share Media]
    
    %% Fundraising Features
    G --> G2[💳 Donate to Campaigns]
    G --> G3[📊 Track Campaign Progress]
    
    %% Styling
    classDef user fill:#e3f2fd,stroke:#1976d2
    classDef feature fill:#f3e5f5,stroke:#7b1fa2
    classDef alumni fill:#fff3e0,stroke:#f57c00
    classDef email fill:#e8f5e8,stroke:#4caf50
    
    class A,B,C user
    class D,E,F,G feature
    class D2A,D2B,D2C,D2D feature
    class E4,E5,E6 alumni
    class I1,I2,I3 email
```

---

<div align="center">
  <p>⭐ If you found this project helpful, please give it a star!</p>
  <p>Built with ❤️ for connecting educational communities</p>
</div>
