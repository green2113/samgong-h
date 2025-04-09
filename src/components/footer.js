import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center p-4 mt-10 fixed w-full left-0">
      <p>© 2025 notion. All rights reserved.</p>
      <p><a href="/privacy-policy" className="underline">개인정보처리방침</a> | <a href="/contact" className="underline">고객센터</a></p>
    </footer>
  );
}

export default Footer;
