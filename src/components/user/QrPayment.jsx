// src/components/user/QrPayment.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  QrCode,
  Download,
  Share,
  CheckCircle,
  Clock,
  Wifi,
  Battery,
  Signal,
  AlertCircle,
  RefreshCw
} from 'lucide-react'

const QrPayment = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isProcessing, setIsProcessing] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [qrGenerated, setQrGenerated] = useState(false)

  const orderDetails = location.state || {
    amount: 2500,
    items: 3,
    orderId: 'ORD' + Date.now()
  }

  useEffect(() => {
    const timeTimer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Generate QR code after component mounts
    const qrTimer = setTimeout(() => {
      setQrGenerated(true)
    }, 1000)

    // Countdown timer
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdown)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Auto-detect payment (simulate)
    const paymentDetection = setTimeout(() => {
      if (!isProcessing) {
        setIsProcessing(true)
        setTimeout(() => {
          navigate('/payment/success', {
            state: {
              ...orderDetails,
              paymentMethod: 'QR Code',
              qrMethod: 'UPI'
            }
          })
        }, Math.random() * 5000 + 10000) // 10-15 seconds
      }
    }, Math.random() * 60000 + 30000) // 30-90 seconds

    return () => {
      clearInterval(timeTimer)
      clearTimeout(qrTimer)
      clearInterval(countdown)
      clearTimeout(paymentDetection)
    }
  }, [isProcessing, navigate, orderDetails])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const generateQrPattern = () => {
    const size = 21 // 21x21 QR code
    const pattern = []

    for (let i = 0; i < size; i++) {
      pattern[i] = []
      for (let j = 0; j < size; j++) {
        // Create a pseudo-random pattern based on order details
        const seed = (i * size + j + orderDetails.amount + orderDetails.orderId.charCodeAt(0)) % 100
        pattern[i][j] = seed > 45 ? 1 : 0
      }
    }

    // Add finder patterns (corners)
    const finderPattern = [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ]

    // Top-left
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        pattern[i][j] = finderPattern[i][j]
      }
    }

    // Top-right
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        pattern[i][size - 7 + j] = finderPattern[i][j]
      }
    }

    // Bottom-left
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        pattern[size - 7 + i][j] = finderPattern[i][j]
      }
    }

    return pattern
  }

  const handleRefreshQr = () => {
    setQrGenerated(false)
    setTimeLeft(300)
    setTimeout(() => {
      setQrGenerated(true)
    }, 1000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment QR Code',
          text: `Pay ₹${orderDetails.amount.toLocaleString()} for Order ${orderDetails.orderId}`,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    }
  }

  const qrPattern = generateQrPattern()

  if (isProcessing) {
    return (
      <div className="qr-payment">
        <div className="status-bar">
          <div className="status-left">
            <span className="time">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="status-right">
            <Signal size={16} />
            <Wifi size={16} />
            <Battery size={16} />
          </div>
        </div>

        <div className="payment-header">
          <button onClick={() => null} className="back-btn" disabled>
            <ArrowLeft size={24} />
          </button>
          <h1>QR Payment</h1>
          <div className="security-badge">
            <Shield size={16} />
            <span>Secure</span>
          </div>
        </div>

        <div className="payment-content">
          <div className="processing-content">
            <div className="processing-animation">
              <div className="processing-circle">
                <div className="spinner-large"></div>
                <QrCode size={32} />
              </div>
            </div>
            <h3>Payment Detected!</h3>
            <p>Processing your QR code payment...</p>
            <div className="processing-steps">
              <div className="process-step active">
                <CheckCircle size={16} />
                <span>QR code scanned</span>
              </div>
              <div className="process-step active">
                <CheckCircle size={16} />
                <span>Payment initiated</span>
              </div>
              <div className="process-step">
                <div className="step-loader"></div>
                <span>Confirming transaction</span>
              </div>
            </div>

            <div className="security-note">
              <AlertCircle size={16} />
              <span>Please wait while we confirm your payment</span>
            </div>
          </div>
        </div>

        <style>{`
          .qr-payment {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .status-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 20px;
            background: rgba(0, 0, 0, 0.1);
            font-size: 14px;
            font-weight: 500;
          }

          .status-right {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .payment-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
          }

          .back-btn {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: background 0.3s ease;
          }

          .back-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .payment-header h1 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
          }

          .security-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            background: rgba(16, 185, 129, 0.2);
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            color: #10b981;
          }

          .payment-content {
            background: white;
            color: #1f2937;
            border-radius: 24px 24px 0 0;
            min-height: calc(100vh - 120px);
            padding: 24px 20px;
          }

          .processing-content {
            text-align: center;
            padding-top: 40px;
          }

          .processing-animation {
            margin-bottom: 32px;
          }

          .processing-circle {
            position: relative;
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            color: white;
          }

          .spinner-large {
            position: absolute;
            width: 90px;
            height: 90px;
            border: 3px solid rgba(102, 126, 234, 0.3);
            border-top: 3px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .processing-content h3 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
          }

          .processing-content p {
            margin: 0 0 32px 0;
            color: #6b7280;
          }

          .processing-steps {
            margin: 24px 0;
            text-align: left;
          }

          .process-step {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px 0;
            color: #6b7280;
          }

          .process-step.active {
            color: #10b981;
          }

          .step-loader {
            width: 16px;
            height: 16px;
            border: 2px solid #e5e7eb;
            border-top: 2px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .security-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: #fef3cd;
            color: #92400e;
            padding: 12px;
            border-radius: 8px;
            margin-top: 24px;
            font-size: 14px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="qr-payment">
      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-left">
          <span className="time">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="status-right">
          <Signal size={16} />
          <Wifi size={16} />
          <Battery size={16} />
        </div>
      </div>

      {/* Header */}
      <div className="payment-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={24} />
        </button>
        <h1>QR Payment</h1>
        <div className="security-badge">
          <Shield size={16} />
          <span>Secure</span>
        </div>
      </div>

      {/* Amount Display */}
      <div className="amount-display">
        <span className="amount-label">Amount to pay</span>
        <div className="amount-section">
          <span className="currency">₹</span>
          <span className="amount">{orderDetails.amount.toLocaleString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="payment-content">
        <div className="qr-content">
          <h3>Scan QR Code to Pay</h3>

          {/* Timer */}
          <div className="timer-section">
            <Clock size={16} />
            <span>Valid for {formatTime(timeLeft)}</span>
          </div>

          {/* QR Code */}
          <div className="qr-container">
            {qrGenerated ? (
              <div className="qr-code">
                {qrPattern.map((row, i) => (
                  <div key={i} className="qr-row">
                    {row.map((cell, j) => (
                      <div
                        key={j}
                        className={`qr-cell ${cell ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="qr-loading">
                <div className="qr-skeleton"></div>
                <div className="loading-spinner"></div>
                <span>Generating QR code...</span>
              </div>
            )}
          </div>

          {/* QR Actions */}
          {qrGenerated && (
            <div className="qr-actions">
              <button className="action-btn" onClick={handleRefreshQr}>
                <RefreshCw size={16} />
                Refresh
              </button>
              <button className="action-btn" onClick={handleShare}>
                <Share size={16} />
                Share
              </button>
              <button className="action-btn">
                <Download size={16} />
                Download
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="instructions">
            <h4>How to pay:</h4>
            <ol>
              <li>Open any UPI app (GPay, PhonePe, Paytm, etc.)</li>
              <li>Tap on 'Scan QR' or camera icon</li>
              <li>Point your camera at the QR code above</li>
              <li>Verify the amount and complete payment</li>
            </ol>
          </div>

          {/* Supported Apps */}
          <div className="supported-apps">
            <h4>Supported Apps:</h4>
            <div className="app-list">
              <div className="app-item">
                <div className="app-icon" style={{ background: '#4285f4' }}>🟢</div>
                <span>Google Pay</span>
              </div>
              <div className="app-item">
                <div className="app-icon" style={{ background: '#5f2d91' }}>🟣</div>
                <span>PhonePe</span>
              </div>
              <div className="app-item">
                <div className="app-icon" style={{ background: '#00baf2' }}>🔵</div>
                <span>Paytm</span>
              </div>
              <div className="app-item">
                <div className="app-icon" style={{ background: '#ff9900' }}>🟠</div>
                <span>Amazon Pay</span>
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="security-info">
            <Shield size={16} />
            <span>Your payment is secured with 256-bit encryption</span>
          </div>
        </div>
      </div>

      <style>{`
        .qr-payment {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Status Bar */
        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 20px;
          background: rgba(0, 0, 0, 0.1);
          font-size: 14px;
          font-weight: 500;
        }

        .status-right {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        /* Header */
        .payment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .back-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: background 0.3s ease;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .payment-header h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(16, 185, 129, 0.2);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          color: #10b981;
        }

        /* Amount Display */
        .amount-display {
          text-align: center;
          padding: 20px;
        }

        .amount-label {
          display: block;
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 8px;
        }

        .amount-section {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .currency {
          font-size: 20px;
          opacity: 0.8;
        }

        .amount {
          font-size: 32px;
          font-weight: 700;
          margin-left: 8px;
        }

        /* Content */
        .payment-content {
          background: white;
          color: #1f2937;
          border-radius: 24px 24px 0 0;
          min-height: calc(100vh - 200px);
          padding: 24px 20px;
        }

        .qr-content h3 {
          margin: 0 0 24px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          text-align: center;
        }

        /* Timer */
        .timer-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #fef3cd;
          color: #92400e;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 14px;
          font-weight: 500;
        }

        /* QR Code */
        .qr-container {
          display: flex;
          justify-content: center;
          margin: 24px 0;
        }

        .qr-code {
          background: white;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }

        .qr-row {
          display: flex;
        }

        .qr-cell {
          width: 8px;
          height: 8px;
          background: white;
        }

        .qr-cell.filled {
          background: #1f2937;
        }

        .qr-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 40px;
        }

        .qr-skeleton {
          width: 200px;
          height: 200px;
          background: #f3f4f6;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }

        .qr-skeleton::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
          animation: shimmer 1.5s infinite;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* QR Actions */
        .qr-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 24px 0;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #6b7280;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        /* Instructions */
        .instructions {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
          margin: 24px 0;
        }

        .instructions h4 {
          margin: 0 0 12px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .instructions ol {
          margin: 0;
          padding-left: 20px;
          color: #6b7280;
        }

        .instructions li {
          margin: 8px 0;
          line-height: 1.5;
        }

        /* Supported Apps */
        .supported-apps {
          margin: 24px 0;
        }

        .supported-apps h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .app-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .app-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .app-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .app-item span {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
        }

        /* Security Info */
        .security-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #10b981;
          font-size: 14px;
          margin-top: 24px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Dark mode support */
        :global([data-theme="dark"]) .payment-content {
          background: #1f2937;
          color: white;
        }

        :global([data-theme="dark"]) .qr-content h3 {
          color: white;
        }

        :global([data-theme="dark"]) .instructions {
          background: #374151;
        }

        :global([data-theme="dark"]) .instructions h4 {
          color: white;
        }

        :global([data-theme="dark"]) .instructions li {
          color: #d1d5db;
        }

        :global([data-theme="dark"]) .supported-apps h4 {
          color: white;
        }

        :global([data-theme="dark"]) .app-item {
          background: #374151;
        }

        :global([data-theme="dark"]) .app-item span {
          color: white;
        }

        :global([data-theme="dark"]) .action-btn {
          background: #374151;
          border-color: #4b5563;
          color: #d1d5db;
        }

        :global([data-theme="dark"]) .qr-skeleton {
          background: #374151;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .amount {
            font-size: 28px;
          }
          
          .app-list {
            grid-template-columns: 1fr;
          }
          
          .qr-actions {
            flex-wrap: wrap;
          }
          
          .payment-content {
            border-radius: 16px 16px 0 0;
          }
        }
      `}</style>
    </div>
  )
}

export default QrPayment