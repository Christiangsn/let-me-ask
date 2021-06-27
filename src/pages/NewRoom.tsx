import { Link } from 'react-router-dom';
// import { AuthContext } from '../contexts/AuthContext';
// import { useContext } from 'react';
import ilustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';

export function NewRoom() {
    // const { user } = useContext(AuthContext);

    return (
        <div id="page-auth">
            <aside>
                <img src={ilustrationImg} alt="Ask e Questions" />
                <strong>Crie sala de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask"/>
                    <h2>Criar uma nova Sala</h2>
                    <form>
                        <input 
                            type="text" 
                            placeholder="Nome da Sala"
                        />
                        <Button type="submit">
                            Cria Sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
                    </p>

                </div>
            </main>
        </div>
    )
}