import { useState } from 'react';
import { supabase } from '../supabaseClient';
import styled, { keyframes } from 'styled-components';
import { Icon } from 'semantic-ui-react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const fluidGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AuthWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  
  @media (max-width: 768px) {
    margin-top: 4rem;
  }
`;

const AuthCard = styled.div`
  background: ${({ theme }) => (theme === 'light' ? 'rgba(69, 11, 45, 0.85)' : 'rgba(60, 13, 135, 0.5)')};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out forwards;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    color: #cdc6d0e5;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 800;
    margin-top: 1rem;
    color: ${({ theme }) => (theme === 'light' ? '#222' : '#fff')};
  }
  
  p {
    color: ${({ theme }) => (theme === 'light' ? '#333' : '#eee')};
    font-size: 1rem;
    font-weight: 500;
    margin-top: 0.5rem;
  }

  .animated-icon {
    animation: ${floatAnimation} 3s ease-in-out infinite;
    display: inline-block;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
  }
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.9rem;
    font-weight: 700;
    margin-left: 0.25rem;
    color: ${({ theme }) => (theme === 'light' ? '#222' : '#ccc')};
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1.2rem;
  padding-right: 2.5rem; /* Room for icon */
  border-radius: 12px;
  border: 2px solid transparent;
  background: ${({ theme }) => (theme === 'light' ? 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' : 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)')};
  background-size: 200% 200%;
  animation: ${fluidGradient} 10s ease infinite;
  color: ${({ theme }) => (theme === 'light' ? '#333' : '#fff')};
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #0072FF;
    box-shadow: 0 0 0 4px rgba(0, 114, 255, 0.1);
  }

  &::placeholder {
    color: #666;
  }
`;

const EyeIcon = styled.div`
  position: absolute;
  right: 12px;
  cursor: pointer;
  color: ${({ theme }) => (theme === 'light' ? '#666' : '#ccc')};
  transition: color 0.2s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  font-size: 1.1rem;

  &:hover {
    color: ${({ theme }) => (theme === 'light' ? '#333' : '#fff')};
  }
`;

const SubmitButton = styled.button`
  background: white;
  color: #ff69b4;
  border: 2px solid #ff69b4;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 114, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 77, 79, 0.3);
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
`;

const ToggleText = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: ${({ theme }) => (theme === 'light' ? '#666' : '#bbb')};

  span {
    color: ${({ theme }) => (theme === 'light' ? '#fff' : '#ffc0cb')};
    font-weight: 800;
    cursor: pointer;
    transition: color 0.2s ease;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);

    &:hover {
      text-decoration: underline;
    }
  }
`;


export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signIn({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('We sent a verification link to your email. Please check your inbox (and spam folder) to complete registration!');
        setIsLogin(true); // switch back to login mode after signup
      }
    } catch (error) {
      setErrorMsg(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthCard>
        <AuthHeader>
          <h1>Sticky Notes App</h1>
          <div className="animated-icon">
            <Icon name='sticky note' size='huge' style={{ color: '#fff' }} />
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p>{isLogin ? 'Sign in to access your notes' : 'Start organizing your thoughts today.'}</p>
        </AuthHeader>

        <StyledForm onSubmit={handleAuth}>
          <InputGroup>
            <label>Email Address</label>
            <StyledInput
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </InputGroup>

          <InputGroup>
            <label>Password</label>
            <PasswordContainer>
              <StyledInput
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <EyeIcon onClick={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye slash' : 'eye'} />
              </EyeIcon>
            </PasswordContainer>
          </InputGroup>

          {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}

          <SubmitButton type='submit' disabled={loading}>
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </SubmitButton>
        </StyledForm>

        <ToggleText>
          {isLogin ? "Don't have an account yet?" : "Already have an account?"}{' '}
          <span onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </ToggleText>
      </AuthCard>
    </AuthWrapper>
  );
}
