# 🤖 AMOLO.AI Assistant

A modern, clean chatbot interface inspired by Google Gemini AI. Built with pure HTML, CSS (TailwindCSS), and vanilla JavaScript.

## 🚀 Live Demo

**[Try AMOLO.AI Now!](https://amolot500.github.io/amolo-ai-assistant/amolo-index.html)**

## ✨ Features

- 🎨 **Clean & Modern Design** - Minimalist interface with smooth gradient backgrounds
- 💬 **Interactive Chat** - Real-time message bubbles with typing indicators
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Zero Dependencies** - No complex setup, just open and use
- 🎭 **Smooth Animations** - Beautiful transitions and loading states
- 🔧 **Easy to Customize** - Simple HTML structure, easy to modify

## 🖼️ Preview

![AMOLO.AI Interface](https://via.placeholder.com/800x400/4B5563/FFFFFF?text=AMOLO.AI+Chatbot)

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **TailwindCSS** - Utility-first CSS framework (via CDN)
- **Vanilla JavaScript** - No frameworks, pure JS
- **GitHub Pages** - Free hosting

## 📦 Installation & Usage

### Option 1: Use it directly (Recommended)
Just visit the [live demo](https://amolot500.github.io/amolo-ai-assistant/amolo-index.html) - no installation needed!

### Option 2: Clone and run locally
```bash
# Clone the repository
git clone https://github.com/AmoloT500/amolo-ai-assistant.git

# Navigate to the directory
cd amolo-ai-assistant

# Open in your browser
open amolo-index.html
# or simply double-click the file
```

## 🎨 Customization

### Change Branding
Edit the HTML file and modify these sections:
```html
<!-- Logo and Name -->
<div class="w-12 h-12 bg-blue-700 rounded-lg">
    <span class="text-white font-bold text-xl">A</span>
</div>
<span class="text-2xl font-semibold text-blue-700">AMOLO.AI</span>
```

### Change Colors
Modify the Tailwind classes:
- `bg-blue-700` - Brand color
- `bg-gradient-to-br from-gray-200 via-gray-300 to-purple-200` - Background gradient

### Add Real AI Integration
Replace the simulated responses with actual API calls:
```javascript
// Current (simulated):
const aiResponses = ["I'm here to help!"];

// Replace with API call (e.g., OpenAI, Anthropic, Google Gemini):
async function callAI(message) {
    const response = await fetch('YOUR_API_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    return await response.json();
}
```

## 🌟 Features Breakdown

### User Interface
- **Welcome Screen** - Friendly greeting with sparkle icon
- **Message Bubbles** - Distinct styling for user and AI messages
- **Avatar Icons** - Visual identification for each message sender
- **Loading Animation** - Three-dot bounce indicator when AI is "thinking"
- **Smooth Scrolling** - Auto-scroll to latest messages

### User Experience
- **Enter to Send** - Press Enter to send messages quickly
- **Input Validation** - Can't send empty messages
- **Disabled State** - Button disabled while processing
- **Auto-focus** - Input field ready on page load

## 📝 File Structure
