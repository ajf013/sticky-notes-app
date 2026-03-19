import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import styled, { keyframes, css } from 'styled-components';
import { Icon } from 'semantic-ui-react';

const move = keyframes`
  0%, 49.99% { opacity: 0; z-index: 1; }
  50%, 100% { opacity: 1; z-index: 5; }
`;

const AuthWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const MainContainer = styled.div`
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  position: relative;
  overflow: hidden;
  width: 1000px;
  max-width: 100%;
  min-height: 600px;
  
  @media (max-width: 768px) {
    min-height: 500px;
  }
`;

const FormContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  
  ${props => props.type === 'signup' ? css`
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: 1;
    ${!props.isLogin && css`
      transform: translateX(100%);
      opacity: 1;
      z-index: 5;
      animation: ${move} 0.6s;
    `}
  ` : css`
    left: 0;
    width: 50%;
    z-index: 2;
    ${!props.isLogin && css`
      transform: translateX(100%);
    `}
  `}

  @media (max-width: 768px) {
    width: 100%;
    position: relative;
    ${props => (props.type === 'signup' && props.isLogin) || (props.type === 'signin' && !props.isLogin) ? 'display: none;' : 'display: block;'}
    transform: none !important;
  }
`;

const StyledForm = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;

  h1 {
    font-weight: bold;
    margin: 0;
    margin-bottom: 1rem;
    color: #333;
  }

  p {
    font-size: 14px;
    font-weight: 100;
    line-height: 20px;
    letter-spacing: 0.5px;
    margin: 10px 0 20px;
    color: #666;
  }
`;

const StyledInput = styled.input`
  background-color: #f4f7f6;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    background-color: #e9eceb;
    box-shadow: inset 0 0 0 2px #4e4376;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const EyeToggle = styled.div`
  position: absolute;
  right: 12px;
  cursor: pointer;
  color: #888;
  &:hover { color: #555; }
`;

const MainButton = styled.button`
  border-radius: 20px;
  border: 1px solid #4e4376;
  background: linear-gradient(to right, #4e4376, #2b5876);
  color: #FFFFFF;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  cursor: pointer;
  margin-top: 1rem;

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;

  ${props => !props.isLogin && css`
    transform: translateX(-100%);
  `}

  @media (max-width: 768px) {
    display: none;
  }
`;

const Overlay = styled.div`
  background: #ff416c;
  background: linear-gradient(to right, #4e4376, #2b5876);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #FFFFFF;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  ${props => !props.isLogin && css`
    transform: translateX(50%);
  `}
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  
  ${props => props.side === 'left' ? css`
    transform: translateX(-20%);
    ${!props.isLogin && css`
      transform: translateX(0);
    `}
  ` : css`
    right: 0;
    transform: translateX(0);
    ${!props.isLogin && css`
      transform: translateX(20%);
    `}
  `}
`;

const GhostButton = styled(MainButton)`
  background: transparent;
  border-color: #FFFFFF;
  margin-top: 1.5rem;
`;

const ErrorMsg = styled.div`
  color: #ff4d4f;
  background: #fff1f0;
  border: 1px solid #ffccc7;
  padding: 8px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 13px;
  width: 100%;
`;

const InfoMsg = styled.div`
  color: #1890ff;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  padding: 8px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 13px;
  width: 100%;
`;

const MobileToggle = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    margin-top: 2rem;
    color: #4e4376;
    font-weight: bold;
    cursor: pointer;
  }
`;

const ForgotPasswordLink = styled.div`
  color: #333;
  font-size: 14px;
  margin: 15px 0;
  cursor: pointer;
  text-decoration: underline;
  &:hover { color: #4e4376; }
`;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState('auth'); // 'auth' or 'forgot'
  const [isLockedOut, setIsLockedOut] = useState(false);

  useEffect(() => {
    // Check if current email is locked out
    if (email) {
      const attempts = localStorage.getItem(`failed_attempts_${email}`) || 0;
      if (parseInt(attempts) >= 3) {
        setIsLockedOut(true);
      } else {
        setIsLockedOut(false);
      }
    }
  }, [email]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      if (isLogin) {
        if (isLockedOut) {
          throw new Error('Too many failed attempts. Please use "Forgot Password" to reset and unlock your account.');
        }

        const { error } = await supabase.auth.signIn({ email, password });
        
        if (error) {
          // Increment failed attempts
          const attempts = (parseInt(localStorage.getItem(`failed_attempts_${email}`)) || 0) + 1;
          localStorage.setItem(`failed_attempts_${email}`, attempts);
          
          if (attempts >= 3) {
            setIsLockedOut(true);
            throw new Error('3 failed attempts reached. Account locked. Please reset your password.');
          }
          throw error;
        }

        // Clear attempts on successful login
        localStorage.removeItem(`failed_attempts_${email}`);
      } else {
        const { error } = await supabase.auth.signUp(
          { email, password },
          { redirectTo: window.location.origin }
        );
        if (error) throw error;
        alert('Verification link sent! Please check your email inbox.');
        setIsLogin(true);
      }
    } catch (error) {
      setErrorMsg(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const { error } = await supabase.auth.api.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setInfoMsg('Password reset link sent to your email!');
      // Clear lockout locally once they request a reset (assuming they will reset it)
      localStorage.removeItem(`failed_attempts_${email}`);
      setIsLockedOut(false);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (view === 'forgot') {
    return (
      <AuthWrapper>
        <MainContainer style={{ width: '500px', minHeight: '400px' }}>
          <StyledForm onSubmit={handleForgotPassword} style={{ padding: '40px' }}>
            <h1>Reset Password</h1>
            <p>Enter your email address and we'll send you a link to reset your password and unlock your account.</p>
            <StyledInput 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
            {infoMsg && <InfoMsg>{infoMsg}</InfoMsg>}
            <MainButton disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </MainButton>
            <ForgotPasswordLink onClick={() => { setView('auth'); setErrorMsg(''); setInfoMsg(''); }}>
              Back to Sign In
            </ForgotPasswordLink>
          </StyledForm>
        </MainContainer>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <MainContainer>
        {/* Sign Up Form */}
        <FormContainer type="signup" isLogin={isLogin}>
          <StyledForm onSubmit={handleAuth}>
            <h1>Create Account</h1>
            <p>Start organizing your thoughts today.</p>
            <StyledInput 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <PasswordWrapper>
              <StyledInput 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <EyeToggle onClick={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye slash' : 'eye'} />
              </EyeToggle>
            </PasswordWrapper>
            {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
            <MainButton disabled={loading}>
              {loading ? 'Processing...' : 'Sign Up'}
            </MainButton>
            <MobileToggle onClick={() => setIsLogin(true)}>
              Already have an account? Sign In
            </MobileToggle>
          </StyledForm>
        </FormContainer>

        {/* Sign In Form */}
        <FormContainer type="signin" isLogin={isLogin}>
          <StyledForm onSubmit={handleAuth}>
            <h1>Sign in</h1>
            <p>Welcome back! Please enter your details.</p>
            <StyledInput 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <PasswordWrapper>
              <StyledInput 
                type={showPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <EyeToggle onClick={() => setShowPassword(!showPassword)}>
                <Icon name={showPassword ? 'eye slash' : 'eye'} />
              </EyeToggle>
            </PasswordWrapper>
            {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
            {isLockedOut && (
              <InfoMsg>Account locked after 3 failed attempts. Please reset your password to unlock.</InfoMsg>
            )}
            <ForgotPasswordLink onClick={() => { setView('forgot'); setErrorMsg(''); setInfoMsg(''); }}>
              Forgot your password?
            </ForgotPasswordLink>
            <MainButton disabled={loading || isLockedOut}>
              {loading ? 'Processing...' : 'Sign In'}
            </MainButton>
            <MobileToggle onClick={() => setIsLogin(false)}>
              Don't have an account? Sign Up
            </MobileToggle>
          </StyledForm>
        </FormContainer>

        {/* Sliding Overlay */}
        <OverlayContainer isLogin={isLogin}>
          <Overlay isLogin={isLogin}>
            <OverlayPanel side="left" isLogin={isLogin}>
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <GhostButton onClick={() => { setIsLogin(true); setErrorMsg(''); setInfoMsg(''); }}>Sign In</GhostButton>
            </OverlayPanel>
            <OverlayPanel side="right" isLogin={isLogin}>
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <GhostButton onClick={() => { setIsLogin(false); setErrorMsg(''); setInfoMsg(''); }}>Sign Up</GhostButton>
            </OverlayPanel>
          </Overlay>
        </OverlayContainer>
      </MainContainer>
    </AuthWrapper>
  );
}
