/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  MessageCircle, 
  Menu, 
  X, 
  Star, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ArrowRight,
  ChevronRight,
  Instagram,
  Mail,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'motion/react';

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  isBestseller?: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  city: string;
  content: string;
  rating: number;
  initial: string;
}

// --- Constants ---
const PRODUCTS: Product[] = [
  { id: 1, name: "Keranjang Rotan Anyam", price: 185000, category: "Dekorasi Rumah", isBestseller: true },
  { id: 2, name: "Bingkai Foto Macramé", price: 120000, category: "Hadiah" },
  { id: 3, name: "Lilin Aromaterapi Handmade", price: 95000, category: "Dekorasi Rumah" },
  { id: 4, name: "Tote Bag Rajut Custom", price: 210000, category: "Custom Order", isBestseller: true },
  { id: 5, name: "Vas Keramik Lukis Tangan", price: 275000, category: "Dekorasi Rumah" },
  { id: 6, name: "Hamper Box Custom", price: 350000, category: "Hadiah" },
];

const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Siti Aminah", city: "Jakarta", content: "Kualitas macramé-nya luar biasa rapi. Benar-benar mempercantik ruang tamu saya. Pengemasan sangat aman!", rating: 5, initial: "S" },
  { id: 2, name: "Budi Santoso", city: "Bandung", content: "Pesan kado custom untuk ulang tahun istri, prosesnya cepat dan hasilnya jauh lebih bagus dari ekspektasi. Recommended!", rating: 5, initial: "B" },
  { id: 3, name: "Larasati", city: "Yogyakarta", content: "Lilin aromaterapinya wangi banget dan tahan lama. Design wadahnya juga estetik buat pajangan. Suka banget!", rating: 5, initial: "L" },
];

const CATEGORIES = ["Semua", "Dekorasi Rumah", "Hadiah", "Custom Order"];

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', href: '#home' },
    { name: 'Produk', href: '#products' },
    { name: 'Tentang Kami', href: '#about' },
    { name: 'Testimoni', href: '#testimonials' },
    { name: 'Kontak', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm border-b border-secondary/30 py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center text-[#2C2C2C]">
        <a href="#home" className="text-2xl md:text-3xl font-serif font-bold tracking-tight">
          Erlina Craft
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium hover:text-[#D4AF82] transition-colors uppercase tracking-widest">
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => window.location.href="https://wa.me/6281234567890"}
            className="bg-[#D4AF82] text-white px-6 py-3 rounded-[4px] text-sm font-bold hover:bg-opacity-90 transition-all transform hover:-translate-y-0.5 shadow-md uppercase tracking-wider"
          >
            Pesan Sekarang
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-xl lg:hidden border-t"
          >
            <div className="flex flex-col p-6 space-y-4 text-primary">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium border-b border-gray-100 pb-2 flex justify-between items-center"
                >
                  {link.name} <ChevronRight size={16} className="text-secondary" />
                </a>
              ))}
              <a 
                href="https://wa.me/6281234567890" 
                className="bg-[#D4AF82] text-white text-center py-4 rounded-[4px] font-bold text-lg uppercase tracking-wider"
              >
                Pesan Sekarang
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const StatItem = ({ value, label }: { value: string, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <div ref={ref} className="text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-serif font-bold text-[#D4AF82] mb-1"
      >
        {value}
      </motion.div>
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</div>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product, key?: React.Key }) => {
  const whatsappUrl = `https://wa.me/6281234567890?text=Halo%20Erlina%20Craft%2C%20saya%20tertarik%20memesan%20${encodeURIComponent(product.name)}.%20Boleh%20info%20lebih%20lanjut%3F`;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="group bg-[#E8DDD0] rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full border border-gray-100/50"
    >
      <div className="relative aspect-[4/5] overflow-hidden flex items-center justify-center">
        {/* Placeholder image representation match theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8DDD0] to-[#D4AF82]" />
        <ShoppingBag className="text-white/30 w-16 h-16" />
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
           <span className="font-serif text-lg font-bold text-white/50 italic group-hover:text-white transition-colors duration-300 uppercase tracking-widest">
            {product.name}
           </span>
        </div>
        
        {product.isBestseller && (
          <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg z-10">
            Bestseller
          </span>
        )}
        
        <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
           <div className="bg-white/90 backdrop-blur p-2.5 rounded-full shadow-md">
              <Heart className="text-secondary w-5 h-5" fill="currentColor" />
           </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow bg-white">
        <div className="text-[10px] font-bold text-[#D4AF82] uppercase tracking-[0.2em] mb-1">{product.category}</div>
        <h3 className="text-xl font-serif font-bold text-[#1A1A1A] mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-secondary font-bold text-lg mb-4">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
        <div className="mt-auto">
          <a 
            href={whatsappUrl}
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-2.5 rounded-[4px] font-bold text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-sm"
          >
            Order via WhatsApp
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const filteredProducts = activeFilter === "Semua" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeFilter);

  return (
    <div className="relative overflow-hidden selection:bg-[#D4AF82] selection:text-white">
      <Navbar />

      {/* 1. HERO SECTION */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#FDFAF6]">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#E8DDD0]/30 -skew-x-12 transform origin-top translate-x-20 -z-10" />
        
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-3/5"
            >
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary leading-[1.1] mb-6">
                Kerajinan Tangan, <br /><span className="text-secondary">Dibuat dengan Cinta</span>
              </h1>
              <p className="text-base md:text-lg text-gray-500 mb-10 max-w-lg leading-relaxed font-medium">
                Setiap karya Erlina Craft adalah hasil tangan terampil yang menghadirkan keindahan unik untuk rumah & hadiah spesialmu.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                <a 
                  href="#products" 
                  className="w-full sm:w-auto bg-[#D4AF82] text-white px-10 py-4 rounded-[4px] font-bold text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg hover:shadow-secondary/20 transform hover:-translate-y-1"
                >
                  Lihat Koleksi
                </a>
                <a 
                  href="#contact" 
                  className="w-full sm:w-auto border-[1.5px] border-primary text-primary px-10 py-4 rounded-[4px] font-bold text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                >
                  Hubungi Kami
                </a>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                  <span className="text-secondary">✦</span> Handmade Original
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                  <span className="text-secondary">✦</span> Bahan Berkualitas
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A]/70">
                  <span className="text-secondary">✦</span> Custom Request
                </div>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 1 }}
               className="lg:w-2/5 relative hidden md:block"
            >
               <div className="aspect-square bg-accent rounded-2xl overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent to-secondary/30" />
                  <div className="absolute inset-0 flex items-center justify-center p-12 text-center">
                     <span className="font-serif text-3xl font-bold text-white/40 italic">Artisanal Quality</span>
                  </div>
               </div>
               <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-xl border border-secondary/20">
                  <div className="flex gap-1 text-secondary mb-2">
                     <Star size={16} fill="currentColor" />
                     <Star size={16} fill="currentColor" />
                     <Star size={16} fill="currentColor" />
                     <Star size={16} fill="currentColor" />
                     <Star size={16} fill="currentColor" />
                  </div>
                  <div className="text-xs font-bold text-primary uppercase tracking-widest leading-none">500+ Pelanggan Puas</div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR STRIP */}
      <div className="bg-primary py-5">
        <div className="container mx-auto px-6 overflow-hidden">
          <div className="flex justify-between items-center gap-8 whitespace-nowrap overflow-x-auto no-scrollbar py-1 text-accent text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase opacity-90">
            <span>Handmade Original</span>
            <span className="text-secondary opacity-50">•</span>
            <span>Bahan Berkualitas Premium</span>
            <span className="text-secondary opacity-50">•</span>
            <span>Custom Request Available</span>
            <span className="text-secondary opacity-50">•</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT CATALOG */}
      <section id="products" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-12">Koleksi Unggulan</h2>
            
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-8 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${activeFilter === cat ? 'bg-secondary text-white shadow-md' : 'bg-accent/40 text-primary hover:bg-accent/70'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-16 text-center">
             <button className="bg-primary text-white px-12 py-4 rounded-[4px] font-bold text-sm uppercase tracking-widest hover:bg-secondary transition-all shadow-md">
               Lihat Semua Produk
             </button>
          </div>
        </div>
      </section>
          {/* 4. HOW IT WORKS */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Cara Pesan Custom</h2>
            <p className="text-gray-400 font-medium uppercase tracking-widest text-[10px]">Langkah mudah untuk hasil yang sempurna</p>
          </div>

          <div className="bg-[#FDFAF6] border border-secondary/20 p-8 md:p-12 rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: <MessageCircle size={28} />, step: "1", title: "Hubungi WhatsApp", desc: "Konsultasi desain dengan tim pengrajin kami." },
              { icon: <CheckCircle2 size={28} />, step: "2", title: "Diskusikan Desain", desc: "Tentukan detail material, warna, & ukuran." },
              { icon: <Clock size={28} />, step: "3", title: "Proses Produksi", desc: "Handmade intensif selama 3-7 hari kerja." },
              { icon: <Truck size={28} />, step: "4", title: "Kirim ke Seluruh RI", desc: "Pengantaran aman ke lokasi tujuan Anda." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-5"
              >
                <div className="shrink-0 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {item.step}
                </div>
                <div>
                   <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">{item.title}</h3>
                   <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ABOUT US */}
      <section id="about" className="py-24 bg-[#FDFAF6] overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/5] bg-accent/40 rounded-xl overflow-hidden shadow-2xl relative z-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                  <span className="font-serif text-3xl font-bold text-white/50 italic uppercase tracking-[0.2em]">Workshop</span>
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary opacity-10 rounded-full blur-2xl -z-10" />
            </div>
            
            <div className="lg:w-1/2">
              <h4 className="text-secondary font-bold uppercase tracking-[0.3em] text-xs mb-4">Mengenal Erlina Craft</h4>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight">Dibuat dengan Tangan,<br />Dikirim dengan Hati</h2>
              <div className="space-y-6 text-gray-500 text-base leading-relaxed mb-12 font-medium">
                <p>
                  Erlina Craft lahir dari dedikasi pada detail dan keindahan barang buatan tangan. Kami percaya bahwa setiap rumah berhak mendapatkan sentuhan karya yang memiliki jiwa.
                </p>
                <p>
                  Menggunakan material pilihan berkualitas premium dan proses yang teliti, kami memastikan setiap produk memiliki karakter unik yang tak lekang oleh waktu.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 py-8 border-t border-secondary/10">
                <StatItem value="500+" label="Produk Terjual" />
                <StatItem value="300+" label="Pelanggan" />
                <StatItem value="5" label="Tahun Karya" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONI */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-primary mb-4">Apa Kata Mereka</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Kisah kebahagiaan dari pelanggan setia</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-accent/10 p-8 rounded-lg border border-secondary/10 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1 text-secondary mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-primary/80 italic mb-8 text-sm leading-relaxed font-medium">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-bold text-primary text-sm">{t.name}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t.city}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-24 relative overflow-hidden bg-accent/20">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-xl shadow-2xl border border-secondary/10">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">Siap Memesan atau Punya Pertanyaan?</h2>
            <p className="text-base text-gray-500 mb-10 leading-relaxed font-medium">
              Tim Erlina Craft siap membantu Anda menemukan karya yang sempurna. <br className="hidden md:block" /> Kami melayani diskusi custom via WhatsApp setiap hari.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://wa.me/6281234567890" 
                className="w-full sm:w-auto bg-secondary text-white px-12 py-4 rounded-[4px] font-bold text-sm uppercase tracking-widest hover:bg-opacity-90 shadow-lg"
              >
                Chat WhatsApp
              </a>
              <button className="w-full sm:w-auto border-2 border-primary/20 px-12 py-4 rounded-[4px] font-bold text-sm uppercase tracking-widest hover:bg-primary/5 transition-all text-primary">
                Lihat Katalog Lengkap
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer id="contact" className="bg-primary text-accent pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-12 border-b border-accent/10">
            <div>
              <div className="text-2xl font-serif font-bold mb-6 text-white">Erlina Craft</div>
              <p className="text-accent/60 text-sm max-w-sm mb-8 leading-relaxed">
                Official store kerajinan tangan premium. Menghadirkan sentuhan personal dan keunikan di setiap sudut rumah Anda. Crafted with Heart.
              </p>
              <div className="flex gap-4">
                 <a href="#" className="w-9 h-9 bg-accent/5 rounded-full flex items-center justify-center hover:bg-secondary transition-all">
                    <Instagram size={18} />
                 </a>
                 <a href="#" className="w-9 h-9 bg-accent/5 rounded-full flex items-center justify-center hover:bg-secondary transition-all">
                    <Mail size={18} />
                 </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
               <div>
                 <h5 className="font-serif font-bold text-lg mb-6 text-secondary">Navigasi</h5>
                 <ul className="space-y-3 text-xs font-bold uppercase tracking-widest opacity-70">
                   <li><a href="#home" className="hover:text-white transition-colors">Beranda</a></li>
                   <li><a href="#products" className="hover:text-white transition-colors">Koleksi</a></li>
                   <li><a href="#about" className="hover:text-white transition-colors">Tentang Kami</a></li>
                 </ul>
               </div>

               <div>
                 <h5 className="font-serif font-bold text-lg mb-6 text-secondary">Kontak</h5>
                 <ul className="space-y-4 text-xs font-bold uppercase tracking-widest opacity-70">
                   <li>WA: +62 812-3456-7890</li>
                   <li>@erlinacraft.id</li>
                   <li>Yogyakarta, Indonesia</li>
                 </ul>
               </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 gap-4">
            <div>© 2025 Erlina Craft. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <motion.a 
        href="https://wa.me/6281234567890"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-10 right-6 md:right-10 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.3)] flex items-center justify-center group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 bg-white text-[#25D366] px-4 py-2 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest">
          Hubungi Kami
        </span>
      </motion.a>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 w-full md:hidden bg-white/95 backdrop-blur-md border-t border-secondary/10 p-4 z-40">
          <a 
            href="https://wa.me/6281234567890" 
            className="flex items-center justify-center gap-2 w-full bg-secondary text-white py-4 rounded-[4px] font-bold text-xs uppercase tracking-widest shadow-xl"
          >
            Pesan Sekarang <ChevronRight size={16} />
          </a>
      </div>
    </div>
  );
}
