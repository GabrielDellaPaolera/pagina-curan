import './header.css';
import { Link } from 'react-router-dom';


export default function Header() {
return (
 <header> 

     <Link className="logo" to="/">Inicio</Link>
     <Link className="logo" to="/Sobre">Sobre Mim </Link>
     <Link className="logo" to="/Contato">Contato</Link>
     <Link className="logo" to="/Consultas">Minhas consultas</Link>

 </header>

  );
}