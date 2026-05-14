import { 
  Heart, Star, Smile, Crown, Coffee, Flame, Sparkles, Award, 
  MapPin, Clock, Compass, BookOpen 
} from "lucide-react";

export interface LoveReason {
  id: number;
  title: string;
  description: string;
  badge: string;
  iconName: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  period: string;
  description: string;
  footer: string;
}

export interface FutureDream {
  id: string;
  title: string;
  scenario: string;
  highlight: string;
}

export const REASONS_I_LOVE_YOU: LoveReason[] = [
  {
    id: 1,
    title: "How You Turn My Chaos Into Peace",
    description: "Pata nhi kaise karti h tu… but jab bhi mera dimag overthink krta h, stress hota h ya sab kuch heavy lagta h… bas tera ek cheek kiss 😘, ek tight hug 🫂 ya tera ‘idhar aa’ bolna… and suddenly sab theek lagne lagta h. Tu sirf meri girlfriend nahi h Pihu… u are literally my peace ❤️",
    badge: "MY SAFE PLACE ❤️ ",
    iconName: "Compass"
  },
  {
    id: 2,
    title: "Teri Wo Genuine Smile… Ufff",
    description: "Jab tu sach me pura khush hoke hasti h n yaar tu kya lagti h bhaii, the cutest thing i would ever witness itin this world ,and that unique smile jisme there wo lips pure wide hojaate h it totally feels like that ki this is my girl and I am always going to make you smile like this every fucking day of our life together.... ❤️",
    badge: "YOUR REAL SMILE 😭 ",
    iconName: "Smile"
  },
  {
    id: 3,
    title: "Sabse Special Baat… Tu Ne Mujhe Chuna",
    description: "Regardless of what people think of me what they say about me or what even i say about myself you always choose me chahe mere quirks kuch bhi ho, chahe wo tujhe bekar ka i didn't knew bolke iritate krna ho ya usse bhi faltu bengali bolke tera matha kharab karna ho😂😂 , you always choose me… ❤️",
    badge: "YOU CHOSE ME FIRST ❤️ ",
    iconName: "Heart"
  },
  {
    id: 4,
    title: "Tu Mere Weird Version Ko Bhi Pasand Karti H",
    description: "Mere stupid jokes 😂, meri weird music taste 🎧, meri hobbies, meri bakchodi… jo cheeze dusro ko annoying lagti thi… tu un sab pe hasta thi, enjoy karti thi. Tu ne kabhi meri in chijo ko change karne ki koshish nahi ki… bas inhe accept kiya ❤️",
    badge: "YOU ACCEPT THE REAL ME 😌",
    iconName: "Sparkles"
  },
  {
    id: 5,
    title: "Bas Tujhe Apne Paas Feel Karna",
    description: "Meri favourite memory koi place ya photo nahi h… meri favourite memory woh h jab tu mujhe hug karti h 🫂, mera sar apni godi me  rakhti h… aur uss moment sab kuch slow ho jata h. Us time literally home jaisa feel hota h ❤️",
    badge: "MY FAVOURITE FEELING 🫂",
    iconName: "Moon"
  },
  {
    id: 6,
    title: "Kyun Tu Hi?",
    description: "Agar koi mujhse puche 8 billion logo me sirf tu hi kyun… toh answer simple h… because tu ne mujhe tab choose kiya jab tere paas koi reason nahi tha ❤️ Tu ne mujhe samjha, accept kiya, feel karaya ki mai worth it hu… aur shayad isi liye… meri har answer me sirf ‘Pihu’ hi aata h 🥺✨",
    badge: "OUT OF 8 BILLION… ONLY YOU 🌍❤️",
    iconName: "Crown"
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "tl-1",
    title: "That Magical First Hello 💭",
    period: "The Beginning of Us",
    description: "Under a quiet starlit conversation, our paths crossed in a gentle conversation that changed the rhythm of our universe. What felt like standard networking became an immediate, invisible soul-connection.",
    footer: "Where the magic of Ayush & Pihu sparked."
  },
  {
    id: "tl-2",
    title: "Late Night Whispering & Raw Chats 🌙",
    period: "Deepening the Bond",
    description: "Melting distances across timezones. Staying up till sunrise talking about our childhood fears, heavy dreams, silly mistakes, and slowly realizing we've finally found our home inside each other's voices.",
    footer: "When talking became breathing."
  },
  {
    id: "tl-3",
    title: "Unbreakable Vows & The Proposal Ring 💍",
    period: "Committing our Destinies",
    description: "Sinking into a sweet quiet commitment. Handing over the crown of our hearts, promising to guard, protect, tease, and back each other up no matter how rocky or storm-tossed the winds of life become.",
    footer: "Two hearts beating in a single perfect harmony."
  },
  {
    id: "tl-4",
    title: "Our Digital Sky Lantern Promise ✨",
    period: "Our Shared Future",
    description: "Releasing our shared prayers to the celestial skies. Holding onto the solid, warm promise to build a beautiful warm nest, share quiet mornings, wash dishes, and grow beautifully old, together.",
    footer: "Our wishes written in golden sparks on high."
  }
];

export const FUTURE_DREAMS: FutureDream[] = [
  {
    id: "fd-1",
    title: "Cozy Bookstore Home 🏡📚",
    scenario: "A warm wood-lined cottage covered with ivy, windows that soak in the morning sun, overflowing bookshelves in every room, and a big fluffy sofa where we read together under a shared knit blanket.",
    highlight: "Warm Coffee & Quiet Sunday Mornings"
  },
  {
    id: "fd-2",
    title: "Chasing Beautiful Alpine Sunsets 🏔️🌄",
    scenario: "Standing side-by-side on a rustic balcony nestled deep in Switzerland or snowy hills, holding warm tea mugs, watching the setting sun turn peaks into gold, complete silence except for our heartbeats.",
    highlight: "Draped in thick cardigans & pure love"
  },
  {
    id: "fd-3",
    title: "Making Sunday Pancakes 🥞🍳",
    scenario: "Me dancing horribly around our little kitchen, getting flour on your cute nose while I try to flip warm pancakes, both laughing so hard, before sharing a warm syrupy serving side by side.",
    highlight: "Silly dances, sweet morning laughs"
  },
  {
    id: "fd-4",
    title: "Growing Grey, Wrinkly & Adorable 👵👴",
    scenario: "Walking slowly through public parks, holding onto your warm wrinkled hand, still teasing you about your beautiful dramatic yawns, looking at you with the exact same deep infatuation I feel right now.",
    highlight: "An entire lifelong romance completed"
  }
];

export const HEART_WHISPERS = [
  "You are my favorite view, my sweet Pihu... 🥰",
  "A heart beats so much faster for you here! ❤️",
  "Inside your sweet smile is where my soul found its home.",
  "You look incredibly stunning every single second, Pihu.",
  "My dream is to keep making you smile forever. 😊",
  "No distance could ever dim how bright you shine in my life.",
  "You are my queen, my sanctuary, and my beautiful future. 👑",
  "Just checking in to remind you that you are deeply loved by Ayush!"
];
