import React from 'react';

const PLPHeader = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12 border-b border-border/50">
        <h1 className="text-4xl md:text-5xl font-black text-brand-navy mb-4 tracking-tight">Siding & Stone Veneer</h1>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center text-sm md:text-base text-muted-foreground bg-secondary/30 px-4 py-2 rounded-full border border-border/50 w-fit">
            <span className="font-bold text-foreground mr-1.5 underline decoration-brand-action/30 decoration-2">626 results</span>
            <span>in "Siding & Stone Veneer"</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#777]">Department:</span>
            <span className="text-xs font-bold text-brand-navy hover:underline cursor-pointer bg-brand-navy/5 px-3 py-1 rounded-md">Building Supplies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PLPHeader;
