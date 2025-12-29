
import { sendEmail } from '../email/service';

export const sendWelcomeEmailAction = async (email: string) => {
  return await sendEmail({
    to: email,
    subject: 'Welcome to ChefMate! 🍳',
    html: `
      <div style="font-family: sans-serif; color: #333;">
        <h1 style="color: #059669;">Welcome to ChefMate!</h1>
        <p>We're excited to help you plan your meals and automate your kitchen.</p>
        <p><strong>Here is what you can do next:</strong></p>
        <ul>
            <li>Generate your first meal idea</li>
            <li>Create a weekly plan</li>
            <li>Set up your dietary preferences</li>
        </ul>
        <br/>
        <p>Happy Cooking,<br/>The ChefMate Team</p>
      </div>
    `
  });
};

export const shareRecipeEmailAction = async (email: string, recipeId: string) => {
    // In a real app, fetch recipe details here.
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://chefmate.ai';
    
    return await sendEmail({
        to: email,
        subject: 'Check out this recipe on ChefMate',
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h1 style="color: #059669;">Delicious Recipe Alert!</h1>
            <p>Someone shared a recipe with you.</p>
            <p>
                <a href="${baseUrl}/saved?id=${recipeId}" style="background-color: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    View Recipe
                </a>
            </p>
          </div>
        `
    });
};
