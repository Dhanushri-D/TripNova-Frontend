import React from 'react';
import { motion } from 'framer-motion';

const Terms = () => (
  <div>
    <div className="page-hero">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>Terms & Conditions</h1>
          <p>Last updated: January 2024</p>
        </motion.div>
      </div>
    </div>
    <div className="container section-padding">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {[
            { title: '1. Acceptance of Terms', content: 'By accessing and using TripNova\'s website and services, you accept and agree to be bound by the terms and provision of this agreement.' },
            { title: '2. Booking and Reservations', content: 'All bookings are subject to availability. A booking is confirmed only upon receipt of full payment or deposit as specified. TripNova reserves the right to cancel any booking that has not been paid for within the specified time.' },
            { title: '3. Cancellation Policy', content: 'Cancellations must be made in writing. Refunds are processed as follows: 30+ days before departure: 100% refund. 15-29 days: 75% refund. 7-14 days: 50% refund. Less than 7 days: No refund.' },
            { title: '4. Travel Documents', content: 'It is the traveler\'s responsibility to ensure they have valid travel documents including passports, visas, and any required health certificates. TripNova is not responsible for any issues arising from invalid or missing documents.' },
            { title: '5. Travel Insurance', content: 'We strongly recommend that all travelers purchase comprehensive travel insurance. TripNova is not liable for any losses, damages, or expenses arising from unforeseen circumstances.' },
            { title: '6. Liability', content: 'TripNova acts as an agent for hotels, airlines, and other service providers. We are not liable for any injury, damage, loss, accident, delay, or irregularity that may occur during your trip.' },
            { title: '7. Changes to Itinerary', content: 'TripNova reserves the right to modify itineraries due to unforeseen circumstances such as weather, political situations, or other factors beyond our control. We will make every effort to provide suitable alternatives.' },
            { title: '8. User Conduct', content: 'Users agree not to use the platform for any unlawful purpose, to post false or misleading information, or to engage in any conduct that could harm other users or TripNova\'s reputation.' },
            { title: '9. Intellectual Property', content: 'All content on TripNova\'s website, including text, graphics, logos, and images, is the property of TripNova and is protected by applicable intellectual property laws.' },
            { title: '10. Governing Law', content: 'These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.' },
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

export default Terms;
