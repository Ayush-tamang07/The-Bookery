import { useState } from 'react';
import {
  Facebook, Twitter, Instagram, Mail, Book, Youtube, Phone, MapPin,
} from 'lucide-react';

const UserFooter = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    console.log('Newsletter signup:', email);
    alert('Thank you for subscribing to our BookStore!');
    setEmail('');
  };

  return (
    <footer className="bg-amber-50 text-gray-800 pt-16 pb-8 border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8">
          
          {/* Logo and tagline */}
          <div className="w-full md:w-1/3">
            <div className="flex items-center gap-2 mb-4">
              <Book className="h-8 w-8 text-amber-700" />
              <h2 className="text-2xl font-bold text-amber-800">Bookery</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Your destination for literary adventures. Discover stories that inspire, educate, and entertain.
            </p>
            <div className="flex space-x-4 text-amber-700">
              <Facebook className="h-6 w-6" />
              <Twitter className="h-6 w-6" />
              <Instagram className="h-6 w-6" />
              <Youtube className="h-6 w-6" />
            </div>
          </div>

          {/* Explore */}
          <div className="w-full md:w-1/4">
            <h3 className="font-semibold text-lg mb-4 text-amber-800">Explore</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Bestsellers</li>
              <li>New Releases</li>
              <li>Fiction</li>
              <li>Non-Fiction</li>
             
            </ul>
          </div>

          {/* Customer Service */}
          <div className="w-full md:w-1/4">
            <h3 className="font-semibold text-lg mb-4 text-amber-800">Customer Service</h3>
            <ul className="space-y-2 text-gray-600">
              <li>My Account</li>
              <li>Order Status</li>
           
              <li>FAQ</li>
              <li>Contact Us</li>
           
            </ul>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-1/4">
            <h3 className="font-semibold text-lg mb-4 text-amber-800">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Subscribe to our newsletter for new releases, author events, and exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="py-2 px-4 flex-grow border border-amber-300 rounded-l focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={handleSubscribe}
                className="bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-r"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

    
        
      </div>
    </footer>
  );
};

export default UserFooter;
