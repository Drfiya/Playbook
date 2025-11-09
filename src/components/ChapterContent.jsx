import React from 'react';

const ChapterContent = ({ content }) => {
  // Parse and render markdown-style content
  const renderContent = (text) => {
    // Split by paragraphs
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((para, index) => {
      // Handle headers
      if (para.startsWith('###')) {
        const headerText = para.replace(/^###\s*/, '').trim();
        return (
          <h3 key={index} className="text-xl font-bold text-navy-800 mt-8 mb-4">
            {headerText}
          </h3>
        );
      }
      
      if (para.startsWith('##')) {
        const headerText = para.replace(/^##\s*/, '').trim();
        return (
          <h2 key={index} className="text-2xl font-bold text-navy-800 mt-10 mb-5">
            {headerText}
          </h2>
        );
      }
      
      // Handle horizontal rules
      if (para.trim() === '---') {
        return <hr key={index} className="my-8 border-silver-300" />;
      }
      
      // Handle blockquotes/callouts (lines starting with *")
      if (para.startsWith('*"') || para.trim().startsWith('**')) {
        return (
          <div key={index} className="my-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500 rounded-r-lg">
            <p className="text-purple-900 italic font-medium leading-relaxed">
              {renderInlineFormatting(para.replace(/^\*+"|"$/g, ''))}
            </p>
          </div>
        );
      }
      
      // Handle bullet points
      if (para.trim().startsWith('- ') || para.trim().startsWith('* ')) {
        const items = para.split('\n').filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '));
        return (
          <ul key={index} className="my-4 space-y-2 ml-6">
            {items.map((item, i) => (
              <li key={i} className="flex items-start">
                <span className="text-navy-600 mr-3">•</span>
                <span className="text-silver-800 leading-relaxed">{renderInlineFormatting(item.replace(/^[-*]\s*/, ''))}</span>
              </li>
            ))}
          </ul>
        );
      }
      
      // Handle checkboxes
      if (para.includes('- [ ]')) {
        const items = para.split('\n').filter(line => line.includes('- [ ]'));
        return (
          <div key={index} className="my-4 space-y-2">
            {items.map((item, i) => (
              <label key={i} className="flex items-start cursor-pointer hover:bg-silver-50 p-2 rounded transition-colors">
                <input type="checkbox" className="mt-1 mr-3 text-navy-600" />
                <span className="text-silver-800 leading-relaxed">{renderInlineFormatting(item.replace(/^-\s*\[\s*\]\s*/, ''))}</span>
              </label>
            ))}
          </div>
        );
      }
      
      // Handle tables (lines starting with |)
      if (para.includes('|') && para.split('\n').some(line => line.trim().startsWith('|'))) {
        const lines = para.split('\n').filter(line => line.trim());
        const tableRows = lines.filter(line => line.trim().startsWith('|') && !line.includes('---'));
        
        if (tableRows.length > 0) {
          const headerRow = tableRows[0];
          const dataRows = tableRows.slice(1);
          
          // Parse header
          const headers = headerRow.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell)
            .map(cell => cell.replace(/^\*\*|\*\*$/g, ''));
          
          return (
            <div key={index} className="my-8 overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-navy-700 text-white">
                    {headers.map((header, i) => (
                      <th key={i} className="px-6 py-4 text-left font-bold text-sm uppercase tracking-wider border-r border-navy-600 last:border-r-0">
                        {renderInlineFormatting(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataRows.map((row, rowIndex) => {
                    const cells = row.split('|')
                      .map(cell => cell.trim())
                      .filter(cell => cell);
                    
                    return (
                      <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-silver-50' : 'bg-white'} hover:bg-navy-50 transition-colors`}>
                        {cells.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 text-sm text-silver-800 border-r border-silver-200 last:border-r-0 leading-relaxed">
                            {renderInlineFormatting(cell)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Handle special callout boxes (lines with emoji at start)
      if (/^[🎓🔧🚀⚠️💎📋✅]/.test(para)) {
        return (
          <div key={index} className="my-6 p-5 bg-silver-50 border-2 border-silver-300 rounded-xl">
            <p className="text-silver-900 font-medium leading-relaxed">
              {renderInlineFormatting(para)}
            </p>
          </div>
        );
      }
      
      // Regular paragraphs
      if (para.trim()) {
        return (
          <p key={index} className="mb-4 text-silver-800 leading-relaxed text-lg">
            {renderInlineFormatting(para)}
          </p>
        );
      }
      
      return null;
    }).filter(Boolean);
  };
  
  // Handle inline formatting (bold, italic, code)
  const renderInlineFormatting = (text) => {
    const parts = [];
    let currentIndex = 0;
    let key = 0;
    
    // Pattern to match **bold**, *italic*, `code`, and "quotes"
    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|"[^"]+"|←)/g;
    let match;
    
    while ((match = pattern.exec(text)) !== null) {
      // Add text before match
      if (match.index > currentIndex) {
        parts.push(
          <span key={`text-${key++}`}>
            {text.substring(currentIndex, match.index)}
          </span>
        );
      }
      
      const matched = match[0];
      
      // Handle bold
      if (matched.startsWith('**') && matched.endsWith('**')) {
        parts.push(
          <strong key={`bold-${key++}`} className="font-bold text-navy-900">
            {matched.slice(2, -2)}
          </strong>
        );
      }
      // Handle italic
      else if (matched.startsWith('*') && matched.endsWith('*') && !matched.startsWith('**')) {
        parts.push(
          <em key={`italic-${key++}`} className="italic text-silver-700">
            {matched.slice(1, -1)}
          </em>
        );
      }
      // Handle code
      else if (matched.startsWith('`') && matched.endsWith('`')) {
        parts.push(
          <code key={`code-${key++}`} className="px-2 py-1 bg-silver-200 rounded text-sm font-mono text-navy-800">
            {matched.slice(1, -1)}
          </code>
        );
      }
      // Handle quotes
      else if (matched.startsWith('"') && matched.endsWith('"')) {
        parts.push(
          <span key={`quote-${key++}`} className="text-navy-700 font-medium">
            {matched}
          </span>
        );
      }
      // Handle arrow
      else if (matched === '←') {
        parts.push(
          <span key={`arrow-${key++}`} className="text-green-600 font-bold mx-2">
            ←
          </span>
        );
      }
      else {
        parts.push(<span key={`other-${key++}`}>{matched}</span>);
      }
      
      currentIndex = match.index + matched.length;
    }
    
    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(
        <span key={`text-${key++}`}>
          {text.substring(currentIndex)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : text;
  };
  
  return (
    <div className="prose prose-lg max-w-none">
      {renderContent(content)}
    </div>
  );
};

export default ChapterContent;