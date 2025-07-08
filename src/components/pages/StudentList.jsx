// src/components/pages/StudentList.jsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import styles from './StudentList.module.css'; // Você pode criar esse CSS depois

export function StudentList() {
  
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Lista de Alunos</h1>

      {students.length === 0 ? (
        <p>Nenhum aluno cadastrado.</p>
      ) : (
        <ul className={styles.list}>
          {students.map(student => (
            <li key={student.id} className={styles.listItem}>
              <strong>{student.name}</strong> - {student.phone}
              <Link to={`/student/${student.id}`} className={styles.viewButton}>
                Ver detalhes
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
