import { Link } from "react-router-dom";
import SocialIcons from "../SocialIcons";

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        {/* Logo Section */}
        <div className="flex flex-col md:items-start items-center w-full">
          <h1 className="text-3xl font-bold text-blue-500">Edemy LMS</h1>

          <p className="mt-4 text-center md:text-left text-sm text-white/80 leading-6">
            Edemy LMS makes education accessible and engaging, connecting
            students with educators through quality courses, interactive tools,
            and intuitive design.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5 text-lg">Company</h2>

          <ul className="flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-3">
            <li>
              <Link to="/" className="hover:text-blue-400 transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-blue-400 transition">
                About Us
              </Link>
            </li>

            <li>
              <Link
                to="/course-list"
                className="hover:text-blue-400 transition"
              >
                Course List
              </Link>
            </li>

            <li>
              <Link
                to="/my-enrollments"
                className="hover:text-blue-400 transition"
              >
                My Enrollments
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-blue-400 transition">
                Contact Us
              </Link>
            </li>

            <li>
              <Link
                to="/privacy-policy"
                className="hover:text-blue-400 transition"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* New Contact Section */}
        <div className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-white mb-5 text-lg">
            Get In Touch
          </h2>

          <p className="text-sm text-white/80 leading-6 text-center md:text-left">
            Have questions or need support? We're here to help you anytime.
          </p>

          <div className="mt-4 space-y-2 text-sm text-white/70">
            <p>📧 support@edemylms.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 India</p>
          </div>

          <div className="mt-5">
            <SocialIcons />
          </div>
        </div>
      </div>

      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        © Edemy. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
