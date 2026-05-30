import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, parseFrontmatter, renderMarkdown, renderPost, escapeHtml } from './build-blog.mjs';

test('slugify lowercases, strips punctuation, hyphenates', () => {
  assert.equal(slugify('Prompts Ask. Networks Enforce.'), 'prompts-ask-networks-enforce');
  assert.equal(slugify('MCP is a Supply Chain — Now'), 'mcp-is-a-supply-chain-now');
});

test('parseFrontmatter splits data and content; tags become an array', () => {
  const md = '---\ntitle: Hello World\ndate: 2026-05-30\ntags: a, b\n---\n# Body\ntext';
  const { data, content } = parseFrontmatter(md);
  assert.equal(data.title, 'Hello World');
  assert.equal(data.date, '2026-05-30');
  assert.deepEqual(data.tags, ['a', 'b']);
  assert.match(content, /# Body/);
});

test('parseFrontmatter with no frontmatter returns empty data', () => {
  const { data, content } = parseFrontmatter('# Just body');
  assert.deepEqual(data, {});
  assert.equal(content.trim(), '# Just body');
});

test('escapeHtml escapes the dangerous five', () => {
  assert.equal(escapeHtml('a & b < c > "d" \'e\''), 'a &amp; b &lt; c &gt; &quot;d&quot; &#39;e&#39;');
});

test('renderMarkdown: headings, paragraph, bold, link', () => {
  const html = renderMarkdown('## Title\n\nA **bold** word and a [link](https://x.com).');
  assert.match(html, /<h2[^>]*>Title<\/h2>/);
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /<a href="https:\/\/x\.com"[^>]*>link<\/a>/);
});

test('renderMarkdown: bullet list', () => {
  const html = renderMarkdown('- one\n- two');
  assert.match(html, /<ul>/);
  assert.match(html, /<li>one<\/li>/);
  assert.match(html, /<li>two<\/li>/);
});

test('renderMarkdown: blockquote', () => {
  const html = renderMarkdown('> a quote');
  assert.match(html, /<blockquote><p>a quote<\/p><\/blockquote>/);
});

test('renderMarkdown escapes raw HTML in text', () => {
  const html = renderMarkdown('a <script>x</script> b');
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

test('renderPost wraps shell, injects nav/footer, escapes <title>', () => {
  const html = renderPost(
    { title: 'A & B', date: '2026-05-30', description: 'D' },
    '<p>x</p>', '<nav>N</nav>', '<footer>F</footer>'
  );
  assert.match(html, /<title>A &amp; B/);
  assert.match(html, /<nav>N<\/nav>/);
  assert.match(html, /<footer>F<\/footer>/);
  assert.match(html, /class="blog-article"/);
  assert.match(html, /<p>x<\/p>/);
  assert.match(html, /css\/main\.css/);
});

test('draft posts are excluded from the index', () => {
  const posts = [{ data: { draft: true } }, { data: { draft: false } }, { data: {} }];
  assert.equal(posts.filter(p => !p.data.draft).length, 2);
});
