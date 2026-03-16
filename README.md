# Notes App | React

A modern, feature-rich Notes Application built with React.js and Supabase.

## 🌐 Live Demo

🔗 **Live Site:** 
[https://notesapp-react.netlify.app](https://notesapp-react.netlify.app)

## ✨ Features

- **Rich Text Editor**: Write notes with **Bold**, *Italic*, <u>Underline</u>, Lists, Links, and Images using React-Quill.
- **Supabase Integration**: Persistent storage for notes and user authentication using Supabase.
- **Pinned Notes**: Keep your most important notes at the top of the list for quick access.
- **Secure Sharing**: Share notes via **View** or **Edit** access links.
- **Edit Access Requests**: Viewers can request edit access, and authors can approve/deny requests from a dedicated dashboard.
- **Localized Timestamps**: Note dates and times are automatically converted to your local device's timezone.
- **Social Integration**: One-click sharing to WhatsApp, Facebook, Instagram, and other platforms.
- **Theming**: Beautiful Dark and Light modes with a premium Violet/Plum color palette.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.
- **Real-time Search**: Instant search by Title or Content.

## 📸 Screenshots

### Dashboard (Violet Theme)

### Share Options & Access Control

## 📂 Project Structure

```text
sticky-notes-app/
├── public/                # Static assets and HTML template
│   ├── index.html         # Main entry point
│   ├── _redirects         # Netlify routing configuration
│   └── ...
├── src/                   # Application source code
│   ├── components/        # React components
│   │   ├── Footer/        # Footer component
│   │   ├── AddNote.js     # New note creation component
│   │   ├── Auth.js        # Authentication component (Supabase)
│   │   ├── Header.js      # Global Header with user info
│   │   ├── Note.js        # Individual Note card component
│   │   ├── NotesList.js   # List container for notes
│   │   ├── PendingRequests.js # Dashboard for edit requests
│   │   ├── Search.js      # Live search functionality
│   │   ├── SharedNote.js  # Dedicated view for shared note links
│   │   ├── SplashScreen.js # Initial loading screen
│   │   └── Toggle.js      # Dark/Light mode toggle
│   ├── styles/            # CSS and Styled Components
│   │   ├── globalStyles.js # Global theme and styling
│   │   └── useDarkMode.js  # Dark mode state management hook
│   ├── App.js             # Main application logic and routing
│   ├── index.css          # Main styles (Violet theme)
│   ├── index.js           # React DOM entry point
│   ├── supabaseClient.js  # Supabase initialization
│   └── ...
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend/Database**: Supabase
- **Styling**: Styled Components, Semantic UI, CSS3
- **Editor**: React-Quill
- **Icons**: React-Icons (SVG)
- **Deployment**: Netlify

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ajf013/notes-app-react-main.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the app:
   ```bash
   npm start
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## You can reach out 😊😊
Feel free to contact me about any issues or suggestions!

[![Linkedin Badge](https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ajf013-francis-cruz/)
[![Mail Badge](https://img.shields.io/badge/email-c14438?style=for-the-badge&logo=Gmail&logoColor=white&link=mailto:cruzmma2021@gmail.com)](mailto:cruzmma2021@gmail.com)
[![Github Badge](https://img.shields.io/badge/github-333?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ajf013)

