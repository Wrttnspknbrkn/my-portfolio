import { useState, useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Send, ArrowUpRight, Github, Linkedin, Instagram, Mail } from "lucide-react";
import Swal from "sweetalert2";
import Komentar from "../components/Commentar";

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/Wrttnspknbrkn", username: "@Wrttnspknbrkn" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/kelvin-fameyeh-9479941a9/", username: "Kelvin Fameyeh" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/kelvin.exe__", username: "@kelvin.exe__" },
  { icon: Mail, label: "Email", href: "mailto:wycekhid10@gmail.com", username: "wycekhid10@gmail.com" },
];

const InputField = memo(({ label, type = "text", name, value, onChange, disabled, isTextarea = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  const inputClasses = `w-full bg-transparent border-b border-border focus:border-accent outline-none py-3 font-sans text-body text-foreground transition-colors duration-300 resize-none ${disabled ? "opacity-50 cursor-not-allowed" : ""
    }`;

  return (
    <div className="relative">
      <motion.label
        className={`absolute left-0 font-sans text-body transition-all duration-300 pointer-events-none ${isFocused || hasValue ? "text-caption text-accent -top-2" : "text-foreground-muted top-3"
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
          className={`${inputClasses} min-h-[100px]`}
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

const SocialCard = memo(({ icon: Icon, label, href, username, index }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex items-center justify-between p-3 border border-border hover:border-accent transition-colors duration-300 w-full min-w-0"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ x: 4 }}
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <Icon
        className="w-4 h-4 flex-shrink-0 text-foreground-muted group-hover:text-accent transition-colors duration-300"
        strokeWidth={1.5}
      />
      <div className="min-w-0 flex-1">
        <p className="font-sans text-body-sm text-foreground truncate">{label}</p>
        <p className="font-sans text-caption text-foreground-muted truncate">{username}</p>
      </div>
    </div>
    <ArrowUpRight className="w-4 h-4 flex-shrink-0 ml-2 text-foreground-muted group-hover:text-accent transition-colors duration-300" />
  </motion.a>
));

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      didOpen: () => { Swal.showLoading(); },
    });

    try {
      const response = await fetch("https://formsubmit.co/ajax/wycekhid10@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");
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

      setFormData({ name: "", email: "", message: "" });
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
    <section className="relative py-16 sm:py-section bg-background overflow-x-hidden w-full" id="Contact">
      <div className="hidden sm:block absolute bottom-0 left-0 w-1/3 h-1/2 bg-accent/[0.02]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div ref={headerRef} className="mb-10 sm:mb-16">
          <motion.div
            className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-mono text-caption uppercase tracking-[0.2em] sm:tracking-[0.3em] text-accent">03</span>
            <div className="w-8 sm:w-12 h-px bg-accent" />
            <span className="font-mono text-caption uppercase tracking-[0.2em] sm:tracking-[0.3em] text-foreground-muted">Contact</span>
          </motion.div>
          <motion.h2
            className="font-serif text-heading sm:text-display text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {"Let's work"} <span className="text-accent">together</span>
          </motion.h2>
          <motion.p
            className="font-sans text-body-sm sm:text-body text-foreground-muted max-w-xl mt-3 sm:mt-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Have a project in mind or just want to say hello? I would love to hear from you.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 w-full">
          <motion.div
            className="w-full min-w-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 w-full">
              <InputField label="Your Name" name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="Your Email" type="email" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} />
              <InputField label="Your Message" name="message" value={formData.message} onChange={handleChange} disabled={isSubmitting} isTextarea />
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
              </motion.button>
            </form>

            <div className="mt-10 sm:mt-16 pt-8 sm:pt-16 border-t border-border w-full">
              <h3 className="font-sans text-caption uppercase tracking-wider text-foreground-muted mb-4 sm:mb-6">
                Connect with me
              </h3>
              <div className="flex flex-col gap-2 sm:gap-3 w-full">
                {socialLinks.map((social, index) => (
                  <SocialCard key={social.label} {...social} index={index} />
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative w-full min-w-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="lg:sticky lg:top-32">
              <div className="border border-border p-4 sm:p-6 lg:p-8 w-full min-w-0 overflow-hidden">
                <h3 className="font-serif text-subheading sm:text-heading text-foreground mb-4 sm:mb-6">
                  Guest Book
                </h3>
                <p className="font-sans text-body-sm text-foreground-muted mb-6 sm:mb-8">
                  Leave a message, share your thoughts, or just say hello.
                </p>
                <Komentar />
              </div>
              <div className="hidden sm:block absolute -bottom-4 -right-4 w-24 h-24 border-r border-b border-accent/30 -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;