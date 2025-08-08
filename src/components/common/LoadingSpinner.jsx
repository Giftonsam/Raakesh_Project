// src/components/common/LoadingSpinner.jsx
import React from 'react'

export default function LoadingSpinner({
  size = 'base',
  text = 'Loading...',
  fullScreen = false,
  color = 'primary'
}) {
  const spinnerClass = `modern-spinner ${size === 'sm' ? 'modern-spinner--sm' : size === 'lg' ? 'modern-spinner--lg' : ''} modern-spinner--${color}`

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className={spinnerClass}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          {text && <p className="loading-text">{text}</p>}
        </div>

        <style jsx>{`
                    .loading-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(255, 255, 255, 0.9);
                        backdrop-filter: blur(8px);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                        animation: fadeIn 0.3s ease-out;
                    }

                    [data-theme="dark"] .loading-overlay {
                        background: rgba(26, 26, 26, 0.9);
                    }

                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: var(--space-6);
                        padding: var(--space-8);
                        background: var(--bg-primary);
                        border-radius: var(--radius-2xl);
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        border: 1px solid var(--color-gray-200);
                        min-width: 200px;
                        animation: slideInScale 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    }

                    .modern-spinner {
                        position: relative;
                        width: 60px;
                        height: 60px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .modern-spinner--sm {
                        width: 40px;
                        height: 40px;
                    }

                    .modern-spinner--lg {
                        width: 80px;
                        height: 80px;
                    }

                    .spinner-ring {
                        position: absolute;
                        border-radius: 50%;
                        border: 3px solid transparent;
                        animation: modernSpin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                    }

                    .modern-spinner--sm .spinner-ring {
                        border-width: 2px;
                    }

                    .modern-spinner--lg .spinner-ring {
                        border-width: 4px;
                    }

                    .spinner-ring:nth-child(1) {
                        width: 100%;
                        height: 100%;
                        border-top-color: var(--color-primary);
                        animation-delay: 0s;
                    }

                    .spinner-ring:nth-child(2) {
                        width: 70%;
                        height: 70%;
                        border-top-color: var(--color-secondary);
                        animation-delay: -0.5s;
                        animation-direction: reverse;
                    }

                    .spinner-ring:nth-child(3) {
                        width: 40%;
                        height: 40%;
                        border-top-color: var(--color-accent);
                        animation-delay: -1s;
                    }

                    .modern-spinner--secondary .spinner-ring:nth-child(1) {
                        border-top-color: var(--color-secondary);
                    }

                    .modern-spinner--secondary .spinner-ring:nth-child(2) {
                        border-top-color: var(--color-primary);
                    }

                    .modern-spinner--accent .spinner-ring:nth-child(1) {
                        border-top-color: var(--color-accent);
                    }

                    .modern-spinner--accent .spinner-ring:nth-child(2) {
                        border-top-color: var(--color-primary);
                    }

                    .loading-text {
                        color: var(--text-primary);
                        font-size: var(--font-size-base);
                        font-weight: var(--font-weight-medium);
                        margin: 0;
                        text-align: center;
                        animation: textPulse 2s ease-in-out infinite;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }

                    @keyframes slideInScale {
                        from {
                            opacity: 0;
                            transform: translate(-50%, -50%) scale(0.8);
                        }
                        to {
                            opacity: 1;
                            transform: translate(-50%, -50%) scale(1);
                        }
                    }

                    @keyframes modernSpin {
                        0% {
                            transform: rotate(0deg);
                            border-top-color: current;
                        }
                        25% {
                            border-right-color: current;
                        }
                        50% {
                            transform: rotate(180deg);
                            border-bottom-color: current;
                        }
                        75% {
                            border-left-color: current;
                        }
                        100% {
                            transform: rotate(360deg);
                            border-top-color: current;
                        }
                    }

                    @keyframes textPulse {
                        0%, 100% {
                            opacity: 1;
                        }
                        50% {
                            opacity: 0.6;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .modern-spinner .spinner-ring {
                            animation: none;
                            border-top-color: var(--color-primary);
                            border-right-color: transparent;
                            border-bottom-color: transparent;
                            border-left-color: transparent;
                        }
                        
                        .loading-text {
                            animation: none;
                        }
                    }
                `}</style>
      </div>
    )
  }

  return (
    <div className="inline-loading-container">
      <div className={spinnerClass}>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}

      <style jsx>{`
                .inline-loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--space-4);
                    padding: var(--space-8);
                    width: 100%;
                    min-height: 200px;
                }

                .modern-spinner {
                    position: relative;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modern-spinner--sm {
                    width: 40px;
                    height: 40px;
                }

                .modern-spinner--lg {
                    width: 80px;
                    height: 80px;
                }

                .spinner-ring {
                    position: absolute;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    animation: modernSpin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                }

                .modern-spinner--sm .spinner-ring {
                    border-width: 2px;
                }

                .modern-spinner--lg .spinner-ring {
                    border-width: 4px;
                }

                .spinner-ring:nth-child(1) {
                    width: 100%;
                    height: 100%;
                    border-top-color: var(--color-primary);
                    animation-delay: 0s;
                }

                .spinner-ring:nth-child(2) {
                    width: 70%;
                    height: 70%;
                    border-top-color: var(--color-secondary);
                    animation-delay: -0.5s;
                    animation-direction: reverse;
                }

                .spinner-ring:nth-child(3) {
                    width: 40%;
                    height: 40%;
                    border-top-color: var(--color-accent);
                    animation-delay: -1s;
                }

                .modern-spinner--secondary .spinner-ring:nth-child(1) {
                    border-top-color: var(--color-secondary);
                }

                .modern-spinner--secondary .spinner-ring:nth-child(2) {
                    border-top-color: var(--color-primary);
                }

                .modern-spinner--accent .spinner-ring:nth-child(1) {
                    border-top-color: var(--color-accent);
                }

                .modern-spinner--accent .spinner-ring:nth-child(2) {
                    border-top-color: var(--color-primary);
                }

                .loading-text {
                    color: var(--text-secondary);
                    font-size: var(--font-size-base);
                    font-weight: var(--font-weight-medium);
                    margin: 0;
                    text-align: center;
                    animation: textPulse 2s ease-in-out infinite;
                }

                @keyframes modernSpin {
                    0% {
                        transform: rotate(0deg);
                        border-top-color: current;
                    }
                    25% {
                        border-right-color: current;
                    }
                    50% {
                        transform: rotate(180deg);
                        border-bottom-color: current;
                    }
                    75% {
                        border-left-color: current;
                    }
                    100% {
                        transform: rotate(360deg);
                        border-top-color: current;
                    }
                }

                @keyframes textPulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.6;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .modern-spinner .spinner-ring {
                        animation: none;
                        border-top-color: var(--color-primary);
                        border-right-color: transparent;
                        border-bottom-color: transparent;
                        border-left-color: transparent;
                    }
                    
                    .loading-text {
                        animation: none;
                    }
                }
            `}</style>
    </div>
  )
}