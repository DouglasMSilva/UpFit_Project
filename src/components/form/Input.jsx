import styles from './Input.module.css';

export const Input = ({type, value, placeholder, onChange, onInput, style}) => {
    return(
        <>
            <input type={type} className={styles.form_input} value={value} placeholder={placeholder} onChange={onChange} onInput={onInput} style={style} />
        </>
    )
}