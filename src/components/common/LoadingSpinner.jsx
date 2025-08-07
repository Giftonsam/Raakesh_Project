import React from 'react'

export default function LoadingSpinner({ size = 'base', text = 'Loading...' }) {
    const spinnerClass = `spinner ${size === 'sm' ? 'spinner--sm' : size === 'lg' ? 'spinner--lg' : ''}`

    return (
        <div className="loading-container">
            <div className={spinnerClass}></div>
            {text && <p className="loading-text">{text}</p>}

            <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
          padding: var(--space-8);
        }

        .loading-text {
          color: var(--text-secondary);
          font-size: var(--font-size-sm);
          margin: 0;
        }
      `}</style>
        </div>
    )
}