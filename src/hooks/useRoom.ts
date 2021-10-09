import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";


type Questiontype = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likeCount: number;
    likeId: string | undefined;
}

type firebaseQuestion = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>


export function useRoom (roomId: string) {
    const { user } = useAuth();
    const [questions, setQuestions] =  useState<Questiontype[]>([]);
    const [title, setTitle] = useState('');

    useEffect( () => {
        const roomRef = db.ref(`rooms/${roomId}`);
        roomRef.on('value', room => {
            const dbRoom  = room.val();
            const firabaseQuestion: firebaseQuestion = dbRoom.questions ?? {};

            const parsedQuestions = Object.entries(firabaseQuestion).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            })
            setTitle(dbRoom.title)
            setQuestions(parsedQuestions)
        })

        return () => {
            roomRef.off('value')
        }
    }, [roomId, user?.id])

    return {questions, title}
    
}