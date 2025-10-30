"use client";

const Footer = () => {
  return (
    <footer className="bg-primary-600 text-white py-6 px-8 md:px-20 mt-10 fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-start items-center">
        {/* Right: Copyright */}
        <div className="text-sm">
          &copy; {new Date().getFullYear()} MyCompany. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
