import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <div className="footer__brand">
              <BookOpen size={32} style={{ color: 'var(--color-primary)' }} />
              <h3>BookStore</h3>
            </div>
            <p className="footer__description">
              Your premier destination for books. Discover, explore, and purchase
              from our extensive collection of literature, programming, and educational books.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="footer__social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Quick Links</h4>
            <ul className="footer__links">
              <li><Link to="/books" className="footer__link">Browse Books</Link></li>
              <li><Link to="/categories" className="footer__link">Categories</Link></li>
              <li><Link to="/feedback" className="footer__link">Feedback</Link></li>
              <li><Link to="/orders" className="footer__link">Order History</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Categories</h4>
            <ul className="footer__links">
              <li><Link to="/categories" className="footer__link">Programming</Link></li>
              <li><Link to="/categories" className="footer__link">Web Development</Link></li>
              <li><Link to="/categories" className="footer__link">Software Engineering</Link></li>
              <li><Link to="/categories" className="footer__link">Computer Science</Link></li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__title">Contact Info</h4>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <Mail size={16} />
                <span>support@bookstore.com</span>
              </div>
              <div className="footer__contact-item">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="footer__contact-item">
                <MapPin size={16} />
                <span>123 Book Street, Chennai, Tamil Nadu</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__bottom-content">
            <p>&copy; {currentYear} BookStore. All rights reserved.</p>
            <div className="footer__legal">
              <Link to="/privacy" className="footer__link">Privacy Policy</Link>
              <Link to="/terms" className="footer__link">Terms of Service</Link>
              <Link to="/support" className="footer__link">Support</Link>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED: Removed jsx attribute */}
      <style>{`
        .footer {
          background: var(--color-gray-900);
          color: var(--text-white);
          margin-top: auto;
        }

        .footer__content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-8);
          padding: var(--space-16) 0 var(--space-8);
        }

        .footer__section {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .footer__brand {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
        }

        .footer__brand h3 {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-white);
          margin: 0;
        }

        .footer__description {
          color: var(--color-gray-300);
          line-height: var(--line-height-relaxed);
          margin-bottom: var(--space-4);
        }

        .footer__social {
          display: flex;
          gap: var(--space-3);
        }

        .footer__social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--color-gray-800);
          color: var(--color-gray-300);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
        }

        .footer__social-link:hover {
          background: var(--color-primary);
          color: var(--text-white);
          transform: translateY(-2px);
          text-decoration: none;
        }

        .footer__title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          color: var(--text-white);
          margin-bottom: var(--space-4);
        }

        .footer__links {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .footer__link {
          color: var(--color-gray-300);
          transition: color var(--transition-fast);
          padding: var(--space-1) 0;
        }

        .footer__link:hover {
          color: var(--color-primary);
          text-decoration: none;
        }

        .footer__contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .footer__contact-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          color: var(--color-gray-300);
        }

        .footer__bottom {
          border-top: 1px solid var(--color-gray-800);
          padding: var(--space-6) 0;
        }

        .footer__bottom-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: var(--space-4);
        }

        .footer__legal {
          display: flex;
          gap: var(--space-6);
        }

        @media (max-width: 768px) {
          .footer__content {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }

          .footer__bottom-content {
            flex-direction: column;
            text-align: center;
            gap: var(--space-4);
          }

          .footer__legal {
            gap: var(--space-4);
          }
        }
      `}</style>
    </footer>
  )
}