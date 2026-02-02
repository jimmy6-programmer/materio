import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = () => {
  const items = [
    { label: 'Building Supplies', href: '#' },
  ];

  return (
    <nav className="flex items-center space-x-2 text-[12px] text-muted-foreground py-4 container mx-auto px-4">
      <a href="/" className="hover:underline">Materio</a>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <ChevronRight className="w-3 h-3" />
          <a 
            href={item.href} 
            className={`hover:underline ${index === items.length - 1 ? 'font-semibold text-foreground' : ''}`}
          >
            {item.label}
          </a>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
