import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">About MessMate</h1>
          <p className="text-xl text-gray-600">Revolutionizing hostel dining, one meal at a time.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 h-3 w-full"></div>
          
          <div className="p-8 md:p-12 space-y-12">
            
            {/* The Problem */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-3xl">📉</span> The Problem
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                For decades, hostel messes have operated on rigid, manual coupon systems. This leads to massive food wastage when students are unexpectedly absent, long queues, and an overall lack of transparency. Students pay for meals they don't eat, and administrators struggle to accurately predict food quantities.
              </p>
            </section>

            {/* The Solution */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="text-3xl">🚀</span> Our Solution
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                MessMate digitizes the entire mess operation. By giving students a portal to view tomorrow's menu and dynamically check or uncheck the meals they plan to eat (before a nightly deadline), we generate a precise headcount.
              </p>
            </section>

            {/* Key Features Grid */}
            <section className="grid md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              <div className="bg-blue-50 p-6 rounded-2xl">
                <h3 className="font-bold text-blue-900 text-lg mb-2">For Students</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>✅ Total flexibility over daily meals</li>
                  <li>✅ Digital Wallet for canteen snacks</li>
                  <li>✅ Vote on upcoming special menus</li>
                  <li>✅ Auto-Pilot mode for automatic registration</li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-6 rounded-2xl">
                <h3 className="font-bold text-green-900 text-lg mb-2">For Mess Admins</h3>
                <ul className="space-y-2 text-green-800">
                  <li>✅ Zero food waste with exact headcounts</li>
                  <li>✅ Easy menu publishing</li>
                  <li>✅ Real-time night canteen order management</li>
                  <li>✅ Data-driven insights into student preferences</li>
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
