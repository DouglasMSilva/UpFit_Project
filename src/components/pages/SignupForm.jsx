import { useEffect, useState } from 'react';

import { Logo } from '../layout/Logo';

import { useNavigate } from 'react-router-dom';

import styles from './SignupForm.module.css'

import { Input } from '../form/Input';

import {FaUser, FaBullseye, FaVenusMars, FaEnvelope, FaBirthdayCake, FaPhone, FaLock, FaEye, FaEyeSlash, FaDumbbell, FaClipboard, FaInstagram, FaDollarSign, FaFingerprint, FaIdCard, FaClock} from 'react-icons/fa';

export const SignupForm = () => {

  //Nome
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [nameSuccess, setNameSuccess] = useState('');

  //Sexo
  const [gender, setGender] = useState([]);
  //Seleção do Sexo
  const [selectedGender, setSelectedGender] = useState('');

  //Data de Nascimento
  const [birthDate, setBirthDate] = useState('');
  const [birthDateError, setBirthDateError] = useState('');

  //CPF
  const [cpf, setCpf] = useState('');
  //RG
  const [rg, setRg] = useState('');

  //E-mail
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  
  //Telefone
  const [phone, setPhone] = useState('');

  //Instagram
  const [insta, setInsta] = useState('');

  //Senha
  const [password, setPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  //Mostrar Senha
  const [showPassword, setShowPassword] = useState(false);


  //Formas de Pagamento
  const [payment, setPayment] = useState([]);
  //Seleção da forma de pagamento
  const [selectedPayment, setSelectedPayment] = useState('');
    
  //Categorias de Atividades
  const [categories, setCategories] = useState([]);
  //Seleção de Atividade
  const [selectedCategory, setSelectedCategory] = useState('');


  //Tempo de Treino
  const [timeTraining, setTimeTraining] = useState([]);
  //Seleção de tempo de treino
  const [selectedTimeTraining, setSelectedTimeTraining] = useState('');

  //Objetivo
  const [goal, setGoal] = useState('');

  const navigate = useNavigate();

  const loggedInstructor = JSON.parse(localStorage.getItem('loggedInstructor')) || { name: '' };



  useEffect(() => {
    fetch('http://localhost:5000/gender', {
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then((data) => setGender(data)).catch((err) => console.log(err))
  }, []);


  useEffect(() => {
    fetch('http://localhost:5000/categories', {
      'method': 'GET',
      'headers': {
        'Content-Type' : 'application/json'
      }
    }).then((res) => res.json()).then((data) => setCategories(data)).catch((err) => console.log(err))
  }, []);


  useEffect(() => {
    fetch('http://localhost:5000/payments', {
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then((data) => setPayment(data)).catch((err) => console.log(err))
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/time', {
      'method': 'GET',
      'headers': {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then((data) => setTimeTraining(data)).catch((err) => console.log(err))
  }, []);


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

    //Exemplo: idade mínima de 12 anos
    const age = today.getFullYear() - selectedDate.getFullYear();
    const monthDiff = today.getMonth() - selectedDate.getMonth();
    const dayDiff = today.getDate() - selectedDate.getDate();

    const isUnderage = age < 12 || (age === 12 && (monthDiff === 0 && dayDiff === 0));

    if(isUnderage) {
      setBirthDateError("O aluno deve ter pelo menos 12 anos.");
      return false;
    }

    setBirthDateError('');
    return true;

  }

  function togglePassword() {
    setShowPassword(!showPassword);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    //const loggedInstructor = JSON.parse(localStorage.getItem('loggedInstructor'));

    if(!loggedInstructor) {
      alert('Você precisa estar logado como instrutor para cadastrar um aluno.');
      return;
    }

    const isNameValid = nameValidate();
    const isBirthValid = birthDateValidate();

    const isEmailValid = emailValidate(email);
    const isPasswordValid = passwordValidate();
    if(isNameValid && isBirthValid && isEmailValid && isPasswordValid) {
      //salvar os dados

      const studentData = {
        name,
        gender: selectedGender,
        birthDate,
        cpf,
        rg,
        email,
        phone,
        insta,
        password,
        payment: selectedPayment,
        categories: selectedCategory,
        timeTraining: selectedTimeTraining,
        goal,
        instructorId: loggedInstructor.id,
        instructorName: loggedInstructor.name
      };

      try {
        const response = await fetch('http://localhost:5000/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });

        if (!response.ok) throw new Error('Erro ao cadastrar aluno.');

        const newStudent = await response.json();
        
        //Passa o ID para o PhysicalForm via state
        navigate('/physical', {state: {id: newStudent.id}});
      } catch (error) {

        alert(error.message);
      }  
    }
  }

  const nameValidate = () => {
      if(name.trim().length < 3) {
      setNameError("Nome deve ter no mínimo 4 caracteres.");
      setNameSuccess("");
      return false;
    } else {
      setNameError("");
      setNameSuccess("Nome válido!");
      return true;
    }

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


  const passwordValidate = () => {
    if (password.length < 8) {
      setPasswordError("Sua senha deve conter no mínimo 9 caracteres");
      setPasswordSuccess("");
      return false;
    } else {
      setPasswordError("");
      setPasswordSuccess("Senha válida!");
      return true;
    }
  }


  return (
    <>
     <Logo />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.form_header}>
          <i id={styles.ititle}><FaClipboard /></i>
          <h2>Cadastro do aluno</h2>
        </div>

      <div className={styles.fieldset}>
        <h3>Dados Pessoais</h3>
        <div className={styles.form_divisions}>
          <div className={styles.form_body}>
            <i className={styles.icon}><FaUser /></i>
            <label>Nome Completo:</label>
            <Input type="text" className={nameError ? styles.input_error : nameSuccess ? styles.input_success : ''} value={name} onChange={(e) => setName(e.target.value)} onInput={nameValidate} />
            {nameError && <p className={styles.error}>{nameError}</p>}
            {nameSuccess && <p className={styles.success}>{nameSuccess}</p>}
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
            <Input type="email" className={emailError ? styles.input_error : emailSuccess ? styles.input_success : ''} value={email} onChange={(e) => setEmail(e.target.value)} onInput={(e) => emailValidate(e.target.value)}/>
            {emailError && <p className={styles.error}>{emailError}</p>}
            {emailSuccess && <p className={styles.success}>{emailSuccess}</p>}
          </div>

          <div className={styles.form_body}>
            <i className={styles.icon}><FaPhone /></i>
            <label>Telefone:</label>
            <Input type='tel' id={styles.form_input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='(00) 00000-000' />
          </div>

          <div className={styles.form_body}>
            <i className={styles.icon}><FaInstagram /></i>
            <label>Instagram:</label>
            <Input type='text' id={styles.form_input} value={insta} onChange={(e) => setInsta(e.target.value)} />
          </div>

        </div>
      </div>          




        <div className={styles.fieldset}>
          <h3>Segurança</h3>
          <div className={styles.form_divisions}>
            <div className={styles.form_body}>
              <i className={styles.icon}><FaLock /></i>
              <label>Senha:</label>
              <Input type={showPassword ? "text" : "password"} className={passwordError ? styles.input_error : passwordSuccess ? styles.Input_success : ''} value={password} onChange={(e) => setPassword(e.target.value)} onInput={passwordValidate}/>
              <i id={styles.eyeIcon} onClick={togglePassword}>{showPassword ? <FaEyeSlash /> : <FaEye />}</i>
              {passwordError && <p className={styles.error}>{passwordError}</p>}
              {passwordSuccess && <p className={styles.success}>{passwordSuccess}</p>}
            </div>

            <div className={styles.form_body}>
              <i className={styles.icon}><FaDollarSign /></i>
              <label>Forma de Pagamento:</label>
              <select value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value)}>
                <option value='' disabled>Selecione uma opção</option>
                {payment.map((option) => (
                  <option key={option.id} value={option.name}>{option.name}</option>
                ))}
              </select>

            </div>
          </div>
        </div>

      <div className={styles.fieldset}>  
        <h3>Treino</h3>
        <div className={styles.form_divisions}>
          <div className={styles.form_body}>
            <i className={styles.icon}><FaDumbbell /></i>
            <label>Frequência:</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option disabled value=''>Selecione uma opção</option>
              {categories.map((option) => (
                <option key={option.id} value={option.name}>{option.name}</option>
              ))}
            </select>
          </div>


          <div className={styles.form_body}>
            <i className={styles.icon}><FaClock /></i>
            <label>Tempo:</label>
            <select value={selectedTimeTraining} onChange={(e) => setSelectedTimeTraining(e.target.value)}>
              <option disabled value=''>Selecione uma opção</option>
              {timeTraining.map((option) => (
                <option key={option.id} value={option.name}>{option.name}</option>
              ))}
            </select>
          </div>


          {loggedInstructor && (
            <div className={styles.form_body}>
              <label>Instrutor:</label>
              <input type="text" value={loggedInstructor.name} readOnly className={styles.input_readonly}/>
            </div>
          )}


          <div className={styles.form_body}>
            <i className={styles.icon}><FaBullseye /></i>
            <label>Objetivo:</label>
            <Input type='text' value={goal} onChange={(e) => setGoal(e.target.value)} placeholder='Ex.: Hipertrofia'/>
          </div>

        </div>

      </div>   

        <div className={styles.form_button}>
            <button className={styles.btn} type='submit'>Enviar</button>
        </div>
       
      </form>
    </>
  )
}
