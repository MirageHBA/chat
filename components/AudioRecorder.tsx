import React, { useState, useRef } from 'react';
import { MicrophoneIcon, StopIcon, SendIcon, TrashIcon } from './icons';

interface AudioRecorderProps {
    onSendAudio: (audioUrl: string, audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSendAudio }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setAudioBlob(blob);
                audioChunksRef.current = [];
                 // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const handleSend = () => {
        if (audioUrl && audioBlob) {
            onSendAudio(audioUrl, audioBlob);
            reset();
        }
    };

    const reset = () => {
        setAudioUrl(null);
        setAudioBlob(null);
        setIsRecording(false);
    }

    if (audioUrl) {
        return (
            <div className="flex items-center space-x-2 p-2">
                <audio src={audioUrl} controls className="h-8 max-w-[150px]"/>
                <button onClick={reset} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                    <TrashIcon className="w-5 h-5"/>
                </button>
                <button onClick={handleSend} className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">
                    <SendIcon className="w-5 h-5"/>
                </button>
            </div>
        )
    }

    return (
        <button onClick={isRecording ? stopRecording : startRecording} className={`p-2 transition-colors ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-cyan-400'}`}>
            {isRecording ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
        </button>
    );
};

export default AudioRecorder;
