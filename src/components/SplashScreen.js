import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Icon } from 'semantic-ui-react';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => (theme === 'light' ? '#f5f5f5' : '#121212')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${props => props.isFadingOut ? fadeOut : 'none'} 0.5s ease-in-out forwards;
`;

const LogoContainer = styled.div`
  animation: ${pulse} 2s infinite ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const AppTitle = styled.h1`
  font-family: 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  color: ${({ theme }) => (theme === 'light' ? '#333' : '#fff')};
  margin: 0;
  text-align: center;
`;

const SplashScreen = ({ onComplete, theme }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        // Show splash screen for 2.5 seconds
        const timer = setTimeout(() => {
            setIsFadingOut(true);
            // Wait for fade out animation to complete before unmounting
            setTimeout(() => {
                onComplete();
            }, 500);
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <SplashContainer isFadingOut={isFadingOut} theme={theme}>
            <LogoContainer>
                <Icon name='sticky note' size='massive' style={{ color: theme === 'light' ? '#e91e63' : '#ff69b4' }} />
                <AppTitle theme={theme}>Sticky Notes App</AppTitle>
            </LogoContainer>
        </SplashContainer>
    );
};

export default SplashScreen;
