import React, { useState } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    reason: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/v1/email/request-admin-access', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error sending request', error);
      setError('There was an issue submitting your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="py-4 bg-light">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              {/* Optional Lottie animation here */}
            </div>
            <div className="col-lg-6">
              <div className="row gy-4">
                <div className="mt-5">
                  <p className="text-secondary">
                    If you need admin privileges, please fill out the form below with the necessary details.
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <input
                        type="text"
                        id="name"
                        className="form-control"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Your Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <input
                        type="text"
                        id="role"
                        className="form-control"
                        placeholder="Your Role or Affiliation"
                        required
                        value={formData.role}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-4">
                      <textarea
                        id="reason"
                        className="form-control"
                        rows="4"
                        placeholder="Describe why you need admin access"
                        required
                        value={formData.reason}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-success btn-md" disabled={loading}>
                      {loading ? 'Submitting...' : 'Request Admin Access'}
                    </button>
                    {submitted && (
                      <p className="mt-3 text-success">Your request has been submitted successfully!</p>
                    )}
                    {error && (
                      <p className="mt-3 text-danger">{error}</p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
