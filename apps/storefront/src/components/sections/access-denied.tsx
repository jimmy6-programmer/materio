import React from 'react';

/**
 * AccessDenied component
 * A minimalist "Access Denied" error message page.
 * Replicates the standard browser-default error style often seen with CDNs like Akamai.
 */
export default function AccessDenied() {
  // Styles are derived from the computed_styles and globals.css provided.
  // The layout follows a basic vertical stack with default browser margins.
  
  return (
    <div className="bg-white min-h-screen p-[8px] font-serif text-black leading-normal selection:bg-[#3390ff] selection:text-white">
      {/* 
        H1 Styling:
        - fontSize: 32px (2em)
        - fontWeight: bold
        - margin: 21.44px 0px (approx 0.67em)
      */}
      <h1 className="text-[32px] font-bold mt-[21.44px] mb-[21.44px] block">
        Access Denied
      </h1>

      {/* 
        Body text and Paragraph Styling:
        - fontSize: 16px (1em)
        - margin: 16px 0px (1em)
      */}
      <div className="text-[16px] mb-[16px]">
        You don't have permission to access "http://www.lowes.com/pl/siding-stone-veneer/4294934233?" on this server.
      </div>

      <p className="text-[16px] my-[16px] block">
        Reference #18.3024c317.1766426063.366f610f
      </p>

      <p className="text-[16px] my-[16px] block whitespace-nowrap overflow-hidden text-ellipsis">
        <a 
          href="https://errors.edgesuite.net/18.3024c317.1766426063.366f610f" 
          className="text-[#0000ee] underline visited:text-[#551a8b]"
        >
          https://errors.edgesuite.net/18.3024c317.1766426063.366f610f
        </a>
      </p>

      {/* Hidden module div from original structure */}
      <div id="module-t06y5j49oin" className="hidden" aria-hidden="true"></div>
    </div>
  );
}