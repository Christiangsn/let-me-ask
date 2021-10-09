import { useHistory, useParams } from 'react-router-dom';
import { db } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import { Button } from '../../components/Buttons';
import { RoomCode } from '../../components/Room';
// import { useAuth } from '../../hooks/useAuth';

import './room.scss'
// import { db } from '../../services/firebase';

// import { toast } from "react-hot-toast";
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';



type RoomParams = {
    id: string;
}

export function AdminRoom () {
    // const {user} = useAuth();
    const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id
    const { questions, title } = useRoom(roomId);

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Deseja mesmo excluir esta pergunta?')) {
            await db.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleEndRoom() {
        console.log('fechou a sala', roomId)
        await db.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })

        history.push('/')
    }


    return (
       <div id="page-room">
           <header>
               <div className="content">
                   <img src={logoImg} alt="Letmeask" />
                   <div>
                        <RoomCode code={params.id}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                   </div>
               </div>
           </header>

           <main>
               <div className="room-title">
                   <h1>Sala {title}</h1>
                   { questions.length > 0 && <span> {questions.length} Perguntas</span>}
               </div>

               <div className="question-list">
                {questions.map((question) => {
                    console.log(question)
                    return (
                        <Question 
                            key={question.id}
                            content={question.content}
                            author={question.author}
                        > 

                        <button
                            type="button"
                            onClick={() => handleDeleteQuestion(question.id)}
                        
                        >
                            <img src={deleteImg} alt="Remover pergunta" />
                        </button>
                        </Question>
                    )
                })}
               </div>

           </main>
       </div>
    );


}