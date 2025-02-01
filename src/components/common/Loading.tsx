import React from 'react';
import { Bot, Sparkles, Binary } from 'lucide-react';
import './Loading.scss';

export const Loading = () => {
  return (
    <div className="main-loading">
      <div className="loading-content">
        <div className="ai-brain">
          <div className="brain-circles">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="circle" />
            ))}
          </div>
          <Bot size={64} />
          <div className="particles">
            {[...Array(12)].map((_, i) => (
              <Sparkles 
                key={i} 
                size={16} 
                className="particle"
                style={{ 
                  '--delay': `${i * 0.2}s`,
                  '--position': `${i * 30}deg`
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
        
        <div className="loading-text">
          <div className="binary-line">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="binary" style={{ '--delay': `${i * 0.1}s` } as React.CSSProperties}>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
          <h3>هوش مصنوعی در حال آماده‌سازی</h3>
          {/* <div className="dots-container">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div> */}
        </div>
      </div>
    </div>
  );
}; 