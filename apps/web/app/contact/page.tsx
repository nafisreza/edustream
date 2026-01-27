"use client";
import React, { useState } from 'react';
import Link from 'next/link';

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand Section */}
          <div>
            <Link href="http://localhost:3000" className="inline-block mb-4">
              <img 
                src="/EduStreamLogo_purple.png" 
                alt="EduStream Logo" 
                className="h-12 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Transform learning with interactive streaming. Connect educators and learners in real-time sessions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/create-room" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Create Room
                </Link>
              </li>
              <li>
                <Link href="/join-room" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Join Room
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600">
            © 2026 EduStream. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get help via email',
      detail: 'support@edustream.com',
      link: 'mailto:support@edustream.com'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our team',
      detail: 'Available 9am-5pm EST',
      link: '#'
    },
    {
      icon: '📚',
      title: 'Documentation',
      description: 'Browse our guides',
      detail: 'docs.edustream.com',
      link: '/help'
    },
    {
      icon: '🎓',
      title: 'Community',
      description: 'Join our community',
      detail: 'Connect with educators',
      link: '#'
    }
  ];

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-pink-50 px-4 py-16">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold mb-4" style={{ color: '#6B46C1' }}>
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium">
              We're here to help you succeed
            </p>
          </div>

          {submitted ? (
            // Success Message
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                <div className="mb-6">
                  <span className="text-7xl">✅</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Message Sent!
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <div className="inline-flex items-center text-purple-600 font-semibold">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Returning to form...
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Contact Form */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="How can we help you?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Methods & Info */}
              <div className="space-y-6">
                {/* Quick Contact Methods */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.link}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                    >
                      <div className="text-4xl mb-3">{method.icon}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{method.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                      <p className="text-purple-600 font-semibold text-sm">{method.detail}</p>
                    </a>
                  ))}
                </div>

                {/* Additional Info Card */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4">💡 Need immediate help?</h3>
                  <p className="mb-6 text-purple-100">
                    Check out our comprehensive help center with guides, tutorials, and FAQs to get answers instantly.
                  </p>
                  <Link
                    href="/help"
                    className="inline-flex items-center bg-white text-purple-600 font-semibold px-6 py-3 rounded-xl hover:bg-purple-50 transition-all transform hover:scale-105"
                  >
                    Visit Help Center
                    <svg className="h-5 w-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>

                {/* Office Hours */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Support Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday - Friday:</span>
                      <span>9:00 AM - 5:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday:</span>
                      <span>10:00 AM - 2:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday:</span>
                      <span>Closed</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Response Time:</strong> We typically respond within 24 hours during business days.
                    </p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🌐 Connect With Us</h3>
                  <div className="flex gap-4">
                    <a href="#" className="flex-1 bg-blue-500 text-white p-4 rounded-xl text-center font-semibold hover:bg-blue-600 transition-all transform hover:scale-105">
                      Twitter
                    </a>
                    <a href="#" className="flex-1 bg-blue-700 text-white p-4 rounded-xl text-center font-semibold hover:bg-blue-800 transition-all transform hover:scale-105">
                      LinkedIn
                    </a>
                    <a href="#" className="flex-1 bg-purple-500 text-white p-4 rounded-xl text-center font-semibold hover:bg-purple-600 transition-all transform hover:scale-105">
                      Discord
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Quick Links */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'How to create a room?',
                'How to join a session?',
                'Is EduStream free?',
                'What are system requirements?',
                'How to use screen sharing?',
                'Contact support'
              ].map((faq, index) => (
                <Link
                  key={index}
                  href="/help"
                  className="bg-white text-purple-600 px-5 py-2 rounded-full font-medium hover:bg-purple-600 hover:text-white transition-all shadow-md hover:shadow-lg"
                >
                  {faq}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}