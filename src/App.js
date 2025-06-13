import RoutesApp from './routes'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Components/Footer';


function App() {
  return (
    <div className="app-wrapper">
    <div className="app">
    <ToastContainer autoClose={3000} />
    <RoutesApp/>
      </div>
    <Footer />
    </div>
  );
}

export default App;
