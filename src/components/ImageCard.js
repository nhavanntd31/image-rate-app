import React, { useState, useRef } from 'react';

const ImageCard = ({ image, data, onChange, onClick }) => {
  const [recognizing, setRecognizing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  let recognition;

  if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setRecognizing(true);
    };

    recognition.onend = () => {
      setRecognizing(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(image, 'comment', transcript);
    };
  } else {
    console.warn('Web Speech API is not supported in this browser.');
  }

  const handleStartRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
      onChange(image, 'audio', audioUrl);
    };
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <div className="image-card">
      <img
        className="image-pic"
        onClick={onClick}
        src={`/data1/${image}.png`}
        alt={`Representation of ${image}`}
      />
      <div className="image-id">ID: {image}</div>
      <div>
        <label className="label">Quality:</label>
        <input
          type="number"
          className="input-field"
          value={data?.quality || ''}
          onChange={(e) => {
            e.stopPropagation();
            onChange(image, 'quality', e.target.value);
          }}
          min="1"
          max="5"
        />
      </div>
      <div>
        <label className="label">Class:</label>
        <select
          className="input-field"
          value={data?.class || ''}
          onChange={(e) => {
            e.stopPropagation();
            onChange(image, 'class', e.target.value);
          }}
        >
          <option value="0">0</option>
          <option value="1">1</option>
        </select>
      </div>
      <div>
        <label className="label">Comment:</label>
        <textarea
          className="input-field"
          value={data?.comment || ''}
          onChange={(e) => {
            e.stopPropagation();
            onChange(image, 'comment', e.target.value);
          }}
        />
      </div>

    </div>
  );
};

export default ImageCard;
