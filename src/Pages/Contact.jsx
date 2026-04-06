import { useState, useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Send, ArrowUpRight, Github, Linkedin, Instagram, Mail } from "lucide-react";
import Swal from "sweetalert2";
import Komentar from "../components/Commentar";

// Social link data
const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Wrttnspknbrkn",
    username: "@Wrttnspknbrkn",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kelvin-fameyeh-9479941a9/",
    username: "Kelvin Fameyeh",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/kelvin.exe__",
    username: "@kelvin.exe__",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:wycekhid10@gmail.com",
    username: "wycekhid10@gmail.com",
  },
];

// Input field component
const InputField = memo(({ label, type = "text", name, value, onChange, disabled, isTextarea = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  const inputClasses = `w-full bg-transparent border-b border-border focus:border-accent outline-none py-4 font-sans text-body text-foreground transition-colors duration-300 resize-none ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

  return (
    <div className="relative">
      <motion.label
        className={`absolute left-0 font-sans text-body transition-all duration-300 pointer-events-none ${
          isFocused || hasValue
            ? "text-caption text-accent -top-2"
            : "text-foreground-muted top-4"
        }`}
      >
        {label}
      </motion.label>
      {isTextarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`${inputClasses} min-h-[120px]`}
          required
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={inputClasses}
          required
        />
      )}
    </div>
  );
});

// Social link card
const SocialCard = memo(({ icon: Icon, label, href, username, index }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center justify-between p-6 border border-border hover:border-accent transition-colors duration-300"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ x: 4 }}
  >
    <div className="flex items-center gap-4">
      <Icon className="w-5 h-5 text-foreground-muted group-hover:text-accent transition-colors duration-300" strokeWidth={1.5} />
      <div>
        <p className="font-sans text-body-sm text-foreground">{label}</p>
        <p className="font-sans text-caption text-foreground-muted">{username}</p>
      </div>
    </div>
    <ArrowUpRight className="w-4 h-4 text-foreground-muted group-hover:text-accent transition-colors duration-300" />
  </motion.a>
));

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    Swal.fire({
      title: "Sending Message...",
      html: "Please wait while we send your message",
      allowOutsideClick: false,
      background: "#0D0D0D",
      color: "#FAFAF9",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/wycekhid10@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await response.json();

      Swal.fire({
        title: "Message Sent",
        text: "Thank you for reaching out. I will get back to you soon.",
        icon: "success",
        confirmButtonColor: "#C9A87C",
        timer: 3000,
        timerProgressBar: true,
        background: "#0D0D0D",
        color: "#FAFAF9",
      });

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonColor: "#C9A87C",
        background: "#0D0D0D",
        color: "#FAFAF9",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-section bg-background overflow-hidden" id="Contact">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-accent/[0.02]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="mb-16">
          <motion.span
            className="font-sans text-caption uppercase tracking-[0.3em] text-accent block mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            Contact
          </motion.span>
          <motion.div
            className="w-12 h-px bg-accent mb-8"
            initial={{ scaleX: 0 }}
            animate={isHeaderInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ transformOrigin: "left" }}
          />
          <motion.h2
            className="font-serif text-display text-foreground max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {"Let's work"} <span className="text-accent">together</span>
          </motion.h2>
          <motion.p
            className="font-sans text-body text-foreground-muted max-w-xl mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Have a project in mind or just want to say hello? I would love to hear from you.
          </motion.p>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <InputField
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <InputField
                label="Your Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSubmitting}
              />
              <InputField
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                isTextarea
              />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </motion.button>
            </form>

            {/* Social links */}
            <div className="mt-16 pt-16 border-t border-border">
              <h3 className="font-sans text-caption uppercase tracking-wider text-foreground-muted mb-6">
                Connect with me
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <SocialCard key={social.label} {...social} index={index} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Comments section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sticky top-32">
              <div className="border border-border p-6 lg:p-8">
                <h3 className="font-serif text-heading text-foreground mb-6">
                  Guest Book
                </h3>
                <p className="font-sans text-body-sm text-foreground-muted mb-8">
                  Leave a message, share your thoughts, or just say hello. I appreciate every visitor.
                </p>
                <Komentar />
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-accent/30 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
