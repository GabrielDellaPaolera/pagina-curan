import {BrowserRouter, Route,Routes} from 'react-router-dom'

import Home from '../Pages/Home'
import Header from '../Components/Header'
import Sobre from '../Pages/Sobre'
import Contato from '../Pages/Contato'
import Consultas from '../Pages/Consultas'
import NovaConsulta from '../Pages/NovaConsulta'

export default function RoutesApp() {
    return (
    <BrowserRouter>
    <Header />
      <Routes>
          <Route path = "/" element= {<Home/>} />
          <Route path = "/Sobre" element= {<Sobre/>} />
          <Route path = "/Contato" element= {<Contato/>} />
          <Route path = "/Consultas" element= {<Consultas/>} />
          <Route path = "/NovaConsulta" element= {<NovaConsulta/>} />
       </Routes>
    </BrowserRouter>
   
   );
}