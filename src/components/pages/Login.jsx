import {FaUser, FaLock, FaEye, FaEyeSlash} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import { useState } from 'react';
import {Input} from '../form/Input';
import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../layout/Logo';

export function Login() {

    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [userNameError, setUserNameError] = useState('');
    
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
  
    const [showPassword, setShowPassword] = useState(false);

    function togglePassword () {
        setShowPassword(!showPassword);
    }

    const handleSubmit = (e) => {

        
        e.preventDefault();
        const isNameValid = userNameValidate();
        const isPasswordValid = passwordValidate();

        if(!isNameValid || !isPasswordValid) return;

        const instructors = JSON.parse(localStorage.getItem('instructor')) || [];

        const found = instructors.find(instructor => instructor.name === userName && instructor.password === password);

        if(found) {
            localStorage.setItem('loggedInstructor', JSON.stringify(found));
            navigate('/home');
        } else {
            setUserNameError('Usuário inválido');
            setPasswordError('Senha inválida');
        }

    }

    const userNameValidate = () => {
        if(!userName) {
            setUserNameError('Nome não informado ou inválido.');
            return false;
        }
        setUserNameError('');
        return true;
    } 

    const passwordValidate = () => {
        if(!password) {
            setPasswordError('Senha não informada ou inválida.');
            return false;
        }

        setPasswordError('');
        return true;
    }




    return (
        <>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Logo />
                <div className={styles.form_header}>
                    <h2>Login</h2>
                </div>
                <div className={styles.form_body}>
                    <i className={styles.icon}><FaUser /></i>
                    <Input type='text' className={userNameError ? styles.input_error : ''} value={userName} placeholder='Usuário' onChange={(e) => setUserName(e.target.value)} onInput={userNameValidate}/>
                    {userNameError && <p className={styles.error}>{userNameError}</p>}
                </div>
                <div className={styles.form_body}>
                    <i className={styles.icon}><FaLock /></i>
                    <Input type={showPassword ? 'text' : 'password'} className={passwordError ? styles.input_error : ''} value={password} placeholder='Senha' onChange={(e) => setPassword(e.target.value)} onInput={passwordValidate}/>
                    <i id={styles.eyeIcon} onClick={togglePassword}>{showPassword ? <FaEyeSlash /> : <FaEye />}</i>
                    {passwordError && <p className={styles.error}>{passwordError}</p>}
                </div>

                <button type='submit'>Entrar</button>
                <Link to='/instructor'>Cadastre-se</Link>
            </form>
        </>
    )
}