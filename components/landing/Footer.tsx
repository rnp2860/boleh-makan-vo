'use client';

// 🇲🇾 Boleh Makan Footer

import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const LINKS = {
  company: [
    { label: 'Tentang Kami', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kerjaya', href: '/careers' },
  ],
  legal: [
    { label: 'Polisi Privasi', href: '/privacy' },
    { label: 'Terma Penggunaan', href: '/terms' },
    { label: 'Penafian', href: '/disclaimer' },
  ],
  support: [
    { label: 'Bantuan', href: '/help' },
    { label: 'Hubungi Kami', href: '/contact' },
    { label: 'FAQ', href: '/faq' },
  ],
};

const SOCIAL = [
  { icon: Instagram, href: 'https://instagram.com/bolehmakan', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/bolehmakan', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/bolehmakan', label: 'Twitter' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl 
                             flex items-center justify-center">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className="text-xl font-bold text-white">Boleh Makan</span>
            </div>
            
            <p className="text-slate-400 mb-6 max-w-xs">
              Aplikasi kesihatan AI percuma untuk rakyat Malaysia. 
              Makan bijak, hidup sihat.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {SOCIAL.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center
                              hover:bg-slate-700 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Links Columns */}
          <div>
            <h4 className="text-white font-semibold mb-4">Syarikat</h4>
            <ul className="space-y-3">
              {LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Undang-Undang</h4>
            <ul className="space-y-3">
              {LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Sokongan</h4>
            <ul className="space-y-3">
              {LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Email */}
            <div className="mt-6">
              <a 
                href="mailto:hello@bolehmakan.my"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 
                          transition-colors duration-200"
              >
                <Mail className="w-4 h-4" />
                hello@bolehmakan.my
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 Boleh Makan. Hak cipta terpelihara.
            </p>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              Dibina dengan <Heart className="w-4 h-4 text-red-400 inline" /> di Malaysia untuk rakyat Malaysia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

