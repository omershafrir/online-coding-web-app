### Online Coding Web Application
## About the Project
# Frameworks & Packeges
- Frontend & Backend built with NEXT.js
- Database Handling with MongoDB
- Socket Handling with socket.io
- Code Editor (Syntax Highlight) with React Monaco


# Structure & Usage
- The app contains 3 pages : Homepage, Tasks & Editor.
- When the user clicks on a Task (from the tasks page) he is rerouted to the Editor page with the relevant task - room.
- The first user that enters a given room is considered a Mentor, the second user is the Student and afterwards each additional student is a Watcher.
- Student can read, write and submit the code.
- Mentor can read and submit the code.
- Watcher can only read.
