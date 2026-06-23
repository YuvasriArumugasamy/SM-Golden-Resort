import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowRight, BookOpen, ChevronLeft } from "lucide-react";
import WhatsAppButton from "../components/WhatsAppButton";

/* ── SEO Meta helper ── */
function setMeta(title, description) {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
  meta.content = description;
}

/* ══ BLOG DATA ══ */
const ARTICLES = [
  {
    id: "best-time-to-visit-courtallam",
    category: "Travel Tips",
    categoryColor: "bg-blue-100 text-blue-700",
    title: "Best Time to Visit Courtallam Waterfalls (2026 Guide)",
    excerpt: "Planning a trip to Courtallam? Discover the best season to visit, what to expect at each time of year, and insider tips from our resort team.",
    date: "June 2026",
    readTime: "5 min read",
    image: "/ChatGPT Image Jun 21, 2026, 06_23_01 PM.png",
    metaDescription: "Best time to visit Courtallam waterfalls in 2026. Monsoon season guide, weather tips, and resort booking advice for SM Golden Resorts Courtallam.",
  },
  {
    id: "top-10-things-to-do-courtallam",
    category: "Things To Do",
    categoryColor: "bg-emerald-100 text-emerald-700",
    title: "Top 10 Things to Do Near Courtallam – Complete Activity Guide",
    excerpt: "Beyond the famous waterfalls — explore temples, local markets, nature walks, day trips, and more. Your complete 2026 activity guide for Courtallam.",
    date: "June 2026",
    readTime: "6 min read",
    image: "/ChatGPT Image Jun 21, 2026, 06_25_28 PM.png",
    metaDescription: "Top 10 things to do near Courtallam waterfalls. Complete activity guide including Old Falls, Main Falls, Tiger Falls, temples, and local food.",
  },
  {
    id: "courtallam-travel-guide-2026",
    category: "Travel Guide",
    categoryColor: "bg-purple-100 text-purple-700",
    title: "Courtallam Complete Travel Guide 2026 – Everything You Need to Know",
    excerpt: "First time visiting Courtallam? This comprehensive guide covers how to reach, where to stay, what to eat, and essential tips for a perfect trip.",
    date: "June 2026",
    readTime: "8 min read",
    image: "/ChatGPT Image Jun 21, 2026, 06_22_45 PM.png",
    metaDescription: "Courtallam complete travel guide 2026. How to reach, where to stay, best resorts, local food, and travel tips for Courtallam Tamil Nadu.",
  },
];

/* ══ FULL ARTICLE CONTENT ══ */
const ARTICLE_CONTENT = {
  "best-time-to-visit-courtallam": {
    sections: [
      {
        type: "intro",
        text: `Courtallam, often called the "Spa of South India," is one of Tamil Nadu's most beloved natural destinations. Famous for its multiple waterfalls and medicinal herbal waters, thousands of visitors flock here every year. But when exactly should you visit to make the most of your trip?`,
      },
      {
        type: "heading",
        icon: "🌧️",
        title: "Monsoon Season – June to September (Peak Season)",
        text: "This is hands down the best time to visit Courtallam. The Northeast and Southwest monsoons fill the waterfalls to their maximum capacity. The Main Falls, Old Falls, Five Falls, and Tiger Falls all roar with full force during these months.",
        bullets: [
          "Water flow is at its highest and most powerful",
          "Lush green forests surround the falls",
          "Cool weather between 22°C–27°C",
          "Ideal for families, couples, and group trips",
        ],
      },
      {
        type: "heading",
        icon: "☀️",
        title: "Post-Monsoon – October to December",
        text: "If you prefer slightly less crowd but still good water flow, October to December is an excellent window. The waterfalls are still active, and the weather is pleasant and cool. This period is ideal for a peaceful, relaxing getaway.",
      },
      {
        type: "heading",
        icon: "🌸",
        title: "Summer – January to May",
        text: "While the waterfalls may have reduced flow during summer months, Courtallam still attracts visitors looking for a quick nature escape from the heat. Many resorts offer special summer packages to make your stay comfortable.",
      },
      {
        type: "tip",
        icon: "💡",
        title: "Pro Tip from SM Golden Resorts",
        text: "Book your stay at least 2–3 weeks in advance during the monsoon season, as rooms fill up very quickly. SM Golden Resorts, located just 0.38 km from Old Falls, offers the best location for experiencing the falls without the long walk!",
      },
    ],
  },
  "top-10-things-to-do-courtallam": {
    sections: [
      {
        type: "intro",
        text: "Planning a trip to Courtallam but wondering what to do beyond the famous waterfalls? You're in for a treat! Courtallam and its surrounding areas are packed with activities for families, adventure seekers, and nature lovers alike.",
      },
      { type: "numbered", icon: "💦", num: 1, title: "Take a Dip at Old Falls (Patha Courtallam)", text: "Just 0.38 km from SM Golden Resorts, Old Falls is the most popular and easily accessible waterfall. The medicinal herbs in the water are said to have health benefits. Best visited in the morning hours to avoid large crowds." },
      { type: "numbered", icon: "🌊", num: 2, title: "Visit Main Falls (Peraruvi)", text: "The Main Falls, located 1.39 km from our resort, is the largest and most spectacular waterfall in Courtallam. The sheer volume of water during monsoon season is breathtaking and a must-see for every visitor." },
      { type: "numbered", icon: "🐅", num: 3, title: "Explore Tiger Falls", text: "A slightly secluded and less crowded waterfall, Tiger Falls offers a more serene experience. Surrounded by dense forest, it's perfect for nature photography and peaceful walks." },
      { type: "numbered", icon: "🌿", num: 4, title: "Nature Walk Through Courtallam Forest", text: "The forests around Courtallam are rich in medicinal plants and wildlife. Early morning nature walks reveal a world of birds, butterflies, and tropical vegetation that you'll rarely find elsewhere." },
      { type: "numbered", icon: "🛕", num: 5, title: "Visit Thirukutralam Temple", text: "Located near Main Falls, the ancient Thirukutralam Shiva Temple is a significant religious site. The temple architecture is stunning, and the spiritual atmosphere is deeply calming." },
      { type: "numbered", icon: "🍌", num: 6, title: "Shop at Local Fruit & Spice Markets", text: "Courtallam's local markets are famous for fresh tropical fruits like jackfruit, pineapple, and banana, as well as homemade herbal oils and spice mixes. A great way to take a piece of Courtallam home!" },
      { type: "numbered", icon: "🚗", num: 7, title: "Day Trip to Papanasam Dam", text: "About 30 km from Courtallam, Papanasam Dam offers a scenic reservoir view and is an excellent picnic spot for families travelling with children." },
      { type: "numbered", icon: "🍽️", num: 8, title: "Try Local Tamil Cuisine", text: "Don't leave without trying authentic Tirunelveli and Tenkasi cuisine — from the famous Tirunelveli Halwa to spicy local fish curry. Several local restaurants near the falls serve delicious home-style meals." },
      { type: "numbered", icon: "📸", num: 9, title: "Sunrise Photography at Five Falls", text: "Five Falls (Aintharuvi) is known for its five separate streams of water flowing side by side. During sunrise, with golden light filtering through the trees, it's a paradise for photographers." },
      { type: "numbered", icon: "🌙", num: 10, title: "Evening Relaxation at SM Golden Resorts", text: "After a full day of exploring, come back to SM Golden Resorts and relax in the peaceful surroundings. With free parking, kitchen access, and 24-hour assistance, your comfort is our priority." },
    ],
  },
  "courtallam-travel-guide-2026": {
    sections: [
      {
        type: "intro",
        text: "Whether it's your first visit or your tenth, Courtallam (also spelled Kutralam) never stops surprising you. This comprehensive 2026 travel guide covers everything — how to get there, where to stay, what to eat, and how to make the most of your visit.",
      },
      {
        type: "heading", icon: "📍", title: "Where is Courtallam?",
        text: "Courtallam is a town in the Tenkasi district of Tamil Nadu, situated in the foothills of the Western Ghats. It lies approximately 5 km from Tenkasi town and is easily accessible from major cities across South India.",
      },
      {
        type: "heading", icon: "🚌", title: "How to Reach Courtallam",
        bullets: [
          "By Bus: Regular government and private buses from Chennai, Madurai, Coimbatore, and Trivandrum connect to Tenkasi, from where local autos and taxis reach Courtallam in 15 minutes.",
          "By Train: Tenkasi Junction is the nearest railway station (5 km). Trains from Chennai, Madurai, and Tirunelveli are available.",
          "By Air: Madurai Airport (120 km) and Trivandrum Airport (100 km) are the nearest airports. Taxis and buses are available from both.",
          "By Car: Courtallam is well-connected by road via NH 44 and state highways. Free parking is available at SM Golden Resorts!",
        ],
      },
      {
        type: "rooms", icon: "🏨", title: "Where to Stay in Courtallam",
        text: "SM Golden Resorts is one of the top-rated resorts in Courtallam, located on Old Falls Main Road — just 0.38 km from Old Falls. We offer a range of room types to suit every budget:",
        rooms: [
          { name: "Double Bed Non-AC", price: "₹1,300/day", tag: "Budget" },
          { name: "Double Bed AC", price: "₹1,600/day", tag: "Comfortable" },
          { name: "Three Bed", price: "₹1,800/day", tag: "Family" },
          { name: "Four Bed AC", price: "₹2,800/day", tag: "Spacious" },
        ],
        note: "All rooms include free parking, WiFi, power backup, hot water, TV, and 24-hour assistance. Pets are welcome too! 🐾",
      },
      {
        type: "heading", icon: "🍛", title: "What to Eat in Courtallam",
        text: "Courtallam's food scene is deeply rooted in traditional Tirunelveli cuisine. Must-try dishes include Tirunelveli Halwa, Kola Urundai (spiced meat balls), and freshly caught river fish preparations. With kitchen access at SM Golden Resorts, you can also cook your own meals using fresh local ingredients!",
      },
      {
        type: "heading", icon: "📋", title: "Important Tips for Visitors",
        bullets: [
          "Carry Government ID proof — required at all hotels",
          "Wear comfortable non-slip footwear near waterfalls",
          "Avoid visiting waterfalls during heavy rain warnings",
          "Outside food and beverages are allowed at SM Golden Resorts",
          "Unmarried couples and foreigners are welcome",
          "Smoking is allowed only in designated areas",
        ],
      },
      {
        type: "contact", icon: "📞", title: "Contact SM Golden Resorts",
        text: "Have questions about your upcoming stay? Our team is available 24/7 to help you plan the perfect Courtallam getaway.",
        details: ["📱 9003549849 / 9443710420", "📧 smgoldenresorts@gmail.com", "📍 Old Falls Main Road, Old Falls, Courtallam, Tamil Nadu 627802"],
      },
    ],
  },
};

/* ══ ARTICLE PAGE ══ */
function ArticlePage({ article }) {
  const navigate = useNavigate();
  const content = ARTICLE_CONTENT[article.id];

  setMeta(
    `${article.title} | SM Golden Resorts Courtallam`,
    article.metaDescription
  );

  return (
    <div className="min-h-screen bg-white font-jakarta">
      {/* Hero */}
      <div className="relative h-[280px] md:h-[380px] overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 pb-8 max-w-3xl mx-auto w-full left-0 right-0">
          <span className={`inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full mb-3 w-fit ${article.categoryColor}`}>
            {article.category}
          </span>
          <h1 className="text-white font-extrabold leading-tight" style={{ fontSize: "clamp(1.25rem, 4vw, 1.9rem)" }}>
            {article.title}
          </h1>
          <div className="flex items-center gap-3 mt-3 text-white/60 text-xs font-medium">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
            <span>·</span>
            <span>By SM Golden Resorts Team</span>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <button onClick={() => navigate("/blog")}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </button>
      </div>

      {/* Content */}
      <article className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {content?.sections.map((sec, i) => {
          if (sec.type === "intro") return (
            <p key={i} className="text-slate-600 text-base leading-relaxed font-medium">{sec.text}</p>
          );

          if (sec.type === "heading") return (
            <div key={i} className="space-y-3">
              <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <span>{sec.icon}</span> {sec.title}
              </h2>
              {sec.text && <p className="text-slate-600 text-sm leading-relaxed">{sec.text}</p>}
              {sec.bullets && (
                <ul className="space-y-2">
                  {sec.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-blue-500 mt-0.5 shrink-0">•</span> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );

          if (sec.type === "numbered") return (
            <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                {sec.num}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">{sec.icon} {sec.title}</h3>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">{sec.text}</p>
              </div>
            </div>
          );

          if (sec.type === "tip") return (
            <div key={i} className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-extrabold text-amber-800 text-sm mb-2">{sec.icon} {sec.title}</h3>
              <p className="text-amber-700 text-sm leading-relaxed">{sec.text}</p>
            </div>
          );

          if (sec.type === "rooms") return (
            <div key={i} className="space-y-3">
              <h2 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <span>{sec.icon}</span> {sec.title}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">{sec.text}</p>
              <div className="grid grid-cols-2 gap-3">
                {sec.rooms.map((r, j) => (
                  <div key={j} className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">{r.tag}</p>
                    <p className="font-extrabold text-slate-800 text-sm mt-0.5">{r.name}</p>
                    <p className="text-blue-700 font-extrabold text-base mt-1">{r.price}</p>
                  </div>
                ))}
              </div>
              {sec.note && <p className="text-slate-500 text-sm">{sec.note}</p>}
            </div>
          );

          if (sec.type === "contact") return (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <h3 className="font-extrabold text-slate-800 text-sm">{sec.icon} {sec.title}</h3>
              <p className="text-slate-500 text-sm">{sec.text}</p>
              {sec.details.map((d, j) => <p key={j} className="text-slate-700 text-sm font-medium">{d}</p>)}
            </div>
          );

          return null;
        })}

        {/* CTA */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-center space-y-3">
          <p className="text-white font-extrabold text-base">🌿 Your perfect nature escape awaits!</p>
          <p className="text-blue-100 text-sm">SM Golden Resorts is just 0.38 km from Old Falls, Courtallam. Book directly for the best rates.</p>
          <Link to="/booking"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all shadow-lg">
            Book Now – Best Rate Guaranteed <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </article>

      <WhatsAppButton />
    </div>
  );
}

/* ══ BLOG LIST PAGE ══ */
export default function Blog() {
  const [selected, setSelected] = useState(null);

  setMeta(
    "Blog – SM Golden Resorts Courtallam | Travel Tips & Guides",
    "Travel tips, activity guides, and complete travel information for Courtallam waterfalls. SM Golden Resorts blog — your trusted Courtallam travel resource."
  );

  if (selected) {
    return <ArticlePage article={selected} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-jakarta">

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <BookOpen className="w-3.5 h-3.5" /> SM Golden Resorts Blog
            </div>
            <h1 className="text-white font-bold drop-shadow-sm" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 5vw, 2.6rem)" }}>
              Courtallam Travel Guides
            </h1>
            <p className="text-blue-100 text-sm mt-2 font-medium max-w-md mx-auto">
              Travel tips, activity guides, and everything you need to know about visiting Courtallam waterfalls.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelected(article)}
            >
              {/* Thumbnail */}
              <div className="h-48 overflow-hidden">
                <img src={article.image} alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <span className={`inline-block text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${article.categoryColor}`}>
                  {article.category}
                </span>
                <h2 className="font-extrabold text-slate-800 text-base leading-tight group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{article.excerpt}</p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.readTime}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{article.date}</span>
                  </div>
                  <span className="text-blue-600 text-xs font-bold flex items-center gap-1">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-center space-y-4"
        >
          <p className="text-white font-extrabold text-xl">Ready to experience Courtallam?</p>
          <p className="text-blue-100 text-sm max-w-md mx-auto">
            SM Golden Resorts — just 0.38 km from Old Falls. Rooms from ₹1,300/day. Free parking, kitchen, pets welcome.
          </p>
          <Link to="/booking"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg">
            Book Your Stay <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      <WhatsAppButton />
    </div>
  );
}
