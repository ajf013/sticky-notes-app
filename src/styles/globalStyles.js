import { createGlobalStyle, keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    background-image: ${({ theme }) => theme.backgroundImage};
    background-size: 400% 400%;
    animation: ${gradientAnimation} 45s ease infinite;
    background-attachment: fixed;
    color: ${({ theme }) => theme.text};
    font-family: 'Roboto', sans-serif;
    transition: all .5s linear;
    min-height: 100vh;
  }
  p {
    line-height: 1.4rem;
  }
  .btn-primary {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.body};
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
    border-radius: 1rem;
    cursor: pointer;
    outline: none;
    border: none;
    transition: all .5s linear;
  }
  .header h1 {
    background: ${({ theme }) => theme.headerBg};
    padding: 0.5rem 1rem;
    border-radius: 10px;
    backdrop-filter: blur(5px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
`;

export const lightTheme = {
  body: 'transparent',
  text: '#121212',
  primary: '#6200ee',
  headerBg: 'rgba(255, 255, 255, 0.6)',
  backgroundImage: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
};

export const darkTheme = {
  body: 'transparent',
  text: '#fff',
  primary: '#bb86fc',
  headerBg: 'rgba(0, 0, 0, 0.5)',
  backgroundImage: "url('https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=3840&q=100')", // 4K High Quality Starry Night / Galaxy
};