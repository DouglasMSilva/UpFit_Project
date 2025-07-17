import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Student.module.css';
import { Message } from '../layout/Message';
import { Input } from '../form/Input';

export function Student() {

  const navigate = useNavigate();
    
  const [student, setStudent] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const { id } = useParams();

  const location = useLocation();

   const message = location.state?.message || '';

  useEffect(() => {

      fetch(`http://localhost:5000/students/${id}`).then((res) => {
        if(!res.ok) throw new Error('Aluno não encontrado');
        return res.json();
      }).then((data) => setStudent(data)).catch(() => navigate('/home')) //Redireciona se não achar



  }, [id, navigate]);

  if(!student) return <p>Carregando...</p>;
 

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/students/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao remover aluno');
      alert('Aluno removido com sucesso.');
      navigate('/home');
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/students/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(student),
      });
      if(!res.ok) throw new Error('Erro ao salvar alterações');
      alert('Alterações salvas com sucesso.');
      setIsEditing(false);
    } catch (err) {
      alert(err.message);
    }
  }


  return (
    <div>
      <h1 className={styles.h1}>Alunos</h1>
      {message && <Message type='success' msg={message} />}

      <div className={styles.fieldset}>
        <h3>Dados Pessoais</h3>
        <div className={styles.form_divisions}>
          {[
            ['Nome', student.name, 'name'],
            ['Gênero', student.gender, 'gender'],
            ['Data de Nascimento', student.birthDate, 'birthDate'],
            ['CPF', student.cpf, 'cpf'],
            ['RG', student.rg, 'rg'],
            ['Email', student.email, 'email'],
            ['Telefone', student.phone, 'phone'],
            ['Instagram', student.insta, 'insta'],
            ['Forma de Pagamento', student.payment, 'payment'],
            ['Categoria', student.category, 'category'],
            ['Tempo de Treino', student.timeTraining, 'timeTraining'],
            ['Objetivo', student.goal, 'goal'],
            ['Instrutor', student.instructorName || 'Não informado', 'instructorName'],
          ].map(([label, value, field], index) => (
            <div className={styles.form_body} key={index}>
              <label>{label}:</label>
              {isEditing && field !== 'instructorName' ? (
                <Input type='text' value={student[field] || ''} onChange={(e) => setStudent({...student, [field]: e.target.value})} />
              ) : (
                <span className={styles.text}>{value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {student.physicalData && (
        <div className={styles.fieldset}>
          <h3>Dados Físicos</h3>
          <div className={styles.form_divisions}>
            {[
              ['Altura (cm)', student.physicalData.height, 'height'],
              ['Peso (kg)', student.physicalData.weight, 'weight'],
              ['IMC', student.physicalData.imc, 'imc'],
              ['% Gordura', student.physicalData.bf, 'bf'],
              ['Massa Muscular', student.physicalData.mm, 'mm'],
              ['Massa Gorda', student.physicalData.fatMass, 'fatMass'],
              ['Massa Magra', student.physicalData.leanMass, 'leanMass'],
              ['Circ. Abdominal', student.physicalData.abd, 'abd'],
              ['Peitoral', student.physicalData.chest, 'chest'],
              ['Bíceps D. Relaxado', student.physicalData.relRightBiceps, 'relRightBiceps'],
              ['Bíceps D. Contraído', student.physicalData.contRightBiceps, 'contRightBiceps'],
              ['Bíceps E. Relaxado', student.physicalData.relLeftBiceps, 'relLeftBiceps'],
              ['Bíceps E. Contraído', student.physicalData.contLeftBiceps, 'contLeftBiceps'],
              ['Coxa Direita', student.physicalData.rightLeg, 'rightLeg'],
              ['Coxa Esquerda', student.physicalData.leftLeg, 'leftLeg'],
              ['Idade Metabólica', student.physicalData.metabAge, 'metabAge'],
              ['Gordura Visceral', student.physicalData.viscFat, 'viscFat'],
            ].map(([label, value, field], index) => (
              <div className={styles.form_body} key={index}>
                <label>{label}:</label>
                {isEditing ? (
                  <Input type='text' value={student.physicalData[field] || ''} onChange={(e) => setStudent({...student, physicalData: { ...student.physicalData, [field]: e.target.value}})} />
                ) : ( 
                <span className={styles.text}>{value}</span>) 
                } 
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{textAlign: 'center', marginTop: '2rem'}}>
        {isEditing ? (
          <button onClick={handleEdit} className={styles.saveButton}>Salvar</button>
        ) : (
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>Editar</button>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={handleDelete} className={styles.clearButton}>Remover Aluno</button>
      </div>
    </div>
  );
}
