require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AMOLO.AI Backend'
  });
});

// Chat completion endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gpt-4o-mini' } = req.body;

    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request: messages array is required' 
      });
    }

    // Add system prompt if not present
    const systemPrompt = {
      role: 'system',
      content: 'You are AMOLO.AI, Africa\'s most accessible AI assistant. You are helpful, professional, culturally aware, and provide clear, accurate responses with proper formatting.'
    };

    const fullMessages = [
      systemPrompt,
      ...messages.slice(-10) // Keep last 10 messages for context
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Return response
    res.json({
      success: true,
      message: completion.choices[0].message.content,
      usage: {
        prompt_tokens: completion.usage.prompt_tokens,
        completion_tokens: completion.usage.completion_tokens,
        total_tokens: completion.usage.total_tokens
      }
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your OpenAI configuration.' 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again in a moment.' 
      });
    }
    
    if (error.status === 500) {
      return res.status(500).json({ 
        error: 'OpenAI service error. Please try again.' 
      });
    }

    // Generic error
    res.status(500).json({ 
      error: error.message || 'An error occurred while processing your request.' 
    });
  }
});

// Stream chat completion endpoint (for real-time streaming)
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { messages, model = 'gpt-4o-mini' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request: messages array is required' 
      });
    }

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const systemPrompt = {
      role: 'system',
      content: 'You are AMOLO.AI, Africa\'s most accessible AI assistant. You are helpful, professional, culturally aware, and provide clear, accurate responses with proper formatting.'
    };

    const fullMessages = [systemPrompt, ...messages.slice(-10)];

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: model,
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    // Stream chunks to client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Stream API Error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`ðŸš€ AMOLO.AI Backend running on port ${PORT}`);
  console.log(`ðŸ“ Health check: http://localhost:${PORT}/health`);
  console.log(`ðŸ’¬ Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`ðŸŒŠ Stream endpoint: http://localhost:${PORT}/api/chat/stream`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

