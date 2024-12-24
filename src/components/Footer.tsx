import React from 'react'

const Footer = () => {
  return (
    <footer className="p-4 md:p-6 shadow-md bg-slate-950 text-white">  
        <div className="container mx-auto">
            <p className="text-center">© {new Date().getFullYear()} Mystry Message. All rights reserved.</p>
        </div>
    </footer>
  );
}

export default Footer
