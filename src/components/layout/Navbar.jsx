import {Link} from 'react-router-dom';
import styles from './Navbar.module.css';

export const Navbar = () => {
    return(
        <nav className={styles.navbar}>
            <h1 className={styles.h1}><span className={styles.span}>&#8593;Up</span>Fit</h1>
            <ul className={styles.navlist}>
                <li className={styles.item}><Link className={styles.nav_links} to='/'>Cadastrar Aluno</Link></li>
            </ul>
        </nav>
    )
}