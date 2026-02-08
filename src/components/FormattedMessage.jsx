import React from 'react';

/**
 * Lightweight markdown renderer for AI Coach chat messages.
 * Supports: **bold**, *italic*, numbered lists, bullet lists, and line breaks.
 * Intentionally minimal — no external dependencies needed.
 */

/** Parse inline markdown (bold, italic) within a text string. */
function parseInlineMarkdown(text) {
    const parts = [];
    // Match **bold** and *italic* patterns
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }

        if (match[2]) {
            // **bold**
            parts.push(<strong key={match.index} className="font-semibold">{match[2]}</strong>);
        } else if (match[3]) {
            // *italic*
            parts.push(<em key={match.index}>{match[3]}</em>);
        }

        lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
}

/** Render a single line, detecting list items. */
function renderLine(line, index) {
    const trimmed = line.trim();

    // Numbered list: "1. Item" or "1) Item"
    const numberedMatch = trimmed.match(/^(\d+)[.)]\s+(.+)/);
    if (numberedMatch) {
        return (
            <li key={index} className="ml-4 list-decimal text-sm leading-relaxed">
                {parseInlineMarkdown(numberedMatch[2])}
            </li>
        );
    }

    // Bullet list: "- Item" or "• Item"
    const bulletMatch = trimmed.match(/^[-•]\s+(.+)/);
    if (bulletMatch) {
        return (
            <li key={index} className="ml-4 list-disc text-sm leading-relaxed">
                {parseInlineMarkdown(bulletMatch[1])}
            </li>
        );
    }

    // Empty line → spacing
    if (trimmed === '') {
        return <div key={index} className="h-2" />;
    }

    // Regular paragraph
    return (
        <p key={index} className="text-sm leading-relaxed">
            {parseInlineMarkdown(trimmed)}
        </p>
    );
}

/**
 * Renders AI-generated markdown text with proper formatting.
 * User messages are rendered as plain text.
 */
export default function FormattedMessage({ text, isUser }) {
    if (isUser || !text) {
        return <p className="text-sm whitespace-pre-wrap">{text}</p>;
    }

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let listType = null; // 'ol' or 'ul'

    const flushList = () => {
        if (listItems.length > 0) {
            const Tag = listType === 'ol' ? 'ol' : 'ul';
            elements.push(
                <Tag key={`list-${elements.length}`} className="my-1 space-y-0.5">
                    {listItems}
                </Tag>
            );
            listItems = [];
            listType = null;
        }
    };

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        const isNumbered = /^\d+[.)]\s+/.test(trimmed);
        const isBullet = /^[-•]\s+/.test(trimmed);

        if (isNumbered) {
            if (listType !== 'ol') flushList();
            listType = 'ol';
            listItems.push(renderLine(line, index));
        } else if (isBullet) {
            if (listType !== 'ul') flushList();
            listType = 'ul';
            listItems.push(renderLine(line, index));
        } else {
            flushList();
            elements.push(renderLine(line, index));
        }
    });

    flushList(); // flush any remaining list items

    return <div className="space-y-1">{elements}</div>;
}
