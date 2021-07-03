import { useHistory } from 'react-router-dom';

import ilustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { db } from '../services/firebase';


export function Home() {
    const history = useHistory();
    const { user, signInWIthGoogle } = useAuth();
    const [roomCode, setRoomCode] = useState('');

    async function renderCreateRoom() {
        if(!user){
           await signInWIthGoogle();
        }

        history.push('/rooms/new');
    }
    
    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if(roomCode.trim() == ''){
            return;
        }

        const roomRef = await db.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()) {
            alert('Room does not exists');
            return;
        }

        history.push(`/rooms/${roomCode}`);

    }


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
                    <button onClick={renderCreateRoom} className="google-auth">
                        <img src={googleIconImg} alt="Logo do google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">
                        Ou entre em uma sala
                    </div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                            type="text" 
                            placeholder="Digite o código da Sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entar na Sala
                        </Button>
                    </form>

                </div>
            </main>
        </div>
    )

}