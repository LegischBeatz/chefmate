
import React from 'react';
import { Navbar } from '../components/Navbar';
import { ViewState } from '../types';

interface PrivacyProps {
  onNavigate: (view: ViewState) => void;
}

export const Privacy: React.FC<PrivacyProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-zinc-50/50 relative">
      <Navbar currentView="privacy" onNavigate={onNavigate} />
      
      <main className="max-w-2xl mx-auto px-4 py-16 sm:px-6 relative z-10">
        <div className="
          bg-white/70 backdrop-blur-xl 
          border border-white/50 
          shadow-sm rounded-xl p-8 md:p-12
        ">
          <article className="prose prose-zinc max-w-none prose-headings:tracking-tight prose-headings:font-semibold prose-a:text-chef-green">
            <h1>Privacy Policy</h1>
            <p className="lead text-zinc-600">
              Your privacy is critically important to us. At ChefMate, we have a few fundamental principles regarding your data.
            </p>

            <h3>1. Data Collection</h3>
            <p>
              We collect only the information necessary to provide you with our meal planning services:
            </p>
            <ul>
              <li><strong>Account Information:</strong> We store your email address and name (if provided) to create and authenticate your account.</li>
              <li><strong>Payment History:</strong> If you upgrade to a Pro plan, we store your subscription status and payment history. We do not store your credit card details on our servers.</li>
              <li><strong>Preferences & Recipes:</strong> We store the recipes you save and your dietary preferences to personalize your experience.</li>
            </ul>

            <h3>2. Third-Party Processors</h3>
            <p>
              To run ChefMate, we rely on a selected set of trusted third-party providers. We share data with them only to the extent necessary for the application to function.
            </p>
            <ul>
              <li>
                <strong>Supabase:</strong> Used for our database and user authentication infrastructure. Your account data is securely stored in their cloud environment.
              </li>
              <li>
                <strong>Stripe:</strong> Used for secure payment processing. When you subscribe, your payment details are sent directly to Stripe.
              </li>
              <li>
                <strong>Google Gemini API:</strong> Used as our AI engine. When you generate a meal plan or recipe, your input preferences (ingredients, diet, mood) are sent to Google's API to generate the content. No personally identifiable information (PII) is included in these requests.
              </li>
              <li>
                <strong>PostHog:</strong> Used for anonymous product analytics to help us understand how the app is used and where we can improve.
              </li>
            </ul>

            <h3>3. User Rights</h3>
            <p>
              You maintain full ownership of your data. You have the right to:
            </p>
            <ul>
                <li>Access the personal data we hold about you.</li>
                <li>Request corrections to any inaccurate data.</li>
                <li>Request the complete deletion of your account and associated data at any time via the <strong>Settings</strong> page.</li>
            </ul>

            <h3>4. Cookies</h3>
            <p>
              We use essential cookies to maintain your session (keep you logged in) and remember your preferences. We do not use cookies for third-party advertising tracking.
            </p>

            <hr className="border-zinc-200/60 my-8" />
            
            <p className="text-sm text-zinc-500">
                If you have questions about deleting or correcting your personal data, please contact our support team.
            </p>
          </article>
        </div>
      </main>
    </div>
  );
};
