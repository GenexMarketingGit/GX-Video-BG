=== GX Video Background ===
Contributors: genex
Tags: block, video, background, hero, parallax
Requires at least: 6.4
Tested up to: 6.7
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later

Native Gutenberg block for video backgrounds with focal-point control, fixed scroll-follow, and InnerBlocks nesting. Compatible with GeneratePress + GenerateBlocks.

== Description ==

* Native block — nest any block(s) inside (paragraphs, headings, GenerateBlocks containers, columns, buttons, etc.)
* Choose video from Media Library or paste an external MP4/WebM URL
* Optional poster image (used during load + as mobile fallback)
* Height modes: 100vh / 50vh / custom (any CSS unit) / auto
* Focal point picker (X/Y %) — controls `object-position` so the right part of the video stays visible at any size
* Fixed (parallax) scroll-follow mode — uses CSS `clip-path` to keep the video pinned to the viewport while content scrolls over it, with no JS
* Overlay color + opacity
* Autoplay / loop / muted / playsinline / mobile-disable toggles
* Full-width and wide alignment supported
* Pure CSS frontend — no jQuery, no build step, no runtime JS

== Installation ==

1. Drop the `gx-videobg` folder into `wp-content/plugins/`.
2. Activate from Plugins.
3. Add the **Video Background** block from the inserter (Design category).

== Usage with GenerateBlocks ==

The block produces a single outer `<div class="gx-videobg">` with a stacking context. You can place a `generateblocks/element` directly inside the content area and it will inherit the layout — use the block's own padding/margin controls for spacing, or set `Inner content max-width` to constrain content.

== Notes on Fixed Mode ==

Fixed mode uses `clip-path: inset(0)` on the parent so the inner `position: fixed` video is clipped to the block's bounding rectangle. This works in all evergreen browsers. On screens ≤ 768px the fixed mode is automatically disabled to avoid iOS Safari rendering quirks.
