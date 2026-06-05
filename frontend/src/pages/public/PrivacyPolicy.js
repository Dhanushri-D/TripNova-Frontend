import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => (
  <div>
    <div className="page-hero">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Privacy Policy</h1>
          <p>Last updated: January 2024</p>
        </motion.div>
      </div>
    </div>
    <div className="container section-padding">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {[
            { title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support. This includes your name, email address, phone number, and travel preferences.' },
            { title: '2. How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.' },
            { title: '3. Information Sharing', content: 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you.' },
            { title: '4. Data Security', content: 'We implement a variety of security measures to maintain the safety of your personal information. Your personal information is stored in secured networks and is only accessible by a limited number of persons who have special access rights.' },
            { title: '5. Cookies', content: 'We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.' },
            { title: '6. Third-Party Links', content: 'Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies.' },
            { title: '7. Your Rights', content: 'You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting us directly.' },
            { title: '8. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at privacy@tripnova.com or write to us at 123 Travel Street, Mumbai, Maharashtra 400001.' },
          ].map((section, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} style={{ marginBottom: 28 }}>
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#12212E', marginBottom: 10 }}>{section.title}</h5>
              <p style={{ color: '#555', lineHeight: 1.8, margin: 0 }}>{section.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPolicy;
