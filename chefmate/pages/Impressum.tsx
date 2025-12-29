
import React from 'react';
import { Navbar } from '../components/Navbar';
import { ViewState } from '../types';

interface ImpressumProps {
  onNavigate: (view: ViewState) => void;
}

export const Impressum: React.FC<ImpressumProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-zinc-50/50 relative">
      <Navbar currentView="impressum" onNavigate={onNavigate} />
      
      <main className="max-w-2xl mx-auto px-4 py-16 sm:px-6 relative z-10">
        <div className="
          bg-white/70 backdrop-blur-xl 
          border border-white/50 
          shadow-sm rounded-xl p-8 md:p-12
        ">
          <article className="prose prose-zinc max-w-none prose-headings:tracking-tight prose-headings:font-semibold prose-a:text-chef-green">
            <h1>Impressum</h1>
            
            <div className="not-prose mb-8">
              <p className="text-lg text-zinc-600">Legal Notice</p>
            </div>

            <h3>Information according to § 5 TMG</h3>
            <p>
              <strong>ChefMate AG</strong><br />
              Musterstrasse 1<br />
              8000 Zurich<br />
              Switzerland
            </p>

            <h3>Contact</h3>
            <p>
              <strong>Email:</strong> support@chefmate.com<br />
              <strong>Phone:</strong> +41 44 123 45 67
            </p>

            <h3>Legal Details</h3>
            <p>
              <strong>Represented by:</strong><br />
              John Doe (CEO)
            </p>

            <p>
              <strong>Commercial Register:</strong><br />
              Registered in the Commercial Register of the Canton of Zurich
            </p>

            <p>
              <strong>VAT / UID Number:</strong><br />
              CHE-123.456.789
            </p>

            <hr className="border-zinc-200/60 my-8" />

            <div className="text-sm text-zinc-500 space-y-4">
              <div>
                <strong className="text-zinc-900">Liability for Content</strong>
                <p>
                  As a service provider, we are responsible for our own content on these pages in accordance with general laws. However, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity.
                </p>
              </div>

              <div>
                <strong className="text-zinc-900">Liability for Links</strong>
                <p>
                  Our offer contains links to external third-party websites, over whose content we have no influence. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the pages is always responsible for the content of the linked pages.
                </p>
              </div>

              <div>
                <strong className="text-zinc-900">Copyright</strong>
                <p>
                  The content and works on these pages created by the site operators are subject to copyright law. Duplication, processing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};
