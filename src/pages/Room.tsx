import { FormEvent, useEffect,  useState } from 'react';
import { useParams } from 'react-router-dom';


import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';

import '../styles/room.scss'
import { db } from '../services/firebase';

import { toast } from "react-hot-toast";

type firebaseQuestion = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}

type RoomParams = {
    id: string;
}

export function Room () {
    const {user} = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] =  useState<Question[]>([]);
    const [title, setTitle] = useState('');

    useEffect( () => {
        const roomRef = db.ref(`rooms/${params.id}`);
        roomRef.on('value', room => {
            const dbRoom  = room.val();
            const firabaseQuestion: firebaseQuestion = dbRoom.questions ?? {};

            const parsedQuestions = Object.entries(firabaseQuestion).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            })
            setTitle(dbRoom.title)
            setQuestions(parsedQuestions)
        })
    }, [params.id])

    const sucessNotify = () => toast.success("Sucess!");

    async function handleSendQuestion (event: FormEvent) {
        event.preventDefault();
        
        if(newQuestion.trim() == '') {
            return;
        }

        if(!user) {
            toast.error('ou must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false,
            isAnsweet: false
        }

        await db.ref(`rooms/${params.id}/questions`).push(question);
        sucessNotify();
        return setNewQuestion('');
        
    }

    return (
       <div id="page-room">
           <header>
               <div className="content">
                   <img src={logoImg} alt="Letmeask" />
                   <RoomCode code={params.id}/>
               </div>
           </header>

           <main>
               <div className="room-title">
                   <h1>Sala {title}</h1>
                   { questions.length > 0 && <span> {questions.length} Perguntas</span>}
               </div>

               <form onSubmit={handleSendQuestion}>
                   <textarea 
                      placeholder="O que você quer perguntar?"
                      onChange={event => setNewQuestion(event.target.value)}
                      value={newQuestion}
                   />  

                   <div className="form-footer">
                       { user ? (
                           <div className="user-info">
                               <img src={user.avatar} alt={user.name} />
                               <span>{user.name}</span>
                           </div>
                       ) : (
                        <span>Para Enviar uma pergunta,
                            <button> faça seu login! </button>
                        </span>
                       ) }

                       <Button type="submit" disabled={!user}>Enviar Pergunta</Button>
                   </div>                    
               </form>

               {JSON.stringify(questions)}

           </main>
       </div>
    );


}