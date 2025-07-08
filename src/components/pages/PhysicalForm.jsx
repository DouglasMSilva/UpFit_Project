import { FaClipboard} from 'react-icons/fa';
import { Input } from '../form/Input';
import { useState } from 'react';
import styles from './SignupForm.module.css';
import { useNavigate } from 'react-router-dom';
import {useLocation} from 'react-router-dom';

export const PhysicalForm = () => {

    const location = useLocation();

    const studentId = location.state?.id;

    //Altura
    const [height, setHeight] = useState('');

    //Peso
    const [weight, setWeight] = useState('');

    //IMC
    const [imc, setImc] = useState('');
    const [imcError, setImcError] = useState('');
    const [imcSuccess, setImcSuccess] = useState('');

    //Percentual de Gordura
    const [bf, setBf] = useState('');

    //Massa Muscular
    const [mm, setMm] = useState('');

    //Peitoral
    const [chest, setChest] = useState('');

    //Circunferência Abdominal
    const [abd, setAbd] = useState('');

    //Massa Gorda
    const [fatMass, setFatMass] = useState('');

    //Massa Magra
    const [leanMass, setLeanMass] = useState('');

    //Bíceps Direito Relaxado
    const [relRightBiceps, setRelRightBiceps] = useState('');

    //Bíceps Direito Contraído
    const [contRightBiceps, setContRightBiceps] = useState('');

    //Coxa Direita
    const [rightLeg, setRightLeg] = useState('');

    //Bíceps Esquerdo Relaxado
    const [relLeftBiceps, setRelLeftBiceps] = useState('');

    //Bíceps Esquerdo Contraído
    const [contLeftBiceps, setContLeftBiceps] = useState('');

    //Coxa Direita
    const [leftLeg, setLeftLeg] = useState('');


    //Idade Metabólica
    const [metabAge, setMetabAge] = useState('');

    //Gordura Visceral
    const [viscFat, setViscFat] = useState('');

    const navigate = useNavigate();

    const bodyCompCalc = () => {
        if (!weight || !bf) return;

        const kgWeight = parseFloat(weight);
        const bodyFat = parseFloat(bf);

        const userFatMass = (kgWeight * bodyFat / 100).toFixed(2);
        const userLeanMass = (kgWeight - userFatMass).toFixed(2);

        setFatMass(userFatMass);
        setLeanMass(userLeanMass);
    };



    function changeHeight(e) {
        const num = e.target.value.replace(/[^0-9]/g, '');
        setHeight(num);
    }

    function changeWeight(e) {
        const num = e.target.value.replace(/[^0-9]/g, '');
        setWeight(num);
    }

    const imcValidate = () => {
        if (!height || !weight) return;
        const metersHeight = parseFloat(height)/100;
        const result = parseFloat(weight / (metersHeight**2));
        const finalResult = result.toFixed(2);
        setImc(finalResult);
        if(finalResult < 18.5) {
            setImcError('Baixo Peso');
            setImcSuccess('');
        }
        else if(finalResult >= 18.5 && finalResult <= 24.9) {
            setImcError('');
            setImcSuccess('Normal');
        }
        else if(finalResult >= 25 && finalResult <= 29.9) {
            setImcError('Sobrepeso');
            setImcSuccess('');
        }
        else if(finalResult >= 30) {
            setImcError('Obeso');
            setImcSuccess('');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!studentId) {
            alert('Erro: aluno não identificado.');
            return;
        }

        if(height && weight && imc && abd && mm && bf && fatMass && leanMass && chest && relRightBiceps && contRightBiceps && relLeftBiceps && contLeftBiceps && metabAge && viscFat) {
            
            const physicalData = {
            height,
            weight,
            imc,
            imcError,
            imcSuccess,
            bf,
            mm,
            chest,
            abd,
            fatMass,
            leanMass,
            relRightBiceps,
            contRightBiceps,
            relLeftBiceps,
            contLeftBiceps,
            rightLeg,
            leftLeg,
            metabAge,
            viscFat,
            };

            try {
                const response = await fetch(`http://localhost:5000/students/${studentId}`, {
                   method: 'PATCH',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({physicalData}) 
                });

                if(!response.ok) throw new Error('Erro ao atualizar dados físicos.');

                //Navega para home após atualizar
                navigate('/', {state: {message: 'Cadastro concluído com sucesso.'}});
            } catch (error) {
                alert(error.message);
            }
        }
        
    }

    return(
        <>
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.form_header}>
                <i id={styles.ititle}><FaClipboard /></i>
                <h2>Cadastro do aluno</h2>
            </div>

            <div className={styles.fieldset}>
                 <h3>Bioimpedância</h3>

                <div className={styles.form_divisions}>
                    <div className={styles.form_body}>
                        
                        <label>Altura(cm.):</label>
                        <Input type='text' value={height} placeholder='Ex.: 180' onChange={changeHeight}/>
                    </div>
                   
                   
                    <div className={styles.form_body}>
                     
                        <label>Peso(kg.):</label>
                        <Input type='text' value={weight} placeholder='Ex.: 90' onChange={changeWeight}/>
                    </div>

                    <div className={styles.button_division}>
                        <button onClick={imcValidate}>Calcular IMC</button>
                        {imc && <p>{imc}</p>}
                        {imcError && <p className={styles.error}>{imcError}</p>}
                        {imcSuccess && <p className={styles.success}>{imcSuccess}</p>}
                    </div>


                </div>

            </div>

            <div className={styles.fieldset}>
               

                <div className={styles.form_divisions}>
                    <div className={styles.form_body}>
                        
                        <label>Massa Muscular:</label>
                        <Input type='text' value={mm} onChange={(e) => setMm(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>

                    <div className={styles.form_body}>
                        <label>% de Gordura(%):</label>
                        <Input type='text' value={bf} onChange={(e) => setBf(e.target.value.replace(/[^0-9]/g, ''))} />
                    </div>

                    <div className={styles.form_body}>
                        <label>Circ. Abdominal(cm.):</label>
                        <Input type='text' value={abd} onChange={(e) => setAbd(e.target.value.replace(/[^0-9]/g, ''))} />
                    </div>

                    <div className={styles.form_body}>
                        <label>Peitoral(cm.):</label>
                        <Input type='text' value={chest} onChange={(e) => setChest(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>

                </div>

                <div className={styles.form_divisions}>


                    <div className={styles.form_body}>
                        <label>Massa Gorda:</label>
                        <Input type='text' value={fatMass} onChange={(e) => setFatMass(e.target.value.replace(/[^0-9]/g, ''))} />
                    </div>

                    <div className={styles.form_body}>
                        <label>Massa Magra:</label>
                        <Input type='text' value={leanMass} onChange={(e) => setLeanMass(e.target.value.replace(/[^0-9]/g, ''))} />
                    </div>


                    <div className={styles.button_division}>
                        <button type="button" onClick={bodyCompCalc}>Calcular Massa Corporal</button>
                        {fatMass && <p>Massa Gorda: {fatMass} kg</p>}
                        {leanMass && <p>Massa Magra: {leanMass} kg</p>}
                    </div>

                </div>

                <div className={styles.form_divisions}>

                    <div className={styles.form_body}>
                        <label>Bíceps Direito Relaxado(cm.):</label>
                        <Input type='text' value={relRightBiceps} onChange={(e) => setRelRightBiceps(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>

                    <div className={styles.form_body}>
                        <label>Bíceps Esquerdo Relaxado(cm.):</label>
                        <Input type='text' value={relLeftBiceps} onChange={(e) => setRelLeftBiceps(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>

                    
                    <div className={styles.form_body}>
                        <label>Bíceps Direito Contraído(cm.):</label>
                        <Input type='text' value={contRightBiceps} onChange={(e) => setContRightBiceps(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>

                    <div className={styles.form_body}>
                        <label>Bíceps Esquerdo Contraído(cm.):</label>
                        <Input type='text' value={contLeftBiceps} onChange={(e) => setContLeftBiceps(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>


                </div>

                <div className={styles.form_divisions}>

                    <div className={styles.form_body}>
                        <label>Coxa Direita(cm.):</label>
                        <Input type='text' value={rightLeg} onChange={(e) => setRightLeg(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>

                    <div className={styles.form_body}>
                        <label>Coxa Esquerda(cm.):</label>
                        <Input type='text' value={leftLeg} onChange={(e) => setLeftLeg(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>

                    <div className={styles.form_body}>
                        <label>Idade Metabólica:</label>
                        <Input type='text' value={metabAge} onChange={(e) => setMetabAge(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>    

                    <div className={styles.form_body}>
                        <label>Gordura Visceral:</label>
                        <Input type='text' value={viscFat} onChange={(e) => setViscFat(e.target.value.replace(/[^0-9]/g, ''))}/>
                    </div>  
                    
                </div>

                <button className={styles.btn} type='submit'>Enviar</button>

            </div>

           

        </form>
        </>
    )


}