CLAUDE.md - Shopify Theme Development Rules
Project Overview
This is a Shopify theme based on Horizon. We are extending and customizing it for the client's needs. The theme must remain performant, maintainable, and follow Shopify's Online Store 2.0 patterns.

Golden Rules
1. NEVER DELETE - ONLY EXPAND

Do not remove any existing theme code, sections, snippets, or settings
If something needs to be replaced, comment it out with a note explaining why
Always add new functionality alongside existing code
If you think something should be deleted, ask me first and explain why

2. EVERYTHING MUST BE EDITABLE

Follow Horizon's pattern for schema settings
No hardcoded text - use {{ section.settings.title }} or {{ block.settings.text }}
No hardcoded colors - reference theme settings or add section-level color pickers
No hardcoded images - always use image_picker in schema
No hardcoded URLs - use url type in schema settings
Every new section/block must have a complete {% schema %} with all customizable options

Example pattern to follow:
liquid{% schema %}
{
  "name": "Custom Section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Default Title"
    }
  ]
}
{% endschema %}
3. PERFORMANCE IS CRITICAL
Before making any change, evaluate if it impacts performance. If it does, STOP and tell me.
Performance red flags to watch for:

Adding external scripts (JS libraries, fonts, tracking pixels)
Adding large images without lazy loading
Complex Liquid loops (especially nested loops)
Inline CSS or JS that could be in external files
Multiple API calls or metafield queries
Heavy animations or transitions

Performance best practices to follow:

Use loading="lazy" on images below the fold
Use {{ 'file.css' | asset_url | stylesheet_tag }} for styles
Prefer CSS over JavaScript when possible
Use {% render 'snippet' %} instead of {% include %}
Minimize DOM elements
Use responsive images with srcset and image_url filters

4. COMMENTS IN ENGLISH

All code comments must be in English
Be descriptive: explain why, not just what
Use this format for section markers:

liquid{%- comment -%}
  ============================================
  SECTION: Hero Banner
  PURPOSE: Main promotional banner for homepage
  ADDED: 2024-01-15 by MeshPlanet
  ============================================
{%- endcomment -%}

Code Standards
Liquid

Use {%- and -%} to strip whitespace
Prefer render over include
Use meaningful variable names: {% assign product_price = product.price %} not {% assign p = product.price %}
Group related assigns at the top of sections

CSS

Follow Horizon's existing class naming conventions
Use CSS custom properties (variables) when they exist in the theme
Mobile-first approach
No !important unless absolutely necessary (and explain why)

JavaScript

Vanilla JS preferred over jQuery (unless Horizon uses jQuery)
Use defer or async on script tags
Event delegation when possible
No inline onclick handlers

Schema Settings
Always include these when relevant:

"class" for custom CSS classes
Padding/margin controls matching Horizon's pattern
Color scheme selector if Horizon uses them
Visibility toggle ("type": "checkbox", "id": "show_section")


File Organization
├── assets/           → CSS, JS, images (don't modify Horizon core files)
├── config/           → DO NOT TOUCH settings_data.json without asking
├── layout/           → Main theme.liquid (be very careful here)
├── locales/          → Add translations for new strings
├── sections/         → Custom sections go here with prefix: mp-[name].liquid
├── snippets/         → Reusable components with prefix: mp-[name].liquid
├── templates/        → JSON templates (prefer over .liquid templates)
Naming convention for new files: mp- prefix (MeshPlanet)

sections/mp-hero-banner.liquid
snippets/mp-product-card.liquid


Before You Code
For every task, follow this checklist:

Understand - Make sure you understand what I'm asking. If not clear, ask.
Plan - Tell me what files you'll modify/create and why
Performance check - Flag any potential performance concerns
Implement - Make the changes
Summarize - List all modified files and what changed


Communication Style

Respond in Spanish (my native language) but code comments in English
Be concise - I don't need long explanations unless I ask
If you're unsure about something, ask before doing
When showing code, show only the relevant parts, not entire files
If a task is complex, break it into steps and confirm each one


Common Tasks Reference
Adding a new section

Create sections/mp-[name].liquid
Include complete schema with all editable settings
Add to relevant template JSON or tell me how to add it via theme editor

Adding a new snippet

Create snippets/mp-[name].liquid
Document parameters at the top of the file
Show me how to render it: {% render 'mp-[name]', param: value %}

Modifying existing Horizon sections

Don't modify the original file
Create a copy with mp- prefix
Make changes in the copy
Tell me how to swap them in the template


Emergency Commands
If something goes wrong:

I can always revert with git checkout . or Shopify's theme version history
Use /revert in Claude Code to undo last changes
Tell me immediately if you accidentally modified something you shouldn't have


Project-Specific Notes
<!-- Add client-specific notes here as the project evolves -->

Theme: Horizon
Client: [TBD]
Shopify Plan: [TBD]
Special requirements: [TBD]


Last updated: January 2025 by MeshPlanet