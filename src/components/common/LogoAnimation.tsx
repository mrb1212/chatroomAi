import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import './LogoAnimation.scss';

interface LogoAnimationProps {
  size?: number;
  showParticles?: boolean;
  showCircle?: boolean;
  className?: string;
}

export const LogoAnimation: React.FC<LogoAnimationProps> = ({ 
  size = 48, 
  showParticles = true,
  showCircle =true,
  className = ''
}) => {
  return (
    <div className={`logo-animation ${className}`}>
        {showCircle &&
        <div className="brain-circles">
            {[...Array(3)].map((_, i) => (
            <div key={i} className="circle" />
            ))}
        </div>
        }
      <Bot size={size} />
      {showParticles && (
        <div className="particles">
          {[...Array(8)].map((_, i) => (
            <Sparkles 
              key={i} 
              size={size * 0.25} 
              className="particle"
              style={{ 
                '--delay': `${i * 0.2}s`,
                '--position': `${i * 45}deg`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 