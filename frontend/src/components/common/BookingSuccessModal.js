import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';

const COLORS = ['#307082', '#EA9940', '#6CA3A2', '#ffc107', '#e74c3c', '#28a745', '#fff'];

const random = (min, max) => Math.random() * (max - min) + min;

const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const pieces = Array.from({ length: 120 }, () => ({
      x: random(0, canvas.width),
      y: random(-canvas.height, 0),
      w: random(8, 16),
      h: random(6, 12),
      color: COLORS[Math.floor(random(0, COLORS.length))],
      rotation: random(0, 360),
      rotSpeed: random(-4, 4),
      speedY: random(2, 5),
      speedX: random(-1.5, 1.5),
      opacity: 1,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = random(0, canvas.width);
          p.opacity = 1;
        }
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', borderRadius: 24 }} />;
};

const BookingSuccessModal = ({ show, onClose, item, type }) => {
  const typeLabel = type === 'hotel' ? 'Hotel' : type === 'trip' ? 'Trip' : 'Package';
  const typeIcon = type === 'hotel' ? 'bi-building' : type === 'trip' ? 'bi-geo-alt' : 'bi-briefcase';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(18,33,46,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderRadius: 24, padding: '40px 36px', maxWidth: 460, width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.25)' }}
          >
            <Confetti />

            {/* Close */}
            <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="bi bi-x" style={{ fontSize: '1.1rem' }}></i>
            </button>

            {/* Trophy */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
              style={{ position: 'relative', zIndex: 1 }}
            >
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'linear-gradient(135deg, #EA9940, #f5c06a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(234,153,64,0.4)' }}>
                <i className="bi bi-trophy-fill" style={{ fontSize: '2.4rem', color: 'white' }}></i>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 4 }}>🎉</div>
              <h3 style={{ fontFamily: 'Poppins', fontWeight: 800, color: '#12212E', marginBottom: 6, fontSize: '1.5rem' }}>
                Congratulations!
              </h3>
              <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: 20 }}>
                Your {typeLabel.toLowerCase()} has been successfully booked. Get ready for an amazing experience!
              </p>

              {/* Booking Summary */}
              <div style={{ background: 'linear-gradient(135deg, #f8fbfc, #eef6f7)', borderRadius: 14, padding: '16px 20px', marginBottom: 24, textAlign: 'left', border: '1px solid rgba(48,112,130,0.12)' }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <img src={item?.image} alt={item?.title || item?.name} style={{ width: 52, height: 52, borderRadius: 10, objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '0.92rem', color: '#12212E' }}>{item?.title || item?.name}</div>
                    <div style={{ color: '#888', fontSize: '0.78rem' }}>
                      <i className={`bi ${typeIcon} me-1`} style={{ color: '#307082' }}></i>{typeLabel}
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between" style={{ fontSize: '0.85rem' }}>
                  <span style={{ color: '#666' }}>{type === 'hotel' ? 'Location' : 'Destination'}</span>
                  <span style={{ fontWeight: 600, color: '#307082' }}>{item?.destination || item?.location}</span>
                </div>
                {item?.duration && (
                  <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: '#666' }}>Duration</span>
                    <span style={{ fontWeight: 600 }}>{item.duration}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.85rem' }}>
                  <span style={{ color: '#666' }}>Amount Paid</span>
                  <span style={{ fontWeight: 800, color: '#28a745', fontSize: '0.95rem' }}>{formatPrice(item?.price)}</span>
                </div>
              </div>

              <div className="d-flex gap-3">
                <Link to="/my-bookings" onClick={onClose} className="btn btn-teal w-100" style={{ borderRadius: 10, fontWeight: 700 }}>
                  <i className="bi bi-calendar-check me-2"></i>View Booking
                </Link>
                <button onClick={onClose} className="btn btn-outline-teal w-100" style={{ borderRadius: 10, fontWeight: 600 }}>
                  Continue Exploring
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingSuccessModal;
