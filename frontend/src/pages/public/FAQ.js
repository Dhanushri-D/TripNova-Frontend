import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FAQS = [
  { q: 'How do I book a tour package?', a: 'Browse our packages, click "View Details", and then click "Book This Package". You\'ll need to be logged in to complete the booking.' },
  { q: 'Can I customize my itinerary?', a: 'Yes! Use our Trip Planner feature to create a custom itinerary based on your budget, interests, and travel dates.' },
  { q: 'What is the cancellation policy?', a: 'Cancellations made 30+ days before departure receive a full refund. 15-29 days: 75% refund. 7-14 days: 50% refund. Less than 7 days: no refund.' },
  { q: 'Are the hotel prices per night?', a: 'Yes, all hotel prices displayed are per night per room. Prices may vary based on season and availability.' },
  { q: 'How do I add destinations to my wishlist?', a: 'Click the heart icon on any destination card. You need to be logged in to save to your wishlist.' },
  { q: 'Is my payment information secure?', a: 'TripNova uses industry-standard encryption to protect all your personal and payment information.' },
  { q: 'Can I travel solo?', a: 'Absolutely! We have packages designed for solo travelers, couples, families, and groups of all sizes.' },
  { q: 'Do you offer international packages?', a: 'Yes! We offer packages to Bali, Maldives, Switzerland, Thailand, Dubai, and many more international destinations.' },
  { q: 'How do I contact customer support?', a: 'You can reach us via the Contact Us page, email at hello@tripnova.com, or call +91 98765 43210 (Mon-Sat, 9AM-7PM).' },
  { q: 'What documents do I need for international travel?', a: 'You\'ll need a valid passport (6+ months validity), visa (if required), travel insurance, and any destination-specific documents.' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common questions about TripNova</p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <span className="section-badge">FAQ</span>
              <h2 className="section-title">Got Questions? We Have Answers</h2>
            </div>
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                style={{ background: 'white', borderRadius: 12, marginBottom: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{ width: '100%', background: 'none', border: 'none', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '0.95rem', color: '#12212E' }}>{faq.q}</span>
                  <i className={`bi ${openIndex === i ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ color: '#307082', flexShrink: 0, marginLeft: 12 }}></i>
                </button>
                {openIndex === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ padding: '0 24px 18px', color: '#555', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}

            <div className="text-center mt-5" style={{ background: 'rgba(48,112,130,0.08)', borderRadius: 16, padding: 32 }}>
              <h5 style={{ fontFamily: 'Poppins', fontWeight: 700, marginBottom: 8 }}>Still have questions?</h5>
              <p style={{ color: '#666', marginBottom: 20 }}>Our travel experts are here to help you plan the perfect trip.</p>
              <a href="/contact" className="btn btn-teal px-4">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
