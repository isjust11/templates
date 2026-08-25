'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function RsvpForm() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [formData, setFormData] = useState({
    name: '',
    attending: 'yes',
    guests: 1,
  });
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honeypot) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          attending: formData.attending === 'yes',
          guests: parseInt(formData.guests.toString()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <section id="rsvp" className="py-24 px-4 bg-cream-50">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl border border-sage-200 shadow-xl p-8 md:p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block bg-sage-100 text-sage-700 p-6 rounded-full mb-6"
            >
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h3 className="font-display text-3xl text-sage-800 mb-4">
              Рахмет сізге!
            </h3>
            <p className="text-sage-600 font-serif leading-relaxed mb-6">
              Сіздің жауабыңыз қабылданды. Сіздерді тойымызда көруге асығамыз!
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => setSubmitted(false)}
                className="text-sage-700 hover:text-sage-800 font-medium font-sans"
              >
                Басқа жауап жіберу
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="py-24 px-4 bg-cream-50">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-5xl md:text-7xl text-sage-800 mb-6">
            Қатысуды растау
          </h2>
          <div className="w-20 h-px bg-sage-300 mx-auto mb-6" />
          <p className="text-sage-600 font-serif text-lg">
            Қатысатыныңызды немесе қатыспайтыныңызды хабарлаңыз
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-sage-200 shadow-xl p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sage-800 font-medium mb-2 font-sans">
                Толық аты-жөніңіз *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all font-serif"
                placeholder="Аты-жөніңіз"
              />
            </div>

            {/* Attending */}
            <div>
              <label htmlFor="attending" className="block text-sage-800 font-medium mb-2 font-sans">
                Қатысасыз ба? *
              </label>
              <select
                id="attending"
                name="attending"
                required
                value={formData.attending}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all font-serif"
              >
                <option value="yes">Иә, қатысамын!</option>
                <option value="no">Кешіріңіз, қатыса алмаймын</option>
              </select>
            </div>

            {/* Number of Guests */}
            {formData.attending === 'yes' && (
              <div>
                <label htmlFor="guests" className="block text-sage-800 font-medium mb-2 font-sans">
                  Қонақтар саны *
                </label>
                <input
                  type="number"
                  id="guests"
                  name="guests"
                  required
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all font-serif"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sage-800 hover:bg-sage-900 disabled:bg-gray-400 text-cream-50 py-4 rounded-full font-medium font-sans uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl disabled:hover:scale-100"
            >
              {loading ? 'Жіберілуде...' : 'Жауапты жіберу'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
