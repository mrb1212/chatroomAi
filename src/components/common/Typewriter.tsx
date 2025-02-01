import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
}

export const Typewriter = ({ text, speed = 100, className = '' }: TypewriterProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // // Reset animation when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsTyping(true);
  }, [text]);

  useEffect(() => {

    if (text === '') {return}
    if (currentIndex >= text.length) {
      setIsTyping(false);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayText(text.slice(0, currentIndex + 1));
      setCurrentIndex(prev => prev + 1);
    }, speed);
    

    return () => clearTimeout(timer);
  }, [text, speed, currentIndex, isTyping]);

  return (
    <span className={isTyping ? `typing-text ${className}` : className}>
      {displayText}
    </span>
  );
}; 