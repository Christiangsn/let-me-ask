import copyImg from '../assets/images//copy.svg'

import '../styles/roomCode.scss';

type RoomCodeProps = {
    code: string;

}

export function RoomCode(props: RoomCodeProps) {

    async function copyRoomCodeToClipBoard() {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button className="room-code" onClick={copyRoomCodeToClipBoard}>
            <div className="room-code">
                <img src={copyImg} alt="Copy Room Code" />
            </div>
            <span> Sala #{props.code} </span>
        </button>
    )

}