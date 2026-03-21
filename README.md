# Notes App | React

A modern, high-performance, and feature-rich Notes Application built with React.js and Supabase. Designed with a "Premium" aesthetic and seamless cross-device synchronization.

## 🌐 Live Demo

🔗 **Live Site:** 
[https://notesapp-react.netlify.app](https://notesapp-react.netlify.app)

## ✨ Features

- **Instant Real-time Sync**: Seamless cross-device synchronization using Supabase Realtime. Edits on one device are instantly reflected on all others without refreshing.
- **Premium UI/UX**: A stunning "Mid-range Violet" theme with vibrant gradients, glassmorphism headers, and smooth animations (AOS).
- **Advanced Auth System**: 
  - Modern sliding Login/Signup interface.
  - Email-only authentication for simplicity and security.
  - **Security Lockout**: Automatic local lockout after 3 failed login attempts, requiring a password reset.
- **PWA Optimized**: 
  - "Add to Home Screen" support.
  - **Smart Update**: A dedicated "Sync & Update" button in the header to check for new app versions and refresh assets (perfect for iOS Safari).
  - Automatic update detection and prompt.
- **Rich Text & Code Support**: 
  - Full-featured editor using React-Quill.
  - **Global Code Copy**: "Copy" buttons injected into all code blocks.
  - **Inline Code**: Support for selective word code blocks with vibrant teal styling and hover-to-copy icons.
- **Note Management**:
  - **Pinned Notes**: Keep important notes at the top.
  - **Title Edit Icon**: Quick-access edit icon next to titles for faster editing.
  - **Localized Timestamps**: Dates automatically localized to the user's device.
- **Secure Sharing**: 
  - Share via View or Edit access links.
  - Access request dashboard for authors to approve/deny collaborators.
- **Responsive Design**: Optimized from 4K desktops down to mobile devices with custom sliding transitions.

## 📂 Project Structure

```text
sticky-notes-app/
├── public/                # Static assets and HTML template
│   ├── index.html         # Main entry point
│   ├── manifest.json      # PWA Configuration
│   └── ...
├── src/                   # Application source code
│   ├── components/        # React components
│   │   ├── Footer/        # Global Footer
│   │   ├── AddNote.js     # Note creation with Quill integration
│   │   ├── Auth.js        # Redesigned sliding Auth UI
│   │   ├── Header.js      # Header with User Info & Sync Button
│   │   ├── Note.js        # Note card with Title Edit icon
│   │   ├── NoteContent.js # Dynamic renderer for copy buttons & inline code
│   │   ├── NotesList.js   # Main list with Premium Loader
│   │   ├── PendingRequests.js # Edit request management
│   │   ├── SharedNote.js  # Public/Shared note view
│   │   ├── SplashScreen.js # Animated entry pulse
│   │   └── Toggle.js      # Theme switcher
│   ├── styles/            # CSS and Styled Components
│   │   ├── globalStyles.js # Dynamic 4K Backgrounds & Theme logic
│   │   └── useDarkMode.js  # Dark mode state management
│   ├── App.js             # Real-time data pipeline & Routing
│   ├── index.css          # Core design system & Vibrant themes
│   ├── index.js           # PWA update registration logic
│   ├── supabaseClient.js  # v1 Supabase initialization
│   └── ...
├── package.json           # Dependencies (React 17, Supabase v1)
└── README.md              # Project documentation
```

## 🛠️ Tech Stack

- **Frontend**: React.js (v17)
- **Backend/Database**: Supabase (Realtime, Auth, Storage)
- **Styling**: Styled Components, Semantic UI, Vanilla CSS3
- **Rich Text**: React-Quill & DOMPurify (XSS Protection)
- **Animations**: AOS (Animate on Scroll)
- **Icons**: React-Icons & Semantic UI Icons
- **Deployment**: Netlify

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ajf013/sticky-notes-app.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with:
   ```text
   REACT_APP_SUPABASE_URL=your_url
   REACT_APP_SUPABASE_ANON_KEY=your_key
   ```
4. Run the app:
   ```bash
   npm start
   ```

## 📄 License

This project is licensed under the MIT License.

## Contact & Contributions 🙋‍♂️

Feel free to reach out for suggestions or contributions!

[![Linkedin Badge](https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ajf013-francis-cruz/)
[![Mail Badge](https://img.shields.io/badge/email-c14438?style=for-the-badge&logo=Gmail&logoColor=white)](mailto:cruzmma2021@gmail.com)
[![Github Badge](https://img.shields.io/badge/github-333?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ajf013)
