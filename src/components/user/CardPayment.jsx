// src/components/user/CardPayment.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    ArrowLeft,
    Shield,
    CreditCard,
    Lock,
    Eye,
    EyeOff,
    Wifi,
    Battery,
    Signal,
    CheckCircle,
    AlertCircle
} from 'lucide-react'

const CardPayment = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [currentTime, setCurrentTime] = useState(new Date())
    const [showCvv, setShowCvv] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [step, setStep] = useState('form') // form, processing

    const [formData, setFormData] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        holderName: '',
        saveCard: false
    })

    const [errors, setErrors] = useState({})

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

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = matches && matches[0] || ''
        const parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
            return parts.join(' ')
        } else {
            return v
        }
    }

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4)
        }
        return v
    }

    const getCardType = (number) => {
        const num = number.replace(/\s/g, '')
        if (/^4/.test(num)) return 'visa'
        if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard'
        if (/^6/.test(num)) return 'rupay'
        return 'unknown'
    }

    const handleInputChange = (field, value) => {
        let formattedValue = value

        if (field === 'cardNumber') {
            formattedValue = formatCardNumber(value)
        } else if (field === 'expiryDate') {
            formattedValue = formatExpiryDate(value)
        } else if (field === 'cvv') {
            formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4)
        } else if (field === 'holderName') {
            formattedValue = value.toUpperCase()
        }

        setFormData(prev => ({
            ...prev,
            [field]: formattedValue
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
            newErrors.cardNumber = 'Please enter a valid card number'
        }

        if (!formData.expiryDate || formData.expiryDate.length < 5) {
            newErrors.expiryDate = 'Please enter a valid expiry date'
        }

        if (!formData.cvv || formData.cvv.length < 3) {
            newErrors.cvv = 'Please enter a valid CVV'
        }

        if (!formData.holderName.trim()) {
            newErrors.holderName = 'Please enter cardholder name'
        }

        // Check expiry date
        if (formData.expiryDate.length === 5) {
            const [month, year] = formData.expiryDate.split('/')
            const currentDate = new Date()
            const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1)

            if (expiryDate < currentDate) {
                newErrors.expiryDate = 'Card has expired'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handlePayment = () => {
        if (!validateForm()) return

        setStep('processing')
        setIsProcessing(true)

        // Simulate payment processing
        setTimeout(() => {
            navigate('/payment/success', {
                state: {
                    ...orderDetails,
                    paymentMethod: 'Card',
                    cardType: getCardType(formData.cardNumber),
                    lastFour: formData.cardNumber.slice(-4)
                }
            })
        }, Math.random() * 10000 + 15000) // 15-25 seconds
    }

    const renderForm = () => (
        <div className="card-form">
            <h3>Enter Card Details</h3>

            {/* Card Preview */}
            <div className="card-preview">
                <div className={`credit-card ${getCardType(formData.cardNumber)}`}>
                    <div className="card-chip"></div>
                    <div className="card-number">
                        {formData.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-info">
                        <div className="card-holder">
                            <span className="label">CARD HOLDER</span>
                            <span className="value">{formData.holderName || 'YOUR NAME'}</span>
                        </div>
                        <div className="card-expiry">
                            <span className="label">VALID THRU</span>
                            <span className="value">{formData.expiryDate || 'MM/YY'}</span>
                        </div>
                    </div>
                    <div className="card-logo">
                        {getCardType(formData.cardNumber) === 'visa' && '💳'}
                        {getCardType(formData.cardNumber) === 'mastercard' && '🔴'}
                        {getCardType(formData.cardNumber) === 'rupay' && '🟢'}
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="form-fields">
                <div className="field-group">
                    <label>Card Number</label>
                    <div className="input-with-icon">
                        <CreditCard size={20} className="input-icon" />
                        <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                            maxLength={19}
                            className={errors.cardNumber ? 'error' : ''}
                        />
                    </div>
                    {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>

                <div className="field-row">
                    <div className="field-group">
                        <label>Expiry Date</label>
                        <input
                            type="text"
                            placeholder="MM/YY"
                            value={formData.expiryDate}
                            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            maxLength={5}
                            className={errors.expiryDate ? 'error' : ''}
                        />
                        {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                    </div>

                    <div className="field-group">
                        <label>CVV</label>
                        <div className="input-with-icon">
                            <input
                                type={showCvv ? 'text' : 'password'}
                                placeholder="123"
                                value={formData.cvv}
                                onChange={(e) => handleInputChange('cvv', e.target.value)}
                                maxLength={4}
                                className={errors.cvv ? 'error' : ''}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCvv(!showCvv)}
                                className="toggle-cvv"
                            >
                                {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                    </div>
                </div>

                <div className="field-group">
                    <label>Cardholder Name</label>
                    <input
                        type="text"
                        placeholder="JOHN DOE"
                        value={formData.holderName}
                        onChange={(e) => handleInputChange('holderName', e.target.value)}
                        className={errors.holderName ? 'error' : ''}
                    />
                    {errors.holderName && <span className="error-text">{errors.holderName}</span>}
                </div>

                <div className="checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={formData.saveCard}
                            onChange={(e) => setFormData(prev => ({ ...prev, saveCard: e.target.checked }))}
                        />
                        <span className="checkmark"></span>
                        Save this card for future payments
                    </label>
                </div>
            </div>

            <button
                className="pay-btn"
                onClick={handlePayment}
            >
                <Lock size={20} />
                Pay ₹{orderDetails.amount.toLocaleString()}
            </button>
        </div>
    )

    const renderProcessing = () => (
        <div className="processing-content">
            <div className="processing-animation">
                <div className="processing-circle">
                    <div className="spinner-large"></div>
                    <CreditCard size={32} />
                </div>
            </div>
            <h3>Processing Payment</h3>
            <p>Please wait while we securely process your card payment...</p>
            <div className="processing-steps">
                <div className="process-step active">
                    <CheckCircle size={16} />
                    <span>Card details verified</span>
                </div>
                <div className="process-step active">
                    <CheckCircle size={16} />
                    <span>Contacting bank</span>
                </div>
                <div className="process-step">
                    <div className="step-loader"></div>
                    <span>Authorizing payment</span>
                </div>
            </div>

            <div className="security-note">
                <AlertCircle size={16} />
                <span>Do not press back or refresh the page</span>
            </div>
        </div>
    )

    return (
        <div className="card-payment">
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
                <h1>Card Payment</h1>
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
                {step === 'form' ? renderForm() : renderProcessing()}
            </div>

            <style>{`
        .card-payment {
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

        .card-form h3 {
          margin: 0 0 24px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        /* Card Preview */
        .card-preview {
          margin-bottom: 32px;
          perspective: 1000px;
        }

        .credit-card {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          position: relative;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transform: rotateY(-5deg) rotateX(5deg);
          transition: all 0.3s ease;
        }

        .credit-card.visa {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
        }

        .credit-card.mastercard {
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
        }

        .credit-card.rupay {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
        }

        .card-chip {
          width: 40px;
          height: 30px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border-radius: 6px;
          margin-bottom: 24px;
        }

        .card-number {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 2px;
          margin-bottom: 24px;
          font-family: 'Courier New', monospace;
        }

        .card-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .card-holder,
        .card-expiry {
          display: flex;
          flex-direction: column;
        }

        .card-info .label {
          font-size: 10px;
          opacity: 0.8;
          margin-bottom: 4px;
        }

        .card-info .value {
          font-size: 14px;
          font-weight: 600;
        }

        .card-logo {
          position: absolute;
          top: 24px;
          right: 24px;
          font-size: 24px;
        }

        /* Form Fields */
        .form-fields {
          margin-bottom: 24px;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .field-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #374151;
        }

        .field-group input {
          width: 100%;
          padding: 16px;
          border: 2px solid #d1d5db;
          border-radius: 12px;
          font-size: 16px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .field-group input:focus {
          outline: none;
          border-color: #667eea;
        }

        .field-group input.error {
          border-color: #ef4444;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
        }

        .input-with-icon input {
          padding-left: 48px;
        }

        .toggle-cvv {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
        }

        .error-text {
          color: #ef4444;
          font-size: 14px;
          margin-top: 4px;
          display: block;
        }

        /* Checkbox */
        .checkbox-group {
          margin: 24px 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          color: #6b7280;
        }

        .checkbox-label input {
          display: none;
        }

        .checkmark {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          margin-right: 12px;
          position: relative;
          transition: all 0.3s ease;
        }

        .checkbox-label input:checked + .checkmark {
          background: #667eea;
          border-color: #667eea;
        }

        .checkbox-label input:checked + .checkmark::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        /* Pay Button */
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

        /* Dark mode support */
        :global([data-theme="dark"]) .payment-content {
          background: #1f2937;
          color: white;
        }

        :global([data-theme="dark"]) .card-form h3 {
          color: white;
        }

        :global([data-theme="dark"]) .field-group label {
          color: #d1d5db;
        }

        :global([data-theme="dark"]) .field-group input {
          background: #374151;
          border-color: #4b5563;
          color: white;
        }

        :global([data-theme="dark"]) .field-group input::placeholder {
          color: #9ca3af;
        }

        :global([data-theme="dark"]) .field-group input:focus {
          border-color: #667eea;
        }

        :global([data-theme="dark"]) .checkbox-label {
          color: #d1d5db;
        }

        :global([data-theme="dark"]) .checkmark {
          border-color: #4b5563;
        }

        :global([data-theme="dark"]) .processing-content h3 {
          color: white;
        }

        :global([data-theme="dark"]) .processing-content p {
          color: #d1d5db;
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
          
          .field-row {
            grid-template-columns: 1fr;
          }
          
          .credit-card {
            height: 180px;
            padding: 20px;
            transform: none;
          }
          
          .card-number {
            font-size: 16px;
          }
          
          .payment-content {
            border-radius: 16px 16px 0 0;
          }
        }
      `}</style>
        </div>
    )
}

export default CardPayment