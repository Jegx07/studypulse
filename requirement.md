📄 Requirements Documentation

1. Functional Requirements (FR)

The system shall provide the following functionalities:

1.1 User Management & Profile

• FR1.1.1: The system shall allow users to register and log in using secure authentication.
• FR1.1.2: The system shall maintain a student profile (name, email, department, skills, goals).
• FR1.1.3: The system shall allow users to update personal details and settings.


1.2 Dashboard

• FR1.2.1: The system shall provide a dashboard displaying an overview of student’s skill status, progress, and motivation level.
• FR1.2.2: The dashboard shall display graphical representations (charts/graphs) of student performance and progress.


1.3 Skill Gap Analysis

• FR1.3.1: The system shall allow students to upload or input their acquired skills.
• FR1.3.2: The system shall provide information about skills required for different jobs or dream roles.
• FR1.3.3: The system shall compare the student’s current skills with required skills and highlight the skill gap.
• FR1.3.4: The system shall recommend learning resources or steps to bridge the identified skill gap.


1.4 Skill & Progress Tracking

• FR1.4.1: The system shall maintain a Skill Page listing all student’s current and target skills.
• FR1.4.2: The system shall provide a Progress Page where the progress of skill acquisition and study motivation is showcased using visual metrics.
• FR1.4.3: The system shall update progress automatically when new skills are added or completed.


1.5 Psychological Consideration

• FR1.5.1: The system shall include a section focusing on student psychology and motivation level.
• FR1.5.2: The system shall integrate data from the wristband (heart rate, BP, SpO₂, temperature) to calculate a motivation index.
• FR1.5.3: The system shall visualize motivation levels over time in charts or progress bars.
• FR1.5.4: The system shall provide motivational tips and study guidance based on psychological analysis.


1.6 Static Informational Page

• FR1.6.1: The system shall provide a public interface page (accessible without login) that explains the purpose, features, and importance of the platform.
• FR1.6.2: This page shall be static and act as an introduction to the platform for new visitors.


2. Non-Functional Requirements (NFR)

The system shall satisfy the following non-functional constraints:

2.1 Performance

• NFR2.1.1: The system shall respond to user interactions within 2–3 seconds under normal load.
• NFR2.1.2: The system shall handle at least 500 concurrent users without performance degradation (scalable for more in future).


2.2 Reliability & Availability

• NFR2.2.1: The system shall ensure 99% uptime during academic periods.
• NFR2.2.2: The system shall securely handle sensor data from the wristband without data loss.


2.3 Usability

• NFR2.3.1: The system shall provide a clean, simple, and intuitive interface for students.
• NFR2.3.2: The dashboard and progress pages shall use graphical visualizations (charts, graphs, progress bars).
• NFR2.3.3: The static information page shall be accessible and informative for new users.


2.4 Security

• NFR2.4.1: The system shall store all user data securely with encryption in transit (HTTPS) and at rest.
• NFR2.4.2: The system shall enforce secure authentication and prevent unauthorized access.
• NFR2.4.3: Sensitive psychological and physiological data shall be anonymized for analytics.


2.5 Scalability

• NFR2.5.1: The system shall be designed to scale horizontally to support additional institutions.
• NFR2.5.2: The architecture shall support integration with future mobile applications and third-party APIs.


2.6 Maintainability

• NFR2.6.1: The system codebase shall be modular and documented for ease of maintenance.
• NFR2.6.2: The system shall allow easy addition of new skills, resources, or features without major redesign.
