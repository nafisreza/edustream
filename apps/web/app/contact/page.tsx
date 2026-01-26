"use client";
import React, { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.subject && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-gray-900">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-6xl font-bold mb-2 text-center" style={{ color: '#6B46C1' }}>Contact Us</h1>
        <p className="mb-4 text-center text-lg text-gray-700">We'd love to hear from you!</p>
      </div>

      <div className="mb-12 text-lg text-gray-800">
        <p className="mb-4 text-center">
          Have questions, feedback, or need support? Our team at EduStream is here to help. 
          Whether you're a teacher looking to enhance your virtual classroom experience or a student 
          needing assistance, we're committed to providing you with the support you need.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Contact Form */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#6B46C1' }}>Send Us a Message</h2>
          
          {submitted && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Thank you! Your message has been sent successfully.
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership Opportunities</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                Your Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tell us how we can help you..."
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: '#6B46C1' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#553399'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6B46C1'}
            >
              Send Message
            </button>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#6B46C1' }}>Get In Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E9E0F7' }}>
                  <svg className="w-6 h-6" style={{ color: '#6B46C1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <a href="mailto:support@edustream.com" className="text-blue-600 hover:underline">
                    support@edustream.com
                  </a>
                  <p className="text-sm text-gray-600 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E9E0F7' }}>
                  <svg className="w-6 h-6" style={{ color: '#6B46C1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Live Chat</h3>
                  <p className="text-gray-700">Available Monday - Friday</p>
                  <p className="text-sm text-gray-600 mt-1">9:00 AM - 6:00 PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E9E0F7' }}>
                  <svg className="w-6 h-6" style={{ color: '#6B46C1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Documentation</h3>
                  <a href="/docs" className="text-blue-600 hover:underline">
                    Visit Help Center
                  </a>
                  <p className="text-sm text-gray-600 mt-1">Find answers to common questions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#6B46C1' }}>Office Hours</h3>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Monday - Friday:</span>
                <span>9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Saturday:</span>
                <span>10:00 AM - 4:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sunday:</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: '#6B46C1' }}>
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">How do I create a virtual classroom?</h3>
            <p className="text-gray-700">Teachers can sign up for an account and create a room instantly. Students can join using the room ID without registration.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Is EduStream free to use?</h3>
            <p className="text-gray-700">We offer both free and premium plans. Check our pricing page for more details on features and pricing.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">What browsers are supported?</h3>
            <p className="text-gray-700">EduStream works best on Chrome, Firefox, Safari, and Edge. Make sure your browser is up to date for optimal performance.</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Can I record my classes?</h3>
            <p className="text-gray-700">Recording features are available on premium plans. Contact us for enterprise solutions with advanced recording capabilities.</p>
          </div>
        </div>
      </div>
    </main>
  );
}