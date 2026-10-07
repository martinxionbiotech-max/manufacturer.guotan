import type { APIRoute } from 'astro';
import { SITES } from '../lib/sites';

/* AI-crawler-friendly robots.txt.
 * Charcoal Hub deliberately allows AI/LLM crawlers: we want our
 * qualification model and (once verified) manufacturer data to be
 * quotable with attribution. */
export const GET: APIRoute = () => {
  const sitemap = `${SITES.manufacturer}/sitemap-index.xml`;

  const aiAgents = [
    'GPTBot',
    'ChatGPT-User',
    'OAI-SearchBot',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'CCBot',
    'Applebot-Extended',
    'Bytespider',
    'Amazonbot',
    'meta-externalagent',
    'cohere-ai',
    'YouBot',
  ];

  const body =
    [
      '# Charcoal Hub — manufacturer.guotan.com',
      '',
      'User-agent: *',
      'Allow: /',
      '',
      ...aiAgents.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', '']),
      `Sitemap: ${sitemap}`,
      '',
    ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
