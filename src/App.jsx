import {Routes, Route} from 'react-router-dom';
import { Student } from './components/pages/Student';
import { Login } from './components/pages/Login';
import { StudentList } from './components/pages/StudentList';
import { Home } from './components/pages/Home';
import { SignupForm } from './components/pages/SignupForm';
import styles from './App.module.css';
import { PhysicalForm } from './components/pages/PhysicalForm';
import { Instructor } from './components/pages/Instructor';

function App() {
  return(
    <div className={styles.app}>
      <div className={styles.container}>
        {/* <h1 className={styles.h1}><span className={styles.span}>&#8593;Up</span>Fit</h1> */}
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/instructor' element={<Instructor />} />
          <Route path='/signup' element={<SignupForm />} />
          <Route path='/home' element={<Home />} />
          <Route path='/physical' element={<PhysicalForm />} />
          <Route path='/students' element={<StudentList />} />
          <Route path='/student/:id' element={<Student />} />
        </Routes>
      </div>
    </div>  
  )
}

export default App;