// src/components/user/UpiPayment.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    ArrowLeft,
    Shield,
    CheckCircle,
    Clock,
    Wifi,
    Battery,
    Signal,
    Smartphone,
    AlertCircle
} from 'lucide-react'

const UpiPayment = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedApp, setSelectedApp] = useState('')
    const [upiId, setUpiId] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [step, setStep] = useState('select') // select, enter, verify, processing

    const orderDetails = location.state || {
        amount: 2500,
        items: 3,
        orderId: 'ORD' + Date.now()
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const upiApps = [
        {
            id: 'gpay',
            name: 'Google Pay',
            logo: '🟢',
            color: '#4285f4',
            installed: true
        },
        {
            id: 'phonepe',
            name: 'PhonePe',
            logo: '🟣',
            color: '#5f2d91',
            installed: true
        },
        {
            id: 'paytm',
            name: 'Paytm',
            logo: '🔵',
            color: '#00baf2',
            installed: true
        },
        {
            id: 'amazonpay',
            name: 'Amazon Pay',
            logo: '🟠',
            color: '#ff9900',
            installed: false
        }
    ]

    const handleAppSelect = (appId) => {
        setSelectedApp(appId)
        setStep('enter')
    }

    const handleUpiSubmit = () => {
        if (!upiId) return
        setStep('verify')
    }

    const handlePayment = () => {
        setStep('processing')
        setIsProcessing(true)

        // Simulate payment processing
        setTimeout(() => {
            navigate('/payment/success', {
                state: {
                    ...orderDetails,
                    paymentMethod: 'UPI',
                    upiApp: selectedApp,
                    upiId: upiId
                }
            })
        }, Math.random() * 10000 + 15000) // 15-25 seconds
    }

    const renderStepContent = () => {
        switch (step) {
            case 'select':
                return (
                    <div className="step-content">
                        <h3>Choose UPI App</h3>
                        <div className="upi-apps">
                            {upiApps.map((app) => (
                                <div
                                    key={app.id}
                                    className={`upi-app ${!app.installed ? 'disabled' : ''}`}
                                    onClick={() => app.installed && handleAppSelect(app.id)}
                                >
                                    <div className="app-logo" style={{ background: app.color }}>
                                        {app.logo}
                                    </div>
                                    <div className="app-info">
                                        <h4>{app.name}</h4>
                                        <p>{app.installed ? 'Tap to pay' : 'Not installed'}</p>
                                    </div>
                                    {!app.installed && <div className="overlay"></div>}
                                </div>
                            ))}
                        </div>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <button
                            className="upi-id-btn"
                            onClick={() => setStep('enter')}
                        >
                            <Smartphone size={20} />
                            Enter UPI ID manually
                        </button>
                    </div>
                )

            case 'enter':
                return (
                    <div className="step-content">
                        <h3>Enter UPI ID</h3>
                        <div className="upi-input-section">
                            <label>UPI ID</label>
                            <input
                                type="text"
                                placeholder="yourname@paytm"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="upi-input"
                            />
                            <p className="input-help">Enter your UPI ID (e.g., 9876543210@paytm)</p>
                        </div>

                        <button
                            className={`continue-btn ${upiId ? 'active' : ''}`}
                            onClick={handleUpiSubmit}
                            disabled={!upiId}
                        >
                            Continue
                        </button>
                    </div>
                )

            case 'verify':
                return (
                    <div className="step-content">
                        <h3>Verify Payment Details</h3>
                        <div className="verification-card">
                            <div className="verify-section">
                                <label>Amount</label>
                                <p className="amount">₹{orderDetails.amount.toLocaleString()}</p>
                            </div>
                            <div className="verify-section">
                                <label>UPI ID</label>
                                <p>{upiId}</p>
                            </div>
                            <div className="verify-section">
                                <label>Order ID</label>
                                <p>{orderDetails.orderId}</p>
                            </div>
                        </div>

                        <button
                            className="pay-btn"
                            onClick={handlePayment}
                        >
                            <Shield size={20} />
                            Pay ₹{orderDetails.amount.toLocaleString()}
                        </button>
                    </div>
                )

            case 'processing':
                return (
                    <div className="step-content processing">
                        <div className="processing-animation">
                            <div className="processing-circle">
                                <div className="spinner-large"></div>
                                <Shield size={32} />
                            </div>
                        </div>
                        <h3>Processing Payment</h3>
                        <p>Please wait while we process your payment securely...</p>
                        <div className="processing-steps">
                            <div className="process-step active">
                                <CheckCircle size={16} />
                                <span>Payment initiated</span>
                            </div>
                            <div className="process-step active">
                                <Clock size={16} />
                                <span>Verifying with bank</span>
                            </div>
                            <div className="process-step">
                                <div className="step-loader"></div>
                                <span>Confirming transaction</span>
                            </div>
                        </div>

                        <div className="security-note">
                            <AlertCircle size={16} />
                            <span>Do not press back or close the app</span>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <div className="upi-payment">
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
                <button
                    onClick={() => step === 'processing' ? null : navigate(-1)}
                    className="back-btn"
                    disabled={step === 'processing'}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1>UPI Payment</h1>
                <div className="security-badge">
                    <Shield size={16} />
                    <span>Secure</span>
                </div>
            </div>

            {/* Amount Display */}
            {step !== 'processing' && (
                <div className="amount-display">
                    <span className="amount-label">Amount to pay</span>
                    <div className="amount-section">
                        <span className="currency">₹</span>
                        <span className="amount">{orderDetails.amount.toLocaleString()}</span>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="payment-content">
                {renderStepContent()}
            </div>

            <style>{`
        .upi-payment {
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

        .back-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
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

        .step-content h3 {
          margin: 0 0 24px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        /* UPI Apps */
        .upi-apps {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .upi-app {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
          position: relative;
        }

        .upi-app:hover:not(.disabled) {
          border-color: #667eea;
          background: #f8faff;
        }

        .upi-app.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .app-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 8px;
        }

        .app-info {
          text-align: center;
        }

        .app-info h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .app-info p {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          text-align: center;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .divider span {
          padding: 0 16px;
          color: #6b7280;
          font-size: 14px;
        }

        /* UPI ID Button */
        .upi-id-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          background: white;
          border: 2px solid #667eea;
          color: #667eea;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upi-id-btn:hover {
          background: #667eea;
          color: white;
        }

        /* UPI Input */
        .upi-input-section {
          margin-bottom: 24px;
        }

        .upi-input-section label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }

        .upi-input {
          width: 100%;
          padding: 16px;
          border: 2px solid #d1d5db;
          border-radius: 12px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .upi-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .input-help {
          margin: 8px 0 0 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Verification */
        .verification-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .verify-section {
          margin-bottom: 16px;
        }

        .verify-section:last-child {
          margin-bottom: 0;
        }

        .verify-section label {
          display: block;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .verify-section p {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .verify-section p.amount {
          color: #10b981;
          font-size: 20px;
        }

        /* Buttons */
        .continue-btn {
          width: 100%;
          padding: 16px;
          background: #d1d5db;
          color: #9ca3af;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: not-allowed;
          transition: all 0.3s ease;
        }

        .continue-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          cursor: pointer;
        }

        .pay-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .pay-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        /* Processing */
        .step-content.processing {
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

        /* Dark mode support */
        :global([data-theme="dark"]) .payment-content {
          background: #1f2937;
          color: white;
        }

        :global([data-theme="dark"]) .step-content h3 {
          color: white;
        }

        :global([data-theme="dark"]) .upi-app {
          background: #374151;
          border-color: #4b5563;
        }

        :global([data-theme="dark"]) .upi-app:hover:not(.disabled) {
          background: #4b5563;
        }

        :global([data-theme="dark"]) .app-info h4 {
          color: white;
        }

        :global([data-theme="dark"]) .app-info p {
          color: #d1d5db;
        }

        :global([data-theme="dark"]) .upi-id-btn {
          background: #374151;
          border-color: #667eea;
        }

        :global([data-theme="dark"]) .upi-input-section label {
          color: #d1d5db;
        }

        :global([data-theme="dark"]) .upi-input {
          background: #374151;
          border-color: #4b5563;
          color: white;
        }

        :global([data-theme="dark"]) .input-help {
          color: #9ca3af;
        }

        :global([data-theme="dark"]) .verification-card {
          background: #374151;
        }

        :global([data-theme="dark"]) .verify-section label {
          color: #9ca3af;
        }

        :global([data-theme="dark"]) .verify-section p {
          color: white;
        }

        :global([data-theme="dark"]) .process-step {
          color: #9ca3af;
        }

        :global([data-theme="dark"]) .security-note {
          background: #374151;
          color: #fbbf24;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .amount {
            font-size: 28px;
          }
          
          .upi-apps {
            grid-template-columns: 1fr;
          }
          
          .payment-content {
            border-radius: 16px 16px 0 0;
          }
        }
      `}</style>
        </div>
    )
}

export default UpiPayment