import './header.css';
import Logo from '../../assets/logoCuran.png'; // Certifique-se de que o caminho está correto
import { Link } from 'react-router-dom';


export default function Header() {
return (
 <header>
      <Link to="/" className="logo">
         <img src={Logo} alt="Logo" />
     </Link>
     <Link className="link" to="/">Inicio</Link>
     <Link className="link" to="/Sobre">Sobre Mim </Link>
     <Link className="link" to="/Contato">Contato</Link>
     <Link className="link" to="/Consultas">Minhas consultas</Link>

 </header>

  );
}