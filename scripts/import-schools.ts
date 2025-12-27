/**
 * School Data Import Script
 *
 * This script imports school data from various sources:
 * 1. CSV files
 * 2. JSON files
 * 3. Sample data for testing
 *
 * Usage:
 *   npx tsx scripts/import-schools.ts --sample    # Import sample data
 *   npx tsx scripts/import-schools.ts --csv <file>  # Import from CSV
 *   npx tsx scripts/import-schools.ts --json <file> # Import from JSON
 */

import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// Comprehensive school data for Tamil Nadu
// Data compiled from public sources: schools.org.in, thelearningpoint.net, kalviseithi.net
const sampleSchools = [
  // ═══════════════════════════════════════════════════════════
  // CHENNAI DISTRICT (10 blocks)
  // ═══════════════════════════════════════════════════════════
  {
    emisCode: "33010100101",
    name: "Government Higher Secondary School, Nungambakkam",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, நுங்கம்பாக்கம்",
    district: "Chennai",
    districtTamil: "சென்னை",
    block: "Nungambakkam",
    village: "Nungambakkam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "600034",
  },
  {
    emisCode: "33010100102",
    name: "Government Girls Higher Secondary School, T.Nagar",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, தியாகராயநகர்",
    district: "Chennai",
    districtTamil: "சென்னை",
    block: "T.Nagar",
    village: "T.Nagar",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "600017",
  },
  {
    emisCode: "33010100103",
    name: "Corporation High School, Mylapore",
    nameTamil: "மாநகராட்சி உயர்நிலைப் பள்ளி, மயிலாப்பூர்",
    district: "Chennai",
    districtTamil: "சென்னை",
    block: "Mylapore",
    village: "Mylapore",
    schoolType: "High",
    management: "Corporation",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "600004",
  },
  {
    emisCode: "33010100104",
    name: "Govt. ADW Higher Secondary School, Tondiarpet",
    nameTamil: "அரசு ஆதிதிராவிடர் நல மேல்நிலைப் பள்ளி, தண்டையார்பேட்டை",
    district: "Chennai",
    districtTamil: "சென்னை",
    block: "Tondiarpet",
    village: "Tondiarpet",
    schoolType: "Higher Secondary",
    management: "ADW",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "600081",
  },

  // Coimbatore District
  {
    emisCode: "33020200101",
    name: "Government Higher Secondary School, R.S. Puram",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, ஆர்.எஸ்.புரம்",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Coimbatore North",
    village: "R.S. Puram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "641002",
  },
  {
    emisCode: "33020200102",
    name: "Government Boys Higher Secondary School, Gandhipuram",
    nameTamil: "அரசு ஆண்கள் மேல்நிலைப் பள்ளி, காந்திபுரம்",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Coimbatore South",
    village: "Gandhipuram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Boys",
    pincode: "641012",
  },
  {
    emisCode: "33020200103",
    name: "Aided Middle School, Peelamedu",
    nameTamil: "உதவி பெறும் நடுநிலைப் பள்ளி, பீளமேடு",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Coimbatore South",
    village: "Peelamedu",
    schoolType: "Middle",
    management: "Govt Aided",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "641004",
  },

  // Madurai District
  {
    emisCode: "33030300101",
    name: "Government Higher Secondary School, Teppakulam",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, தெப்பக்குளம்",
    district: "Madurai",
    districtTamil: "மதுரை",
    block: "Madurai North",
    village: "Teppakulam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "625001",
  },
  {
    emisCode: "33030300102",
    name: "Government Girls High School, Tallakulam",
    nameTamil: "அரசு பெண்கள் உயர்நிலைப் பள்ளி, தல்லாக்குளம்",
    district: "Madurai",
    districtTamil: "மதுரை",
    block: "Madurai South",
    village: "Tallakulam",
    schoolType: "High",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "625002",
  },

  // Tiruchirappalli District
  {
    emisCode: "33040400101",
    name: "Government Higher Secondary School, Srirangam",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, ஸ்ரீரங்கம்",
    district: "Tiruchirappalli",
    districtTamil: "திருச்சிராப்பள்ளி",
    block: "Srirangam",
    village: "Srirangam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "620006",
  },
  {
    emisCode: "33040400102",
    name: "Corporation Middle School, Cantonment",
    nameTamil: "மாநகராட்சி நடுநிலைப் பள்ளி, கன்டோன்மென்ட்",
    district: "Tiruchirappalli",
    districtTamil: "திருச்சிராப்பள்ளி",
    block: "Trichy West",
    village: "Cantonment",
    schoolType: "Middle",
    management: "Corporation",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "620001",
  },

  // Salem District
  {
    emisCode: "33050500101",
    name: "Government Higher Secondary School, Fairlands",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, ஃபேர்லாண்ட்ஸ்",
    district: "Salem",
    districtTamil: "சேலம்",
    block: "Salem Urban",
    village: "Fairlands",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "636016",
  },
  {
    emisCode: "33050500102",
    name: "ADW High School, Hasthampatti",
    nameTamil: "ஆதிதிராவிடர் நல உயர்நிலைப் பள்ளி, ஹஸ்தம்பட்டி",
    district: "Salem",
    districtTamil: "சேலம்",
    block: "Salem Urban",
    village: "Hasthampatti",
    schoolType: "High",
    management: "ADW",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "636007",
  },

  // Tirunelveli District
  {
    emisCode: "33060600101",
    name: "Government Higher Secondary School, Palayamkottai",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, பாளையங்கோட்டை",
    district: "Tirunelveli",
    districtTamil: "திருநெல்வேலி",
    block: "Palayamkottai",
    village: "Palayamkottai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "627002",
  },

  // Thanjavur District
  {
    emisCode: "33070700101",
    name: "Government Higher Secondary School, Big Temple",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, பெரிய கோவில்",
    district: "Thanjavur",
    districtTamil: "தஞ்சாவூர்",
    block: "Thanjavur",
    village: "Big Temple",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "613001",
  },

  // Vellore District
  {
    emisCode: "33080800101",
    name: "Government Higher Secondary School, Katpadi",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, காட்பாடி",
    district: "Vellore",
    districtTamil: "வேலூர்",
    block: "Katpadi",
    village: "Katpadi",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "632007",
  },

  // Erode District
  {
    emisCode: "33090900101",
    name: "Government Higher Secondary School, Perundurai",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, பெருந்துறை",
    district: "Erode",
    districtTamil: "ஈரோடு",
    block: "Perundurai",
    village: "Perundurai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "638052",
  },

  // Kanniyakumari District
  {
    emisCode: "33101000101",
    name: "Government Higher Secondary School, Nagercoil",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, நாகர்கோவில்",
    district: "Kanniyakumari",
    districtTamil: "கன்னியாகுமரி",
    block: "Nagercoil",
    village: "Nagercoil",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "629001",
  },

  // Dindigul District
  {
    emisCode: "33111100101",
    name: "Government Higher Secondary School, Dindigul Fort",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, திண்டுக்கல் கோட்டை",
    district: "Dindigul",
    districtTamil: "திண்டுக்கல்",
    block: "Dindigul",
    village: "Dindigul Fort",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "624001",
  },

  // Tiruppur District
  {
    emisCode: "33121200101",
    name: "Government Higher Secondary School, Tiruppur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, திருப்பூர்",
    district: "Tiruppur",
    districtTamil: "திருப்பூர்",
    block: "Tiruppur North",
    village: "Tiruppur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "641601",
  },

  // More sample schools to demonstrate variety
  {
    emisCode: "33010100201",
    name: "Government Primary School, Adyar",
    nameTamil: "அரசு தொடக்கப் பள்ளி, அடையார்",
    district: "Chennai",
    districtTamil: "சென்னை",
    block: "Adyar",
    village: "Adyar",
    schoolType: "Primary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "600020",
  },
  {
    emisCode: "33010100202",
    name: "Corporation Primary School, Besant Nagar",
    nameTamil: "மாநகராட்சி தொடக்கப் பள்ளி, பெசன்ட் நகர்",
    district: "Chennai",
    districtTamil: "சென்னை",
    block: "Adyar",
    village: "Besant Nagar",
    schoolType: "Primary",
    management: "Corporation",
    medium: "English",
    category: "Co-ed",
    pincode: "600090",
  },
  {
    emisCode: "33020200201",
    name: "Government Primary School, Sulur",
    nameTamil: "அரசு தொடக்கப் பள்ளி, சூலூர்",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Sulur",
    village: "Sulur",
    schoolType: "Primary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "641402",
  },

  // ═══════════════════════════════════════════════════════════
  // ADDITIONAL REAL SCHOOLS FROM WEB DATA
  // ═══════════════════════════════════════════════════════════

  // Dharmapuri District
  {
    emisCode: "33130100101",
    name: "Adhiyaman Government Boys Higher Secondary School",
    nameTamil: "அதியமான் அரசு ஆண்கள் மேல்நிலைப் பள்ளி",
    district: "Dharmapuri",
    districtTamil: "தர்மபுரி",
    block: "Dharmapuri",
    village: "Appavu Nagar",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Boys",
    pincode: "636701",
  },
  {
    emisCode: "33130100102",
    name: "Avvaiyar Government Higher Secondary School",
    nameTamil: "அவ்வையார் அரசு மேல்நிலைப் பள்ளி",
    district: "Dharmapuri",
    districtTamil: "தர்மபுரி",
    block: "Dharmapuri",
    village: "Dharmapuri",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "636702",
  },
  {
    emisCode: "33130100103",
    name: "Government High School, Palacode",
    nameTamil: "அரசு உயர்நிலைப் பள்ளி, பாலக்கோடு",
    district: "Dharmapuri",
    districtTamil: "தர்மபுரி",
    block: "Palacode",
    village: "Palacode",
    schoolType: "High",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "636808",
  },

  // Coimbatore District - Additional Schools
  {
    emisCode: "33020200301",
    name: "VRT Government Girls Higher Secondary School, Anaimalai",
    nameTamil: "VRT அரசு பெண்கள் மேல்நிலைப் பள்ளி, ஆனைமலை",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Anaimalai",
    village: "Anaimalai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "642101",
  },
  {
    emisCode: "33020200302",
    name: "Government Higher Secondary School, Chettipalayam",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, செட்டிபாளையம்",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Coimbatore South",
    village: "Chettipalayam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "641201",
  },
  {
    emisCode: "33020200303",
    name: "Government Girls Higher Secondary School, Chinnathadagam",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, சின்னத்தடாகம்",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Periyanaickenpalayam",
    village: "Chinnathadagam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "641108",
  },
  {
    emisCode: "33020200304",
    name: "Government Boys Higher Secondary School, Chinnathadagam",
    nameTamil: "அரசு ஆண்கள் மேல்நிலைப் பள்ளி, சின்னத்தடாகம்",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Periyanaickenpalayam",
    village: "Chinnathadagam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Boys",
    pincode: "641108",
  },
  {
    emisCode: "33020200305",
    name: "Government Higher Secondary School, Kavundampalayam",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, கவுண்டம்பாளையம்",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Coimbatore North",
    village: "Kavundampalayam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "641030",
  },
  {
    emisCode: "33020200306",
    name: "Government Model Higher Secondary School, Asokapuram",
    nameTamil: "அரசு மாதிரி மேல்நிலைப் பள்ளி, அசோகபுரம்",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Coimbatore South",
    village: "Asokapuram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "641015",
  },
  {
    emisCode: "33020200307",
    name: "Government Higher Secondary School, Sundapalayam",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, சுண்டபாளையம்",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Periyanaickenpalayam",
    village: "Sundapalayam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "641107",
  },

  // Madurai District - Additional Schools
  {
    emisCode: "33030300201",
    name: "Government Higher Secondary School, T. Mettupatti",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, தி. மேட்டுப்பட்டி",
    district: "Madurai",
    districtTamil: "மதுரை",
    block: "Melur",
    village: "T. Mettupatti",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "625106",
  },
  {
    emisCode: "33030300202",
    name: "Madurai District Government Model School",
    nameTamil: "மதுரை மாவட்ட அரசு மாதிரிப் பள்ளி",
    district: "Madurai",
    districtTamil: "மதுரை",
    block: "Madurai East",
    village: "Madurai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "English",
    category: "Co-ed",
    pincode: "625020",
  },
  {
    emisCode: "33030300203",
    name: "Government Girls Higher Secondary School, Arapalayam",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, அரபாளையம்",
    district: "Madurai",
    districtTamil: "மதுரை",
    block: "Madurai West",
    village: "Arapalayam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "625016",
  },

  // Namakkal District
  {
    emisCode: "33140100101",
    name: "Government Higher Secondary School, Pachal",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, பச்சல்",
    district: "Namakkal",
    districtTamil: "நாமக்கல்",
    block: "Namakkal",
    village: "Pachal",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "637001",
  },
  {
    emisCode: "33140100102",
    name: "Government Girls Higher Secondary School, Tiruchengode",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, திருச்செங்கோடு",
    district: "Namakkal",
    districtTamil: "நாமக்கல்",
    block: "Tiruchengode",
    village: "Tiruchengode",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "637211",
  },
  {
    emisCode: "33140100103",
    name: "Government High School, Rasipuram",
    nameTamil: "அரசு உயர்நிலைப் பள்ளி, ராசிபுரம்",
    district: "Namakkal",
    districtTamil: "நாமக்கல்",
    block: "Rasipuram",
    village: "Rasipuram",
    schoolType: "High",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "637408",
  },

  // Virudhunagar District
  {
    emisCode: "33150100101",
    name: "Government Higher Secondary School, Panaiyur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, பனையூர்",
    district: "Virudhunagar",
    districtTamil: "விருதுநகர்",
    block: "Virudhunagar",
    village: "Panaiyur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "626001",
  },
  {
    emisCode: "33150100102",
    name: "Government Boys Higher Secondary School, Sivakasi",
    nameTamil: "அரசு ஆண்கள் மேல்நிலைப் பள்ளி, சிவகாசி",
    district: "Virudhunagar",
    districtTamil: "விருதுநகர்",
    block: "Sivakasi",
    village: "Sivakasi",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Boys",
    pincode: "626123",
  },

  // Kancheepuram District
  {
    emisCode: "33160100101",
    name: "Government Girls Higher Secondary School, Ekanampettai",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, ஏகனம்பேட்டை",
    district: "Kancheepuram",
    districtTamil: "காஞ்சிபுரம்",
    block: "Uthiramerur",
    village: "Ekanampettai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "603107",
  },
  {
    emisCode: "33160100102",
    name: "Government Higher Secondary School, Sriperumbudur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, ஸ்ரீபெரும்புதூர்",
    district: "Kancheepuram",
    districtTamil: "காஞ்சிபுரம்",
    block: "Sriperumbudur",
    village: "Sriperumbudur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "602105",
  },

  // Tenkasi District
  {
    emisCode: "33170100101",
    name: "Government Girls Higher Secondary School, Sankarankovil",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, சங்கரன்கோவில்",
    district: "Tenkasi",
    districtTamil: "தென்காசி",
    block: "Sankarankovil",
    village: "Sankarankovil",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "627756",
  },
  {
    emisCode: "33170100102",
    name: "Government Higher Secondary School, Tenkasi",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, தென்காசி",
    district: "Tenkasi",
    districtTamil: "தென்காசி",
    block: "Tenkasi",
    village: "Tenkasi",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "627811",
  },

  // Chengalpattu District
  {
    emisCode: "33180100101",
    name: "Government Boys Higher Secondary School, Nandhivaram",
    nameTamil: "அரசு ஆண்கள் மேல்நிலைப் பள்ளி, நந்திவரம்",
    district: "Chengalpattu",
    districtTamil: "செங்கல்பட்டு",
    block: "Kattankolathur",
    village: "Nandhivaram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Boys",
    pincode: "603001",
  },
  {
    emisCode: "33180100102",
    name: "Government Girls Higher Secondary School, Nandhivaram",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, நந்திவரம்",
    district: "Chengalpattu",
    districtTamil: "செங்கல்பட்டு",
    block: "Kattankolathur",
    village: "Nandhivaram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "603001",
  },
  {
    emisCode: "33180100103",
    name: "Government Higher Secondary School, Mahabalipuram",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, மகாபலிபுரம்",
    district: "Chengalpattu",
    districtTamil: "செங்கல்பட்டு",
    block: "Thiruporur",
    village: "Mahabalipuram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "603104",
  },

  // The Nilgiris District
  {
    emisCode: "33190100101",
    name: "Government Higher Secondary School, Ooty",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, உதகமண்டலம்",
    district: "Nilgiris",
    districtTamil: "நீலகிரி",
    block: "Udhagamandalam",
    village: "Ooty",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "643001",
  },
  {
    emisCode: "33190100102",
    name: "Government Higher Secondary School, Gudalur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, குடலூர்",
    district: "Nilgiris",
    districtTamil: "நீலகிரி",
    block: "Gudalur",
    village: "Gudalur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "643212",
  },
  {
    emisCode: "33190100103",
    name: "Government Higher Secondary School, Coonoor",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, குன்னூர்",
    district: "Nilgiris",
    districtTamil: "நீலகிரி",
    block: "Coonoor",
    village: "Coonoor",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "643101",
  },

  // Salem District - Additional Schools
  {
    emisCode: "33050500201",
    name: "Government Girls Higher Secondary School, Gangavalli",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, கங்காவள்ளி",
    district: "Salem",
    districtTamil: "சேலம்",
    block: "Gangavalli",
    village: "Gangavalli",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "636105",
  },
  {
    emisCode: "33050500202",
    name: "Government Higher Secondary School, Thedavoor",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, தேடவூர்",
    district: "Salem",
    districtTamil: "சேலம்",
    block: "Attur",
    village: "Thedavoor",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "636102",
  },
  {
    emisCode: "33050500203",
    name: "Government Higher Secondary School, Yethapur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, ஏத்தாப்பூர்",
    district: "Salem",
    districtTamil: "சேலம்",
    block: "Salem Rural",
    village: "Yethapur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "636119",
  },
  {
    emisCode: "33050500204",
    name: "Government Boys Higher Secondary School, Pethanaickenpalayam",
    nameTamil: "அரசு ஆண்கள் மேல்நிலைப் பள்ளி, பேத்தநாயக்கன்பாளையம்",
    district: "Salem",
    districtTamil: "சேலம்",
    block: "Pethanaickenpalayam",
    village: "Pethanaickenpalayam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Boys",
    pincode: "636351",
  },
  {
    emisCode: "33050500205",
    name: "Government Higher Secondary School, Kanjanaickenpatti",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, கஞ்சனாயக்கன்பட்டி",
    district: "Salem",
    districtTamil: "சேலம்",
    block: "Omalur",
    village: "Kanjanaickenpatti",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "636455",
  },
  {
    emisCode: "33050500206",
    name: "Government Higher Secondary School, Samudram",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, சமுத்திரம்",
    district: "Salem",
    districtTamil: "சேலம்",
    block: "Mecheri",
    village: "Samudram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "636453",
  },

  // Sivagangai District
  {
    emisCode: "33200100101",
    name: "Government Higher Secondary School, Sivagangai",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, சிவகங்கை",
    district: "Sivagangai",
    districtTamil: "சிவகங்கை",
    block: "Sivagangai",
    village: "Sivagangai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "630561",
  },
  {
    emisCode: "33200100102",
    name: "Government Girls Higher Secondary School, Karaikudi",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, காரைக்குடி",
    district: "Sivagangai",
    districtTamil: "சிவகங்கை",
    block: "Karaikudi",
    village: "Karaikudi",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "630001",
  },
  {
    emisCode: "33200100103",
    name: "Government Higher Secondary School, Devakottai",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, தேவகோட்டை",
    district: "Sivagangai",
    districtTamil: "சிவகங்கை",
    block: "Devakottai",
    village: "Devakottai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "630302",
  },

  // Krishnagiri District
  {
    emisCode: "33210100101",
    name: "Government Higher Secondary School, Krishnagiri",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, கிருஷ்ணகிரி",
    district: "Krishnagiri",
    districtTamil: "கிருஷ்ணகிரி",
    block: "Krishnagiri",
    village: "Krishnagiri",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "635001",
  },
  {
    emisCode: "33210100102",
    name: "Government Higher Secondary School, Hosur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, ஓசூர்",
    district: "Krishnagiri",
    districtTamil: "கிருஷ்ணகிரி",
    block: "Hosur",
    village: "Hosur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "635109",
  },

  // Villupuram District
  {
    emisCode: "33220100101",
    name: "Government Higher Secondary School, Villupuram",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, விழுப்புரம்",
    district: "Villupuram",
    districtTamil: "விழுப்புரம்",
    block: "Villupuram",
    village: "Villupuram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "605602",
  },
  {
    emisCode: "33220100102",
    name: "Government Girls Higher Secondary School, Kallakurichi",
    nameTamil: "அரசு பெண்கள் மேல்நிலைப் பள்ளி, கள்ளக்குறிச்சி",
    district: "Villupuram",
    districtTamil: "விழுப்புரம்",
    block: "Kallakurichi",
    village: "Kallakurichi",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Girls",
    pincode: "606202",
  },

  // Cuddalore District
  {
    emisCode: "33230100101",
    name: "Government Higher Secondary School, Cuddalore",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, கடலூர்",
    district: "Cuddalore",
    districtTamil: "கடலூர்",
    block: "Cuddalore",
    village: "Cuddalore",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "607001",
  },
  {
    emisCode: "33230100102",
    name: "Government Higher Secondary School, Chidambaram",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, சிதம்பரம்",
    district: "Cuddalore",
    districtTamil: "கடலூர்",
    block: "Chidambaram",
    village: "Chidambaram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "608001",
  },

  // Nagapattinam District
  {
    emisCode: "33240100101",
    name: "Government Higher Secondary School, Nagapattinam",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, நாகப்பட்டினம்",
    district: "Nagapattinam",
    districtTamil: "நாகப்பட்டினம்",
    block: "Nagapattinam",
    village: "Nagapattinam",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "611001",
  },
  {
    emisCode: "33240100102",
    name: "Government Higher Secondary School, Thiruvarur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, திருவாரூர்",
    district: "Tiruvarur",
    districtTamil: "திருவாரூர்",
    block: "Thiruvarur",
    village: "Thiruvarur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "610001",
  },

  // Theni District
  {
    emisCode: "33250100101",
    name: "Government Higher Secondary School, Theni",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, தேனி",
    district: "Theni",
    districtTamil: "தேனி",
    block: "Theni",
    village: "Theni",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "625531",
  },
  {
    emisCode: "33250100102",
    name: "Panchayat Union Middle School, Erumalainaickenpat",
    nameTamil: "ஊராட்சி ஒன்றிய நடுநிலைப் பள்ளி, எருமலைநாயக்கன்பட்டி",
    district: "Theni",
    districtTamil: "தேனி",
    block: "Periyakulam",
    village: "Erumalainaickenpat",
    schoolType: "Middle",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "625601",
  },

  // Ramanathapuram District
  {
    emisCode: "33260100101",
    name: "Government Higher Secondary School, Ramanathapuram",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, ராமநாதபுரம்",
    district: "Ramanathapuram",
    districtTamil: "ராமநாதபுரம்",
    block: "Ramanathapuram",
    village: "Ramanathapuram",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "623501",
  },

  // Pudukkottai District
  {
    emisCode: "33270100101",
    name: "Government Higher Secondary School, Pudukkottai",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, புதுக்கோட்டை",
    district: "Pudukkottai",
    districtTamil: "புதுக்கோட்டை",
    block: "Pudukkottai",
    village: "Pudukkottai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "622001",
  },

  // Karur District
  {
    emisCode: "33280100101",
    name: "Government Higher Secondary School, Karur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, கரூர்",
    district: "Karur",
    districtTamil: "கரூர்",
    block: "Karur",
    village: "Karur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "639001",
  },

  // Perambalur District
  {
    emisCode: "33290100101",
    name: "Government Higher Secondary School, Perambalur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, பெரம்பலூர்",
    district: "Perambalur",
    districtTamil: "பெரம்பலூர்",
    block: "Perambalur",
    village: "Perambalur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "621212",
  },

  // Ariyalur District
  {
    emisCode: "33300100101",
    name: "Government Higher Secondary School, Ariyalur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, அரியலூர்",
    district: "Ariyalur",
    districtTamil: "அரியலூர்",
    block: "Ariyalur",
    village: "Ariyalur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "621704",
  },

  // Thoothukudi District
  {
    emisCode: "33310100101",
    name: "Government Higher Secondary School, Thoothukudi",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, தூத்துக்குடி",
    district: "Thoothukudi",
    districtTamil: "தூத்துக்குடி",
    block: "Thoothukudi",
    village: "Thoothukudi",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "628001",
  },

  // Tiruvallur District
  {
    emisCode: "33320100101",
    name: "Government Higher Secondary School, Tiruvallur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, திருவள்ளூர்",
    district: "Tiruvallur",
    districtTamil: "திருவள்ளூர்",
    block: "Tiruvallur",
    village: "Tiruvallur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "602001",
  },
  {
    emisCode: "33320100102",
    name: "Government Higher Secondary School, Avadi",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, ஆவடி",
    district: "Tiruvallur",
    districtTamil: "திருவள்ளூர்",
    block: "Avadi",
    village: "Avadi",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "600054",
  },

  // Tiruvannamalai District
  {
    emisCode: "33330100101",
    name: "Government Higher Secondary School, Tiruvannamalai",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, திருவண்ணாமலை",
    district: "Tiruvannamalai",
    districtTamil: "திருவண்ணாமலை",
    block: "Tiruvannamalai",
    village: "Tiruvannamalai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "606601",
  },

  // Ranipet District
  {
    emisCode: "33340100101",
    name: "Government Higher Secondary School, Ranipet",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, ராணிப்பேட்டை",
    district: "Ranipet",
    districtTamil: "ராணிப்பேட்டை",
    block: "Ranipet",
    village: "Ranipet",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "632401",
  },

  // Tirupathur District
  {
    emisCode: "33350100101",
    name: "Government Higher Secondary School, Tirupathur",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, திருப்பத்தூர்",
    district: "Tirupathur",
    districtTamil: "திருப்பத்தூர்",
    block: "Tirupathur",
    village: "Tirupathur",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "635601",
  },

  // Kallakurichi District
  {
    emisCode: "33360100101",
    name: "Government Higher Secondary School, Kallakurichi",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, கள்ளக்குறிச்சி",
    district: "Kallakurichi",
    districtTamil: "கள்ளக்குறிச்சி",
    block: "Kallakurichi",
    village: "Kallakurichi",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "606202",
  },

  // Mayiladuthurai District
  {
    emisCode: "33370100101",
    name: "Government Higher Secondary School, Mayiladuthurai",
    nameTamil: "அரசு மேல்நிலைப் பள்ளி, மயிலாடுதுறை",
    district: "Mayiladuthurai",
    districtTamil: "மயிலாடுதுறை",
    block: "Mayiladuthurai",
    village: "Mayiladuthurai",
    schoolType: "Higher Secondary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "609001",
  },

  // Additional Primary and Middle Schools for variety
  {
    emisCode: "33010100301",
    name: "Panchayat Union Primary School, Velachery",
    nameTamil: "ஊராட்சி ஒன்றிய தொடக்கப் பள்ளி, வேளச்சேரி",
    district: "Chennai",
    districtTamil: "சென்னை",
    block: "Adyar",
    village: "Velachery",
    schoolType: "Primary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "600042",
  },
  {
    emisCode: "33010100302",
    name: "Municipal Middle School, Triplicane",
    nameTamil: "நகராட்சி நடுநிலைப் பள்ளி, திருவல்லிக்கேணி",
    district: "Chennai",
    districtTamil: "சென்னை",
    block: "Triplicane",
    village: "Triplicane",
    schoolType: "Middle",
    management: "Municipal",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "600005",
  },
  {
    emisCode: "33020200401",
    name: "Panchayat Union Primary School, Pollachi",
    nameTamil: "ஊராட்சி ஒன்றிய தொடக்கப் பள்ளி, பொள்ளாச்சி",
    district: "Coimbatore",
    districtTamil: "கோயம்புத்தூர்",
    block: "Pollachi South",
    village: "Pollachi",
    schoolType: "Primary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "642001",
  },
  {
    emisCode: "33030300301",
    name: "Aided Middle School, Periyar Nagar",
    nameTamil: "உதவி பெறும் நடுநிலைப் பள்ளி, பெரியார் நகர்",
    district: "Madurai",
    districtTamil: "மதுரை",
    block: "Madurai South",
    village: "Periyar Nagar",
    schoolType: "Middle",
    management: "Govt Aided",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "625010",
  },
  {
    emisCode: "33200100201",
    name: "Panchayat Union Primary School, Pagadi",
    nameTamil: "ஊராட்சி ஒன்றிய தொடக்கப் பள்ளி, பாகடி",
    district: "Sivagangai",
    districtTamil: "சிவகங்கை",
    block: "Sivagangai",
    village: "Pagadi",
    schoolType: "Primary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "630562",
  },
  {
    emisCode: "33200100202",
    name: "Panchayat Union Primary School, Iyampatty",
    nameTamil: "ஊராட்சி ஒன்றிய தொடக்கப் பள்ளி, ஐயம்பட்டி",
    district: "Sivagangai",
    districtTamil: "சிவகங்கை",
    block: "Manamadurai",
    village: "Iyampatty",
    schoolType: "Primary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "630606",
  },
  {
    emisCode: "33200100203",
    name: "Panchayat Union Primary School, Pattanapatti",
    nameTamil: "ஊராட்சி ஒன்றிய தொடக்கப் பள்ளி, பட்டணப்பட்டி",
    district: "Sivagangai",
    districtTamil: "சிவகங்கை",
    block: "Thiruppathur",
    village: "Pattanapatti",
    schoolType: "Primary",
    management: "Government",
    medium: "Tamil",
    category: "Co-ed",
    pincode: "630211",
  },
];

async function importSampleData() {
  console.log("Importing sample school data...\n");

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const school of sampleSchools) {
    try {
      await prisma.school.upsert({
        where: { emisCode: school.emisCode },
        update: {
          name: school.name,
          nameTamil: school.nameTamil,
          district: school.district,
          districtTamil: school.districtTamil,
          block: school.block,
          village: school.village,
          schoolType: school.schoolType,
          management: school.management,
          medium: school.medium,
          category: school.category,
          pincode: school.pincode,
        },
        create: school,
      });
      created++;
      console.log(`✓ ${school.name}`);
    } catch (err) {
      console.error(`✗ Error: ${school.emisCode} - ${err}`);
      errors++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Import completed!`);
  console.log(`Created/Updated: ${created}`);
  console.log(`Errors: ${errors}`);
  console.log(`========================================\n`);
}

async function importFromCSV(filePath: string) {
  console.log(`Importing from CSV: ${filePath}\n`);

  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim());

  if (lines.length < 2) {
    console.error("CSV file is empty or has no data rows");
    return;
  }

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  console.log("Headers:", headers);

  let created = 0;
  let errors = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const school: Record<string, string> = {};

    headers.forEach((header, idx) => {
      school[header] = values[idx] || "";
    });

    if (!school.emiscode) {
      console.error(`Row ${i}: Missing EMIS code, skipping`);
      errors++;
      continue;
    }

    try {
      await prisma.school.upsert({
        where: { emisCode: school.emiscode },
        update: {
          name: school.name,
          nameTamil: school.nametamil,
          district: school.district,
          block: school.block,
          village: school.village,
          schoolType: school.schooltype || school.type,
          management: school.management,
          medium: school.medium,
          pincode: school.pincode,
        },
        create: {
          emisCode: school.emiscode,
          name: school.name,
          nameTamil: school.nametamil,
          district: school.district,
          block: school.block,
          village: school.village,
          schoolType: school.schooltype || school.type,
          management: school.management,
          medium: school.medium,
          pincode: school.pincode,
        },
      });
      created++;
      if (created % 100 === 0) {
        console.log(`Progress: ${created} schools imported...`);
      }
    } catch (err) {
      console.error(`Row ${i}: Error - ${err}`);
      errors++;
    }
  }

  console.log(`\nImport completed! Created: ${created}, Errors: ${errors}`);
}

async function importFromJSON(filePath: string) {
  console.log(`Importing from JSON: ${filePath}\n`);

  const content = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(content);
  const schools = Array.isArray(data) ? data : data.schools || [];

  console.log(`Found ${schools.length} schools to import`);

  let created = 0;
  let errors = 0;

  for (const school of schools) {
    if (!school.emisCode) {
      console.error("Missing EMIS code, skipping");
      errors++;
      continue;
    }

    try {
      await prisma.school.upsert({
        where: { emisCode: school.emisCode },
        update: school,
        create: school,
      });
      created++;
      if (created % 100 === 0) {
        console.log(`Progress: ${created} schools imported...`);
      }
    } catch (err) {
      console.error(`Error importing ${school.emisCode}: ${err}`);
      errors++;
    }
  }

  console.log(`\nImport completed! Created: ${created}, Errors: ${errors}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--sample") {
    await importSampleData();
  } else if (args[0] === "--csv" && args[1]) {
    await importFromCSV(args[1]);
  } else if (args[0] === "--json" && args[1]) {
    await importFromJSON(args[1]);
  } else {
    console.log(`
Usage:
  npx tsx scripts/import-schools.ts --sample      Import sample data (25 schools)
  npx tsx scripts/import-schools.ts --csv <file>  Import from CSV file
  npx tsx scripts/import-schools.ts --json <file> Import from JSON file

CSV Format:
  emisCode,name,nameTamil,district,block,village,schoolType,management,medium,pincode

JSON Format:
  [{ "emisCode": "...", "name": "...", ... }]
    `);
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
