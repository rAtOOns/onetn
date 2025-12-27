import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@onetn.in" },
    update: {},
    create: {
      email: "admin@onetn.in",
      password: hashedPassword,
      name: "System Administrator",
      role: "super_admin",
    },
  });
  console.log("Admin created: admin@onetn.in");

  // Tamil Nadu Government Departments
  const departments = [
    { name: "Revenue Administration", nameTamil: "வருவாய் நிர்வாகம்", slug: "revenue" },
    { name: "School Education", nameTamil: "பள்ளிக் கல்வி", slug: "school-education" },
    { name: "Health & Family Welfare", nameTamil: "சுகாதாரம் மற்றும் குடும்ப நலன்", slug: "health" },
    { name: "Agriculture", nameTamil: "வேளாண்மை", slug: "agriculture" },
    { name: "Rural Development", nameTamil: "ஊரக வளர்ச்சி", slug: "rural-development" },
    { name: "Municipal Administration", nameTamil: "நகராட்சி நிர்வாகம்", slug: "municipal" },
    { name: "Transport", nameTamil: "போக்குவரத்து", slug: "transport" },
    { name: "Home (Police)", nameTamil: "உள்துறை (காவல்)", slug: "home-police" },
    { name: "Finance", nameTamil: "நிதி", slug: "finance" },
    { name: "Public Works", nameTamil: "பொதுப்பணி", slug: "public-works" },
    { name: "Higher Education", nameTamil: "உயர் கல்வி", slug: "higher-education" },
    { name: "Social Welfare", nameTamil: "சமூக நலன்", slug: "social-welfare" },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { slug: dept.slug },
      update: {},
      create: dept,
    });
  }
  console.log("Departments seeded:", departments.length);

  // Document Categories
  const categories = [
    { name: "Government Orders (GOs)", nameTamil: "அரசாணைகள்", slug: "government-orders" },
    { name: "Circulars", nameTamil: "சுற்றறிக்கைகள்", slug: "circulars" },
    { name: "Forms & Applications", nameTamil: "படிவங்கள் மற்றும் விண்ணப்பங்கள்", slug: "forms" },
    { name: "Schemes", nameTamil: "திட்டங்கள்", slug: "schemes" },
    { name: "Notifications", nameTamil: "அறிவிப்புகள்", slug: "notifications" },
    { name: "Reports", nameTamil: "அறிக்கைகள்", slug: "reports" },
    { name: "Tenders", nameTamil: "டெண்டர்கள்", slug: "tenders" },
    { name: "Guidelines", nameTamil: "வழிகாட்டுதல்கள்", slug: "guidelines" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("Categories seeded:", categories.length);

  // Document Topics (Pension, Salary, Transfer, etc.)
  const topics = [
    {
      name: "Pension Orders",
      nameTamil: "ஓய்வூதிய ஆணைகள்",
      slug: "pension",
      description: "Pension, retirement benefits, family pension orders",
      icon: "Wallet",
      color: "text-amber-600 bg-amber-50"
    },
    {
      name: "Pay & Salary",
      nameTamil: "சம்பளம் & ஊதியம்",
      slug: "salary",
      description: "Pay commission, salary revision, pay fixation orders",
      icon: "Banknote",
      color: "text-green-600 bg-green-50"
    },
    {
      name: "DA & Allowances",
      nameTamil: "அகவிலைப்படி & கொடுப்பனவுகள்",
      slug: "allowances",
      description: "Dearness Allowance, HRA, TA, special allowances",
      icon: "PiggyBank",
      color: "text-blue-600 bg-blue-50"
    },
    {
      name: "Transfers",
      nameTamil: "இடமாற்றங்கள்",
      slug: "transfers",
      description: "Transfer orders, postings, deputation",
      icon: "ArrowLeftRight",
      color: "text-purple-600 bg-purple-50"
    },
    {
      name: "Promotions",
      nameTamil: "பதவி உயர்வு",
      slug: "promotions",
      description: "Promotion orders, seniority lists, grade promotions",
      icon: "TrendingUp",
      color: "text-indigo-600 bg-indigo-50"
    },
    {
      name: "Recruitment",
      nameTamil: "ஆட்சேர்ப்பு",
      slug: "recruitment",
      description: "Job notifications, appointment orders, vacancies",
      icon: "UserPlus",
      color: "text-teal-600 bg-teal-50"
    },
    {
      name: "Leave Rules",
      nameTamil: "விடுப்பு விதிகள்",
      slug: "leave",
      description: "Leave rules, earned leave, casual leave, holidays",
      icon: "Calendar",
      color: "text-orange-600 bg-orange-50"
    },
    {
      name: "Service Rules",
      nameTamil: "சேவை விதிகள்",
      slug: "service-rules",
      description: "Service conditions, conduct rules, disciplinary matters",
      icon: "Shield",
      color: "text-red-600 bg-red-50"
    },
    {
      name: "GPF & Loans",
      nameTamil: "வருங்கால வைப்பு நிதி & கடன்கள்",
      slug: "gpf-loans",
      description: "GPF, advances, festival advance, house building advance",
      icon: "Landmark",
      color: "text-cyan-600 bg-cyan-50"
    },
    {
      name: "Medical",
      nameTamil: "மருத்துவம்",
      slug: "medical",
      description: "Medical reimbursement, health insurance, CGHS",
      icon: "Heart",
      color: "text-pink-600 bg-pink-50"
    },
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {},
      create: topic,
    });
  }
  console.log("Topics seeded:", topics.length);

  // Tamil Nadu Districts (All 38 districts)
  const districts = [
    { name: "Chennai", nameTamil: "சென்னை", slug: "chennai" },
    { name: "Coimbatore", nameTamil: "கோயம்புத்தூர்", slug: "coimbatore" },
    { name: "Madurai", nameTamil: "மதுரை", slug: "madurai" },
    { name: "Tiruchirappalli", nameTamil: "திருச்சிராப்பள்ளி", slug: "tiruchirappalli" },
    { name: "Salem", nameTamil: "சேலம்", slug: "salem" },
    { name: "Tirunelveli", nameTamil: "திருநெல்வேலி", slug: "tirunelveli" },
    { name: "Tiruppur", nameTamil: "திருப்பூர்", slug: "tiruppur" },
    { name: "Erode", nameTamil: "ஈரோடு", slug: "erode" },
    { name: "Vellore", nameTamil: "வேலூர்", slug: "vellore" },
    { name: "Thoothukudi", nameTamil: "தூத்துக்குடி", slug: "thoothukudi" },
    { name: "Dindigul", nameTamil: "திண்டுக்கல்", slug: "dindigul" },
    { name: "Thanjavur", nameTamil: "தஞ்சாவூர்", slug: "thanjavur" },
    { name: "Ranipet", nameTamil: "ராணிப்பேட்டை", slug: "ranipet" },
    { name: "Sivaganga", nameTamil: "சிவகங்கை", slug: "sivaganga" },
    { name: "Viluppuram", nameTamil: "விழுப்புரம்", slug: "viluppuram" },
    { name: "Kanchipuram", nameTamil: "காஞ்சிபுரம்", slug: "kanchipuram" },
    { name: "Tiruvannamalai", nameTamil: "திருவண்ணாமலை", slug: "tiruvannamalai" },
    { name: "Cuddalore", nameTamil: "கடலூர்", slug: "cuddalore" },
    { name: "Kanyakumari", nameTamil: "கன்னியாகுமரி", slug: "kanyakumari" },
    { name: "Theni", nameTamil: "தேனி", slug: "theni" },
    { name: "Karur", nameTamil: "கரூர்", slug: "karur" },
    { name: "Nagapattinam", nameTamil: "நாகப்பட்டினம்", slug: "nagapattinam" },
    { name: "Dharmapuri", nameTamil: "தர்மபுரி", slug: "dharmapuri" },
    { name: "Krishnagiri", nameTamil: "கிருஷ்ணகிரி", slug: "krishnagiri" },
    { name: "Namakkal", nameTamil: "நாமக்கல்", slug: "namakkal" },
    { name: "Pudukkottai", nameTamil: "புதுக்கோட்டை", slug: "pudukkottai" },
    { name: "Virudhunagar", nameTamil: "விருதுநகர்", slug: "virudhunagar" },
    { name: "Ramanathapuram", nameTamil: "இராமநாதபுரம்", slug: "ramanathapuram" },
    { name: "The Nilgiris", nameTamil: "நீலகிரி", slug: "nilgiris" },
    { name: "Ariyalur", nameTamil: "அரியலூர்", slug: "ariyalur" },
    { name: "Perambalur", nameTamil: "பெரம்பலூர்", slug: "perambalur" },
    { name: "Tiruvarur", nameTamil: "திருவாரூர்", slug: "tiruvarur" },
    { name: "Chengalpattu", nameTamil: "செங்கல்பட்டு", slug: "chengalpattu" },
    { name: "Kallakurichi", nameTamil: "கள்ளக்குறிச்சி", slug: "kallakurichi" },
    { name: "Tenkasi", nameTamil: "தென்காசி", slug: "tenkasi" },
    { name: "Tirupattur", nameTamil: "திருப்பத்தூர்", slug: "tirupattur" },
    { name: "Mayiladuthurai", nameTamil: "மயிலாடுதுறை", slug: "mayiladuthurai" },
    { name: "Tiruvallur", nameTamil: "திருவள்ளூர்", slug: "tiruvallur" },
  ];

  for (const district of districts) {
    await prisma.district.upsert({
      where: { slug: district.slug },
      update: {},
      create: district,
    });
  }
  console.log("Districts seeded:", districts.length);

  // Get district IDs for constituencies
  const chennaiDistrict = await prisma.district.findUnique({ where: { slug: "chennai" } });
  const maduraiDistrict = await prisma.district.findUnique({ where: { slug: "madurai" } });
  const coimbatoreDistrict = await prisma.district.findUnique({ where: { slug: "coimbatore" } });

  // Sample Tamil Nadu Constituencies
  const constituencies = [
    // Chennai Assembly Constituencies
    { name: "Harbour", nameTamil: "துறைமுகம்", type: "assembly", districtId: chennaiDistrict?.id },
    { name: "Chepauk-Triplicane", nameTamil: "சேப்பாக்கம்-திருவல்லிக்கேணி", type: "assembly", districtId: chennaiDistrict?.id },
    { name: "Thousand Lights", nameTamil: "ஆயிரம் விளக்கு", type: "assembly", districtId: chennaiDistrict?.id },
    { name: "Anna Nagar", nameTamil: "அண்ணா நகர்", type: "assembly", districtId: chennaiDistrict?.id },
    { name: "Velachery", nameTamil: "வேளச்சேரி", type: "assembly", districtId: chennaiDistrict?.id },
    { name: "T. Nagar", nameTamil: "தியாகராய நகர்", type: "assembly", districtId: chennaiDistrict?.id },
    // Chennai Parliamentary
    { name: "Chennai North", nameTamil: "சென்னை வடக்கு", type: "parliamentary", districtId: chennaiDistrict?.id },
    { name: "Chennai South", nameTamil: "சென்னை தெற்கு", type: "parliamentary", districtId: chennaiDistrict?.id },
    { name: "Chennai Central", nameTamil: "சென்னை மத்திய", type: "parliamentary", districtId: chennaiDistrict?.id },
    // Madurai Constituencies
    { name: "Madurai East", nameTamil: "மதுரை கிழக்கு", type: "assembly", districtId: maduraiDistrict?.id },
    { name: "Madurai West", nameTamil: "மதுரை மேற்கு", type: "assembly", districtId: maduraiDistrict?.id },
    { name: "Madurai Central", nameTamil: "மதுரை மத்திய", type: "assembly", districtId: maduraiDistrict?.id },
    { name: "Madurai North", nameTamil: "மதுரை வடக்கு", type: "assembly", districtId: maduraiDistrict?.id },
    { name: "Madurai", nameTamil: "மதுரை", type: "parliamentary", districtId: maduraiDistrict?.id },
    // Coimbatore Constituencies
    { name: "Coimbatore North", nameTamil: "கோயம்புத்தூர் வடக்கு", type: "assembly", districtId: coimbatoreDistrict?.id },
    { name: "Coimbatore South", nameTamil: "கோயம்புத்தூர் தெற்கு", type: "assembly", districtId: coimbatoreDistrict?.id },
    { name: "Singanallur", nameTamil: "சிங்காநல்லூர்", type: "assembly", districtId: coimbatoreDistrict?.id },
    { name: "Coimbatore", nameTamil: "கோயம்புத்தூர்", type: "parliamentary", districtId: coimbatoreDistrict?.id },
  ];

  for (const constituency of constituencies) {
    if (constituency.districtId) {
      await prisma.constituency.create({
        data: {
          name: constituency.name,
          nameTamil: constituency.nameTamil,
          type: constituency.type,
          districtId: constituency.districtId,
        },
      });
    }
  }
  console.log("Constituencies seeded:", constituencies.length);

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
