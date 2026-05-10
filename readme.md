# ⚖️ LawLearn - Secure Legal Education Platform

LawLearn is a modern EdTech platform designed to help law students and aspirants learn legal concepts through structured premium video lectures, curated study materials, and secure course delivery.

The platform combines scalable cloud architecture with protected video streaming, enabling educators to distribute premium legal courses securely while providing students with a seamless cross-platform learning experience.

Built with a decoupled cloud-native architecture, LawLearn supports secure course purchases, protected lecture streaming, and scalable real-time engagement tracking.

---

## 🚀 Key Features

* **Secure Premium Video Streaming:** Paid law lectures are securely delivered using AWS CloudFront Signed URLs with short-lived access tokens to prevent unauthorized sharing and piracy.

* **Structured Legal Learning:** Students can access organized law courses, case-study discussions, recorded lectures, and exam-oriented learning modules.

* **Secure Payment Integration:** Integrated with Razorpay using backend webhook verification to securely process course purchases and prevent payment spoofing.

* **Hybrid Content Delivery:** Public demo lectures are streamed through YouTube embeds to optimize bandwidth costs, while premium lectures are securely served through AWS S3 and CloudFront.

* **Cross-Platform Learning Experience:** Built using React Native to provide a smooth mobile-first experience across Android and iOS devices.

* **Scalable Backend Architecture:** Golang backend with Redis buffering and PostgreSQL storage enables efficient handling of concurrent users and video session tracking.

---

## 🏗️ System Architecture

### Tech Stack

* **Frontend:** React Native (Expo) / TypeScript
* **Backend API:** Golang (Gin/Fiber)
* **Database:** PostgreSQL
* **Caching & Session Buffering:** Redis
* **Storage & CDN:** AWS S3 (Private Bucket) + AWS CloudFront (OAC)
* **Payments:** Razorpay API
* **Infrastructure:** Docker + AWS Cloud Services

---

## 🔄 Data Flow Overview

1. **Authentication:** Users authenticate securely and receive JWT access tokens.

2. **Course Purchase Flow:**  
   Client requests a Razorpay `order_id` → Backend creates the order → User completes payment → Razorpay webhook validates payment → Database updates course access permissions.

3. **Secure Lecture Delivery:**  
   Client requests lecture access → Backend verifies course ownership → Backend generates a short-lived CloudFront Signed URL → Student streams protected video content securely.

4. **Learning Session Tracking:**  
   Client periodically sends playback heartbeat events → Backend validates session continuity → Redis buffers playback data → Worker services sync engagement records into PostgreSQL.

---

## 🎯 Project Goals

* Provide affordable and accessible legal education digitally.
* Prevent unauthorized redistribution of premium lecture content.
* Deliver scalable video streaming infrastructure for growing student traffic.
* Build a production-grade cloud-native learning platform using modern backend architecture.

