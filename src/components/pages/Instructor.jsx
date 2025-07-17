import { Logo } from "../layout/Logo";
import { Input } from "../form/Input";
import styles from './SignupForm.module.css';
import { FaClipboard, FaLock, FaBirthdayCake, FaUser, FaIdCard, FaFingerprint, FaPhone, FaEye, FaEyeSlash, FaEnvelope, FaVenusMars, FaDumbbell } from 'react-icons/fa';
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export function Instructor() {

    const [userName, setUserName] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [userNameSuccess, setUserNameSuccess] = useState('');

    //Data de Nascimento
    const [birthDate, setBirthDate] = useState('');
    const [birthDateError, setBirthDateError] = useState('');

    //CPF
    const [cpf, setCpf] = useState('');
    //RG
    const [rg, setRg] = useState('');


    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailSuccess, setEmailSuccess] = useState('');

    const [phone, setPhone] = useState('');

    const [nameGym, setNameGym] = useState('');

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const [confPassword, setConfPassword] = useState('');
    const [confPasswordError, setConfPasswordError] = useState('');

    const [gender, setGender] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/gender', {
            'method': 'GET',
            'headers': {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json()).then((data) => setGender(data)).catch((err) => console.log(err))
    }, []);
    

    const nameValidate = () => {
        if(userName.trim().length <= 3) {
            setUserNameError('Nome deve conter no mínimo 3 caracteres');
            setUserNameSuccess('');
            return false;
        }

        setUserNameError('');
        setUserNameSuccess('Nome válido');
        return true;
    }


    const birthDateValidate = () => {
    if(!birthDate) {
      setBirthDateError("Preencha a data de nascimento.");
      return false;
    }

    const selectedDate = new Date(birthDate);
    const today = new Date();

    if(selectedDate > today) {
      setBirthDateError('A data não pode ser no futuro.');
      return false;
    }

    //Exemplo: idade mínima de 18 anos
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();

    const isUnderage = age < 18 || (age === 18 && (monthDiff === 0 && dayDiff === 0));

    if(isUnderage) {
      setBirthDateError("O aluno deve ter pelo menos 12 anos.");
      return false;
    }

    setBirthDateError('');
    return true;

   }
    
    const emailValidate = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
        setEmailError("Formato de e-mail inválido.");
        setEmailSuccess("");
        return false;
        } else {
        setEmailError("");
        setEmailSuccess("E-mail válido!");
        return true;
        }
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    const passwordValidate = () => {
        if(password.trim().length < 8) {
            setPasswordError('Sua senha deve conter no mínimo 8 caracteres');         
            return false;
        }

        setPasswordError('');
        return true;
    }


    const confirmPassword = () => {
        if(confPassword.trim() !== password.trim()) {
            setConfPasswordError('As senhas não coincidem');
            return false;
        }

        setConfPasswordError('');
        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isNameValid = nameValidate();
        const isBirthDateValid = birthDateValidate();
        const isEmailValid = emailValidate(email);
        const isPasswordValid = passwordValidate();
        const isConfPasswordValid = confirmPassword();


        if(isNameValid && isBirthDateValid && isEmailValid && isPasswordValid && isConfPasswordValid && selectedGender) {
            const instructor = {
                id: Date.now(),
                name: userName,
                gender: selectedGender,
                birthday: birthDate,
                cpf: cpf,
                rg: rg,
                email: email,
                phone: phone,
                password: password
            }

            try {
                const response = await fetch('http://localhost:5000/instructor', {
                    'method': 'POST',
                    'headers' : {'Content-Type': 'application/json'},
                    'body': JSON.stringify(instructor)
                });

                if(!response.ok) throw new Error('Erro ao cadastrar instrutor');

                const newInstructor = await response.json();

                //Passa o ID do instrutor via state
                navigate('/home', {state: {id: newInstructor.id}});
            } catch(error) {
                alert(error.message);
            }            
        }
    }

    return(
        <>
            <Logo />
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.form_header}>
                    <i id={styles.ititle}><FaClipboard /></i>
                    <h2>Cadastro de Instrutor</h2>
                </div>

                <div className={styles.fieldset}>
                    <div>
                        <h3>Dados Pessoais</h3>
                    </div>
                    <div className={styles.form_divisions}>
                        <div className={styles.form_body}>
                            <i className={styles.icon}><FaUser /></i>
                            <label>Nome Completo:</label>
                            <Input type='text' value={userName} className={userNameError ? styles.input_error : userNameSuccess ? styles.input_success : ''} onChange={(e) => setUserName(e.target.value)} onInput={nameValidate} />
                            {userNameError && <p className={styles.error}>{userNameError}</p>}
                            {userNameSuccess && <p className={styles.success}>{userNameSuccess}</p>}
                        </div>

                        <div className={styles.form_body}>
                            <i className={styles.icon}><FaVenusMars /></i>
                            <label>Sexo:</label>
                            <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                                <option disabled value=''>Selecione uma opção</option>
                                {gender.map((option) => (
                                    <option key={option.id} value={option.name}>{option.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.form_body}>
                            <i className={styles.icon}><FaBirthdayCake /></i>
                            <label>Data de Nascimento:</label>
                            <Input type='date' value={birthDate} onChange={(e) => setBirthDate(e.target.value)} onBlur={birthDateValidate} />
                            {birthDateError && <p className={styles.error}>{birthDateError}</p>}
                        </div>    

                    </div>

                </div>

                
            <div className={styles.fieldset}>
                <h3>Identificação Civil</h3>
                <div className={styles.form_divisions}>      
                <div className={styles.form_body}>
                    <i className={styles.icon}><FaIdCard /></i>
                    <label>CPF:</label>
                    <Input type='text' value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder='000.000.000-00' />
                </div>
                
                <div className={styles.form_body}>
                    <i className={styles.icon}><FaFingerprint /></i>
                    <label>RG:</label>
                    <Input type='text' value={rg} onChange={(e) => setRg(e.target.value)} placeholder='00.000.000-0' />
                </div>
                </div>
            </div>



                <div className={styles.fieldset}>
                    <h3>Contato</h3>

                    <div className={styles.form_divisions}>
                        <div className={styles.form_body}>
                            <i className={styles.icon}><FaEnvelope /></i>
                            <label>E-mail:</label>
                            <Input type='email' value={email} className={emailError ? styles.input_error : emailSuccess ? styles.input_success : ''} onChange={(e) => setEmail(e.target.value)} onInput={emailValidate} />
                            {emailError && <p className={styles.error}>{emailError}</p>}
                            {emailSuccess && <p className={styles.success}>{emailSuccess}</p>}
                        </div>

                        <div className={styles.form_body}>
                            <i className={styles.icon}><FaPhone /></i>
                            <label>Telefone:</label>
                            <Input type='text' value={phone} placeholder='(00) 0 0000-0000' onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} />
                        </div>


                        <div className={styles.form_body}>
                            <i className={styles.icon}><FaDumbbell /></i>
                            <label>Nome da Academia:</label>
                            <Input type='text' value={nameGym} placeholder='Ex.: Smart Fit' onChange={(e) => setNameGym(e.target.value)} />
                        </div>

                    </div>
                </div>

                <div className={styles.fieldset}>
                    <h3>Segurança</h3>

                    <div className={styles.form_divisions}>
                        <div className={styles.form_body}>
                            <i className={styles.icon}><FaLock /></i>
                            <label>Senha:</label>
                            <Input type={showPassword ? 'text' : 'password'} value={password} className={passwordError ? styles.input_error : ''} onChange={(e) => setPassword(e.target.value)} onInput={passwordValidate}/>
                            <i id={styles.eyeIcon} onClick={togglePassword}>{showPassword ? <FaEyeSlash /> : <FaEye />}</i>
                            {passwordError && <p className={styles.error}>{passwordError}</p>}
                        </div>

                        <div className={styles.form_body}>
                            <i className={styles.icon}><FaLock /></i>
                            <label>Confirmar Senha:</label>
                            <Input type={showPassword ? 'text' : 'password'} value={confPassword} className={confPasswordError ? styles.input_error : ''} onChange={(e) => setConfPassword(e.target.value)} onInput={confirmPassword}/>
                            <i id={styles.eyeIcon} onClick={togglePassword}>{showPassword ? <FaEyeSlash /> : <FaEye />}</i>
                            {confPasswordError && <p className={styles.error}>{confPasswordError}</p>}
                        </div>
                    </div>
                </div>

                <div style={{textAlign: "center"}}>
                    <button type="submit">Cadastrar</button>
                </div> 
            </form>
        </>
    )
}