## Problem Statement

Existing video conferencing tools such as Zoom, Google Meet, and Microsoft Teams are
primarily designed for corporate communication rather than educational use. As a result,
they lack several features that are essential for an effective virtual classroom environment.

Key Issues:

- Lack of Classroom Control: Traditional platforms do not provide strict teacher–student
    hierarchies such as forced mute, selective chat control, or preventing students from
    interrupting the class.
- Bloat & Complexity: Many tools require installation, heavy system resources,
    or contain unnecessary features that can distract students.
- Cost Barriers: Important features—meeting duration, cloud recording, atten-
    dance logs—often require premium subscriptions that many institutions cannot
    afford.
- Latency Issues: Centralized servers can introduce lag, especially in regions with
    unstable internet connectivity.

## Solution

EduStream provides a lightweight, browser-based virtual classroom platform designed
exclusively for teachers and students.

Solution Highlights:

- Browser Native: Runs completely on the web using WebRTC, no installation
    needed.
- Peer-to-Peer Mesh: Reduces server cost and improves latency for small/medium
    classrooms.
- Strict Role Management: Distinct permissions for Teacher (Host) and Students
    (Peers) to ensure discipline and control
- Optimized UI: Minimal, distraction-free interface built for educational use.

## Key Features

1. Virtual Classroom Creation (Teacher)
    - The teacher can generate a unique, random Room-ID or generate link.
    - The teacher enters the lobby automatically as the ”Host” with administrative
       privileges.
2. Student Joining Mechanism
    - Students enter the Room-ID and their Name to join.
    - No account creation is mandatory for students (reducing friction), but they
       wait in a ”Waiting Room” until approved by the teacher.
3. Real-Time Audio/Video Communication
    - Users can stream video and audio with toggle controls (Mute/Unmute, Video
       On/Off).
    - Active Speaker detection highlights the person currently talking.

## Additional Features

4. Interactive Whiteboard
    - A collaborative canvas where the teacher can draw diagrams or solve math
       problems.
    - Changes are synchronized instantly to all students’ screens.
5. Raise Hand Feature
    - A student can click a button to digitally ”raise their hand.”
    - The teacher receives a notification toast and sees a visual indicator on the
       student’s video feed.
6. Classroom Management (Host Only)
    - Mute All: Teacher can mute every student at once.
    - Remove Participant: Teacher can kick a disruptive student from the session.


## Tools and Technology

Frontend (The View Layer):
Next, React, TailwindCSS

Backend (The Signaling & API Layer):
Runtime: Node.js
Framework: Express.js – To handle REST API routes and serve the WebSocket server.
Signaling: Socket.io – To handle the handshake messages (SDP offers/answers) and real-
time events (chat, raise hand).

Core Communication Protocol:
Media Transport: WebRTC (Native Browser API) – For peer-to-peer video/audio stream-
ing.
NAT Traversal: STUN Server (Google Public STUN) – To allow connection through
firewalls.

Database:
MongoDB – To store user credentials or persistent chat logs if required.
