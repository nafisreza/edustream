# EduStream Implementation Plan
**Complete Development Roadmap**

## Current Status
- ✅ Frontend UI: Landing, Login, Signup, Create, Join pages (static)
- ❌ Backend: Not started
- ❌ WebRTC: Not implemented
- ❌ Database: Not configured
- ❌ Authentication: No functionality
- ❌ Room features: Placeholder only

**Estimated Completion: 10-15% (UI shell only)**

---

## Phase 1: Backend Foundation & Authentication

### Step 1.1: Create Backend Server Structure
- Create [apps/server](apps/server) directory in the monorepo
- Initialize package.json with Express.js, Socket.io, and required dependencies
- Set up TypeScript configuration for the backend
- Create folder structure: `/src/routes`, `/src/controllers`, `/src/models`, `/src/middleware`, `/src/utils`
- Add server entry point [apps/server/src/index.ts](apps/server/src/index.ts)

### Step 1.2: Install Backend Dependencies
Install in [apps/server/package.json](apps/server/package.json):
- express, cors, dotenv
- socket.io (for WebRTC signaling)
- mongodb, mongoose (database)
- bcryptjs, jsonwebtoken (authentication)
- express-validator (input validation)

### Step 1.3: Configure Express & Socket.io Server
- Set up Express app with CORS configuration
- Initialize Socket.io server attached to Express
- Create environment variables (.env): PORT, MONGODB_URI, JWT_SECRET, STUN_SERVER_URL
- Add connection logging and error handling
- Configure development/production modes

### Step 1.4: Set Up MongoDB Database
- Create MongoDB with local docker setup
- Design schemas in [apps/server/src/models](apps/server/src/models):
  - User schema (name, email, password, role, createdAt)
  - Room schema (roomId, hostId, participants, isActive, createdAt)
  - ChatLog schema (optional for persistent chat)
- Connect Mongoose to MongoDB
- Create database connection utility

### Step 1.5: Build Authentication System
- Create auth routes: POST /api/auth/register, POST /api/auth/login
- Implement password hashing with bcryptjs
- Generate JWT tokens on successful login
- Create JWT verification middleware
- Build auth controller with validation
- Add error handling for duplicate emails, invalid credentials

### Step 1.6: Integrate Frontend Authentication
- Install axios or fetch wrapper in [apps/web](apps/web)
- Create API client utility in [apps/web/lib/api.ts](apps/web/lib/api.ts)
- Connect [apps/web/app/signup/page.tsx](apps/web/app/signup/page.tsx) to POST /api/auth/register
- Connect [apps/web/app/login/page.tsx](apps/web/app/login/page.tsx) to POST /api/auth/login
- Store JWT in localStorage or cookies
- Add form validation (email format, password strength)
- Implement error toast notifications
- Add loading states to buttons

---

## Phase 2: WebRTC Infrastructure & Room Management

### Step 2.1: Install WebRTC Dependencies
Frontend ([apps/web](apps/web)):
- socket.io-client (real-time communication)
- **LiveKit** (Recommended for faster development)
  - livekit-client (frontend)
  - livekit-server-sdk (backend)

### Step 2.2: Configure STUN/TURN Servers
- Add Google's public STUN server: stun:stun.l.google.com:19302
- Configure in environment variables
- Create ICE servers configuration object

### Step 2.3: Build SFU Server Architecture

**If using LiveKit:**
- Install LiveKit server (Docker)
- Configure LiveKit server with API key and secret
- Create access tokens for room participants
- Backend generates tokens with room permissions (publish/subscribe)
- Frontend connects to LiveKit room using token

**Benefits of SFU over Mesh:**
- Supports 50+ participants (vs ~10 in mesh)
- Lower client CPU usage (upload once, server distributes)
- Better bandwidth management
- Simulcast support (multiple quality layers)

### Step 2.4: Create Room API Endpoints
- POST /api/rooms/create: Generate unique room ID, save to database
- GET /api/rooms/:id: Verify room exists
- POST /api/rooms/:id/join: Add participant to waiting room
- DELETE /api/rooms/:id: Close room (host only)

### Step 2.5: Implement Room Creation Flow
- Update [apps/web/app/create/page.tsx](apps/web/app/create/page.tsx):
  - Call POST /api/rooms/create with room name/description
  - Receive generated room ID
  - Redirect to [apps/web/app/room/[id]/page.tsx](apps/web/app/room/[id]/page.tsx) with host privileges
- Store host status in state management

### Step 2.6: Implement Room Joining Flow
- Update [apps/web/app/join/page.tsx](apps/web/app/join/page.tsx):
  - Validate room ID with GET /api/rooms/:id
  - Prompt for student name
  - Call POST /api/rooms/:id/join
  - Wait for host approval (socket event)
  - Redirect to room on approval

### Step 2.7: Build Waiting Room Feature
- Create socket event: `join-request` (student → server → host)
- Host receives notification with student name
- Create approval UI component in room page
- Socket events: `approve-join`, `reject-join`
- Handle approval/rejection on student side

---

## Phase 3: WebRTC Video/Audio Streaming

### Step 3.1: Create WebRTC Context Provider
- Create [apps/web/contexts/WebRTCContext.tsx](apps/web/contexts/WebRTCContext.tsx)
- Initialize LiveKit Room
- Manage participant tracks: Map<userId, RemoteTrack[]>
- Store local media stream (camera/microphone)
- Provide functions: toggleMute, toggleVideo, publishTrack, unpublishTrack
- Handle room events: participant joined/left, track subscribed/unsubscribed

### Step 3.2: Request Camera/Microphone Access
- Use navigator.mediaDevices.getUserMedia() API
- Request video (720p) and audio permissions
- Handle permission errors gracefully
- Store local stream in context
- Display local video preview

### Step 3.3: Implement Media Publishing & Subscription Logic

**LiveKit:**
- Connect to LiveKit room with access token
- Publish local camera/microphone tracks
- Subscribe to remote participant tracks automatically
- LiveKit handles all WebRTC negotiation internally

**Critical: Implement Track Renegotiation**
- When a student **turns camera off**: Unpublish the video track (don't just mute)
- When **turning camera back on**: 
  1. Acquire new media stream with getUserMedia()
  2. Create new video track
  3. Publish new track (triggers new offer/answer negotiation)
  4. Update local video preview
- **Why this matters**: Simply enabling/disabling tracks can cause black screens because the WebRTC connection isn't properly renegotiated
- Same applies to microphone and screen sharing
- Track replacement flow:
  ```javascript
  // Unpublish old track
  await room.localParticipant.unpublishTrack(oldVideoTrack);
  oldVideoTrack.stop();
  
  // Get new media
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const newTrack = stream.getVideoTracks()[0];
  
  // Publish new track (renegotiates connection)
  await room.localParticipant.publishTrack(newTrack);
  ```

**Error Handling:**
- Monitor track mute/unmute events
- Detect "black screen" scenarios (track ended unexpectedly)
- Auto-retry track publication on failure
- Show user-friendly error messages

### Step 3.4: Build Video Grid Component
- Create [apps/web/components/VideoGrid.tsx](apps/web/components/VideoGrid.tsx)
- Display local video feed
- Render remote participant videos in grid layout
- Show participant names overlay
- Implement responsive grid (2x2, 3x3, etc.)
- Add "No video" placeholder for disabled cameras

### Step 3.5: Add Media Controls
- Create [apps/web/components/MediaControls.tsx](apps/web/components/MediaControls.tsx)
- Mute/Unmute button (toggle audio track)
- Video On/Off button (toggle video track)
- Leave room button
- Update UI state and notify peers via Socket.io

### Step 3.6: Update Room Page
- Redesign [apps/web/app/room/[id]/page.tsx](apps/web/app/room/[id]/page.tsx):
  - Initialize Socket.io connection
  - Join WebRTC room
  - Render VideoGrid component
  - Render MediaControls component
  - Add header with room info and participant count

---

## Phase 4: Classroom Management Features

### Step 4.1: Implement Role-Based Permissions
- Create permission middleware in backend
- Check user role (Teacher vs Student) from JWT or room state
- Restrict actions like "mute all", "remove participant" to teachers
- Send role information to frontend on room join

### Step 4.2: Add "Raise Hand" Feature
- Create button in student UI
- Socket event: `raise-hand` (student → server → host)
- Show notification toast on teacher's screen
- Display hand icon overlay on student's video tile
- Teacher can acknowledge (clear the hand)

### Step 4.3: Build Teacher Control Panel
- Create [apps/web/components/TeacherControls.tsx](apps/web/components/TeacherControls.tsx)
- "Mute All" button: Socket event broadcasts to all students
- Participant list with individual actions:
  - Mute individual student
  - Remove from room
- Host-only UI visibility

### Step 4.4: Implement "Mute All" Functionality
- Teacher clicks "Mute All"
- Socket event: `mute-all` → server → all students
- Force mute audio tracks on student clients
- Optionally disable unmute for students
- Show "Muted by teacher" indicator

### Step 4.5: Add Participant Removal
- Teacher clicks "Remove" on participant
- Socket event: `kick-user` with userId
- Server disconnects student's socket
- Student sees "Removed from room" message
- Redirect student to home page

### Step 4.6: Implement Active Speaker Detection
- Monitor audio levels using Web Audio API
- Create AudioContext and AnalyserNode for each peer
- Detect volume threshold
- Highlight active speaker's video with border
- Update UI every 100ms

---

## Phase 5: Interactive Whiteboard

### Step 5.1: Choose Whiteboard Library
Options:
- **Fabric.js**: Full-featured canvas library
- **tldraw**: Modern collaborative whiteboard
- **Excalidraw**: Simple drawing tool
- **Custom Canvas**: Build from scratch with HTML5 Canvas API

Recommendation: tldraw or Fabric.js for speed

### Step 5.2: Install & Configure Whiteboard
- Install chosen library in [apps/web](apps/web)
- Create [apps/web/components/Whiteboard.tsx](apps/web/components/Whiteboard.tsx)
- Initialize canvas with drawing tools (pen, shapes, eraser, colors)
- Add toolbar with tool selection

### Step 5.3: Add Whiteboard Toggle
- Create button to show/hide whiteboard
- Split screen layout: videos on left, whiteboard on right
- OR fullscreen whiteboard mode with minimized videos

### Step 5.4: Implement Real-Time Synchronization
- Socket events for canvas changes:
  - `whiteboard-draw`: Drawing strokes
  - `whiteboard-clear`: Clear canvas
  - `whiteboard-undo`: Undo last action
- Broadcast teacher's canvas changes to all students
- Optionally allow students to draw (permission-based)

### Step 5.5: Add Whiteboard Permissions
- Teacher: Full drawing access
- Students: View-only by default
- Toggle "Allow student drawing" option
- Color-code student drawings by user

---

## Phase 6: Additional Features & Polish

### Step 6.1: Add Text Chat
- Create [apps/web/components/ChatPanel.tsx](apps/web/components/ChatPanel.tsx)
- Socket events: `send-message`, `receive-message`
- Display chat messages with timestamps
- Teacher can disable chat for students
- Optionally save chat logs to MongoDB

### Step 6.2: Implement Notification System
- Install react-hot-toast or sonner
- Show toasts for:
  - User joined/left room
  - Hand raised
  - Muted by teacher
  - Connection issues
- Configure toast position and duration

### Step 6.3: Add Screen Sharing

**Implementation:**
- Use navigator.mediaDevices.getDisplayMedia() to capture screen
- Create "Share Screen" button in MediaControls
- Add "Stop Sharing" button that appears during sharing

**Critical: Screen Share is a Separate Stream**
- ⚠️ `getDisplayMedia()` creates a **new MediaStream**, NOT a track from your existing camera stream
- **Two approaches to handle this:**

**Approach 1: Replace Video Track (Recommended for simplicity)**
```javascript
// Stop camera, publish screen instead
await room.localParticipant.unpublishTrack(cameraTrack);
const screenStream = await navigator.mediaDevices.getDisplayMedia();
const screenTrack = screenStream.getVideoTracks()[0];
await room.localParticipant.publishTrack(screenTrack);

// When stopping: switch back to camera
await room.localParticipant.unpublishTrack(screenTrack);
const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
const newCameraTrack = cameraStream.getVideoTracks()[0];
await room.localParticipant.publishTrack(newCameraTrack);
```

**Approach 2: Publish Additional Track (Better UX)**
- Publish screen share as a **second video track** alongside camera
- Participants see both your face AND your screen
- Display screen in larger tile, camera in small picture-in-picture
- LiveKit supports multiple tracks per participant
- UI shows two video tiles for the screen sharer

**Handle Screen Share Ended Event:**
```javascript
screenTrack.addEventListener('ended', () => {
  // User clicked "Stop Sharing" in browser UI
  // Clean up and revert to camera
  handleStopScreenShare();
});
```

**UI Considerations:**
- Show "Screen" badge on video tile during sharing
- Enlarge screen share tile (main view)
- Minimize other participants (side bar)
- Teacher can share screen even if camera is off

### Step 6.4: Implement Connection Quality Indicator
- Monitor RTCPeerConnection.getStats()
- Track bitrate, packet loss, latency
- Display connection quality icon (green/yellow/red)
- Show warning on poor connection

### Step 6.5: Add Room Settings
- Teacher can set:
  - Max participants
  - Auto-mute on join
  - Waiting room enabled/disabled
  - Recording enabled (future feature)
- Save settings in database

### Step 6.6: Build Participant List Sidebar
- Show all participants with status icons
- Display role (Teacher/Student)
- Show mic/camera status
- Quick actions (mute, remove)
- Search/filter participants

---

## Phase 7: UI/UX Enhancements & Testing

### Step 7.1: Improve Error Handling
- Handle WebRTC connection failures
- Detect microphone/camera permission denials
- Show user-friendly error messages
- Implement reconnection logic for dropped connections
- Fallback UI for unsupported browsers

### Step 7.2: Add Loading States
- Room joining loader
- "Connecting to peers..." indicator
- Skeleton loaders for video tiles
- Disable buttons during async operations

### Step 7.3: Optimize Performance
- Lazy load whiteboard library
- Limit video resolution based on network
- Implement adaptive bitrate
- Use React.memo for video components
- Debounce socket events

### Step 7.4: Make UI Responsive
- Mobile-friendly layout
- Touch controls for whiteboard
- Vertical video grid on mobile
- Collapsible sidebars
- Test on tablets and phones

### Step 7.5: Add Accessibility Features
- Keyboard shortcuts (mute: M, video: V)
- Screen reader support
- High contrast mode
- Captions/subtitles (future)
- Focus indicators

### Step 7.6: Implement Google OAuth (Optional)
- Install next-auth or passport.js
- Configure Google OAuth credentials
- Add OAuth callback route
- Link OAuth to existing auth system
- Update login/signup pages

---

## Phase 8: Deployment & Production

### Step 8.1: Prepare for Production
- Set up environment variables for production
- Configure production MongoDB instance
- Add TURN server for NAT traversal (Twilio, Xirsys, or Coturn)
- Enable HTTPS (required for WebRTC)
- Minify and optimize builds

### Step 8.2: Deploy Backend
Options:
- **Railway**: Easy Node.js hosting
- **Render**: Free tier available
- **Heroku**: Classic choice
- **DigitalOcean**: Full control
- **AWS EC2**: Scalable

Configure WebSocket support and persistent connections

### Step 8.3: Deploy Frontend
Options:
- **Vercel**: Best for Next.js (recommended)
- **Netlify**: Alternative
- **Cloudflare Pages**: Fast CDN

Connect to deployed backend API

### Step 8.4: Database Hosting
- MongoDB Atlas (cloud, free tier)
- Self-hosted MongoDB on VPS
- Configure database backups
- Set up indexes for performance

### Step 8.5: Testing
- Test with multiple users in different networks
- Verify STUN/TURN server functionality
- Check mobile compatibility
- Load test with max participants
- Test firewall/NAT scenarios

### Step 8.6: Documentation
- Write API documentation
- Create user guide for teachers
- Add developer setup instructions
- Document environment variables
- Create troubleshooting guide

---

## Future Enhancements (Post-MVP)

### Advanced Features
- **Recording**: Save sessions to cloud storage
- **Breakout Rooms**: Split students into groups
- **Polls & Quizzes**: Interactive assessments
- **Attendance Tracking**: Automatic logs
- **File Sharing**: Upload PDFs, presentations
- **Scheduling**: Calendar integration
- **Analytics**: Usage statistics for teachers
- **Multi-language Support**: i18n

### Scalability Improvements
- **Already using SFU**: LiveKit/mediasoup supports 50+ participants
- **Horizontal Scaling**: Deploy multiple LiveKit servers with load balancing
- **Redis**: Session storage, room state, and pub/sub for multi-server setups
- **Simulcast**: Multiple quality layers for adaptive streaming
- **Regional Servers**: Deploy LiveKit in multiple regions for lower latency
- **CDN**: Serve static assets globally
- **Recording Workers**: Separate servers for session recording

---

## Key Technical Challenges

1. **SFU Server Setup**: Configuring LiveKit/mediasoup server infrastructure correctly
2. **Track Renegotiation**: Properly handling camera/mic on/off cycles to prevent black screens
3. **State Synchronization**: Keeping room state consistent across all clients
4. **NAT Traversal**: Some networks may require TURN server (LiveKit includes this, mediasoup requires setup)
5. **Scalability**: SFU architecture supports 50+ participants, but requires proper server resources
6. **Screen Share Stream Management**: Handling multiple video tracks per participant correctly

---

## Recommended Development Order

Start with this sequence for fastest path to working prototype:

1. ✅ Set up backend server (Step 1.1-1.4)
2. ✅ Implement basic authentication (Step 1.5-1.6)
3. ✅ Create room creation/joining (Step 2.4-2.6)
4. ✅ Build WebRTC video/audio (Step 3.1-3.6) ← **CORE FEATURE**
5. ✅ Add teacher controls (Step 4.2-4.5)
6. ✅ Implement whiteboard (Step 5.1-5.4)
7. ✅ Polish and test (Step 7.1-7.4)
8. ✅ Deploy (Step 8.1-8.3)

Skip optional features initially: OAuth, chat, screen sharing, advanced analytics.

---

## Final Notes

- **Priority**: Focus on SFU setup (Phase 2) and WebRTC implementation (Phase 3) first
- **SFU Architecture**: Using LiveKit enables 50+ participant rooms with better performance
- **LiveKit vs mediasoup**:
  - **LiveKit**: Faster development, managed cloud option, built-in TURN servers, better documentation
  - **mediasoup**: More control, self-hosted only, steeper learning curve, more flexibility
- **Track Renegotiation**: This is critical! Always unpublish/republish tracks when toggling camera/mic, not just enable/disable
- **Screen Sharing**: Remember it's a separate stream - plan your UI for multiple video tracks
- **Browser Support**: Chrome/Edge recommended, Safari has WebRTC quirks
- **Testing**: Test camera on/off cycles extensively, test with real network conditions and multiple devices
- **Server Resources**: SFU requires more backend resources than mesh, plan accordingly (2-4GB RAM minimum)
