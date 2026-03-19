import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    background-image: ${({ theme }) => theme.backgroundImage};
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    color: ${({ theme }) => theme.text};
    font-family: 'Roboto', sans-serif;
    transition: all .5s linear;
    min-height: 100vh;
    margin: 0;
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
  body: '#f5f5f5',
  text: '#121212',
  primary: '#6200ee',
  headerBg: 'rgba(255, 255, 255, 0.6)',
  backgroundImage: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
};

export const darkTheme = {
  body: '#121212',
  text: '#fff',
  primary: '#bb86fc',
  headerBg: 'rgba(0, 0, 0, 0.5)',
  backgroundImage: "url('https://images.unsplash.com/photo-1543722530-d2c3201371e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=3840&q=100')", // 4K High Quality Starry Night / Galaxy
};