import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold">Exam Mastery Hub</div>
          <nav className="space-x-6">
            <Link
              to="/login"
              className="hover:text-yellow-300 transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">MASTERSY HUB</h1>
        <p className="text-xl mb-8 opacity-90">
          A Series of Business and Skills Training Policy Exam in Continuing
          Workforce
        </p>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Tournament at annual job/consultant?
          </h2>
        </div>

        {/* Resources Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Resources</h3>
          <div className="space-y-2">
            <div>www.maasteryhub.com</div>
            <div>https://www.mastersyhub.com</div>
          </div>
        </div>

        {/* Signals Section */}
        <div className="bg-yellow-500 text-black rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-2">Signals</h3>
          <ul className="space-y-2">
            <li>• Upgrade with Groups</li>
            <li>• Any part within Scotland is allowed.</li>
          </ul>
        </div>

        {/* Login Button */}
        <div className="mt-12">
          <Link
            to="/login"
            className="bg-yellow-500 text-black px-8 py-4 rounded-lg text-xl font-semibold hover:bg-yellow-400 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
