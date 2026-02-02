"use client";

import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getHomeServices, HomeService } from '@/lib/queries/homeServices';

const HomeServicesSection = () => {
  const [services, setServices] = useState<HomeService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getHomeServices();
        setServices(data);
      } catch (err) {
        setError('Failed to load services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
    scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Do more with Materio
          </h2>
        </div>

        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 scrollbar-hide snap-x snap-mandatory no-scrollbar pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div key={i} className="flex-none w-[280px] h-64 bg-gray-100 rounded-lg animate-pulse" />
                ))
              : services.length > 0
              ? services.map((service) => (
                  <div
                    key={service.id}
                    className="flex-none w-[280px] snap-start border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    {service.image_url && (
                      <div className="relative h-[160px] w-full bg-gray-100">
                        <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{service.category}</div>
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">{service.title}</h3>
                      {service.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-800 mr-3">From R{service.price_from}</span>
                        <Link href={`/book?service=${service.id}`} className="bg-[#004990] text-white px-3 py-1 rounded text-sm hover:bg-[#003d73] transition-colors">Book Service</Link>
                      </div>
                    </div>
                  </div>
                ))
              : (
                <div className="text-center text-gray-500 py-8">No services available at the moment.</div>
              )}
          </div>

          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous services"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-2 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next services"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default HomeServicesSection;