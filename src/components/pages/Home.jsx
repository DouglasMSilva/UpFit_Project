import { Navbar } from "../layout/Navbar";
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import styles from './Home.module.css';

export const Home = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/students').then((res) => {
      if(!res.ok) {
        throw new Error('Erro ao buscar alunos');
      }
      return res.json();
    }).then((data) => setStudents(data)).catch((err) => console.log(err));

  }, []);


  return (
    <>
    <Navbar />
    <div className={styles.container}>
      <h1 className={styles.h1}>Alunos Cadastrados</h1>

      <Link to='/' className={styles.addButton}>Cadastrar Novo Aluno</Link>

      {students.length === 0 ? (
        <p>Nenhum aluno encontrado.</p>
      ) : (
        <ul className={styles.list}>
          {students.map((student) => (
            <li key={student.id} className={styles.listItem}>
              <strong>{student.name}</strong> - {student.phone}
              <Link to={`/student/${student.id}`} className={styles.button}>Ver Detalhes</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  )
}

