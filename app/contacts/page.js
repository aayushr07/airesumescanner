"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      // Send form data to Formspree
      const response = await fetch("https://formspree.io/f/your_form_id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error(error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <h1 className="text-4xl font-extrabold mb-8">Contact Us</h1>
      <p className="text-lg mb-12 max-w-3xl mx-auto">
        We’d love to hear from you! Please fill out the form below and we’ll get in touch as soon as possible.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-6">
          <label htmlFor="name" className="block text-lg font-semibold mb-2">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-lg font-semibold mb-2">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-lg font-semibold mb-2">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform transform ${
            isSubmitting ? "animate-bounce" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Send Message"}
        </button>
        {submitSuccess && <p className="mt-4 text-green-400">Message sent successfully!</p>}
        {submitError && <p className="mt-4 text-red-400">Failed to send message. Please try again.</p>}
      </form>
    </div>
    </>
  );
}
