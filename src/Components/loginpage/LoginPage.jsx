import React, { useState } from 'react'
import loginbg from '../../assets/login-bg-dark.webp'
import whitelogo from '../../assets/logo-white.svg'
import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../redux/reducers/auth/authReducer';
import { loginUser } from '../../redux/reducers/authReducer';
import { useNavigate } from 'react-router-dom'




import './LoginPage.css'

const EyeIcon = ({ visible }) =>
  visible ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

function getHomePath(role) {
  switch (String(role ?? "").toLowerCase()) {
    case "admin":
      return "/dashboard/general";
    case "secretary":
      return "/secretary-dashboard";
    case "monitor":
      return "/monitor-dashboard";
    case "student":
      return "/student-dashboard";
    default:
      return "/loginpage";
  }
}

const LoginPage = () => {
  // here is workkk//
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);


  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loginFailed, setLoginFailed] = useState(false)


  const validate = () => {
    const newErrors = {}
    if (!email.trim()) newErrors.email = true
    if (!password.trim()) newErrors.password = true
    return newErrors
  }

  // const handleSubmit = (e) => {
  //   e.preventDefault()
  //   const newErrors = validate()
  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors)
  //     setLoginFailed(false)
  //     return
  //   }
  //   setErrors({})
  //   setLoginFailed(true)
  // }
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Validation pehle
  const newErrors = validate()
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    setLoginFailed(false)
    return
  }
  
  setErrors({})

  // Dispatch login
  const result = await dispatch(loginUser({ email, password }))

  if (loginUser.fulfilled.match(result)) {
    // Success - role ke hisaab se redirect
    const role = result.payload.role
    navigate(getHomePath(role), { replace: true })
  } else {
    // Failed - error show karo
    setLoginFailed(true)
    
  }
}

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    if (errors.email) setErrors(prev => ({ ...prev, email: false }))
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (errors.password) setErrors(prev => ({ ...prev, password: false }))
  }

  return (
    <div className="lp-root">
      <div className="lp-left">
        <div className="lp-inner">
          <div className="lp-brand">
            <img src={whitelogo} alt="PermiFast logo" className="lp-logo" />
            <span className="lp-business">Business</span>
          </div>

          <div className="lp-heading-block">
            <h1 className="lp-title">Bienvenue</h1>
            <p className="lp-subtitle">Veuillez entrer vos informations pour vous connecter.</p>
          </div>

          {/* {loginFailed && (
            <div className="lp-error-banner">
              Échec de la connexion
            </div>
          )} */}
   
{error && (
  <div className="lp-error-banner">
    {error?.message || error?.email?.[0] || 'Échec de la connexion'}
  </div>
)}

          <form className="lp-form" onSubmit={handleSubmit} noValidate>
            <div className="lp-field">
              <label className="lp-label" htmlFor="email">Email</label>
              <div className={`lp-input-wrap${errors.email ? ' lp-input-wrap--error' : ''}`}>
                <span className="lp-input-icon"><MailIcon /></span>
                <input
                  id="email"
                  type="email"
                  className="lp-input"
                  placeholder="Adresse email"
                  value={email}
                  onChange={handleEmailChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="lp-field">
              <label className="lp-label" htmlFor="password">Mot de passe</label>
              <div className={`lp-input-wrap${errors.password ? ' lp-input-wrap--error' : ''}`}>
                <span className="lp-input-icon"><LockIcon /></span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="lp-input lp-input--password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lp-eye-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <div className="lp-links-row">
              <a href="#forgot" className="lp-link">Mot de passe oublié ?</a>
              <a href="#register" className="lp-link">Je n'ai pas de compte</a>
            </div>

            <button type="submit" className="lp-submit-btn">
              <span>Se connecter</span>
              <ArrowRightIcon />
            </button>
          </form>

          <div className="lp-footer">
            <a href="#download" className="lp-link">Télécharger l'application bureau</a>
            <p className="lp-copyright">© Permifast 2026</p>
          </div>
        </div>
      </div>

      <div className="lp-right">
        <img src={loginbg} alt="" className="lp-bg-img" aria-hidden="true" />
      </div>
    </div>
  )
}

export default LoginPage
