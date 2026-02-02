import Header from "@/components/sections/Header";
import Cart from "@/components/sections/Cart";

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <Cart />
      </main>
      <footer className="bg-brand-navy text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-70">
            © 2025 Materio. All rights reserved. Developed by{" "}
            <a
              href="https://jimmyprogrammer.vercel.app/"
              className="underline"
            >
              Jimmy
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}