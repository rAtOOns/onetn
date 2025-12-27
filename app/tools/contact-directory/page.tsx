"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building, Phone, Mail, MapPin, Search, Info } from "lucide-react";

interface Office {
  district: string;
  districtTamil: string;
  ceoName: string;
  ceoPhone: string;
  ceoEmail: string;
  deoName: string;
  deoPhone: string;
  address: string;
}

const officeDirectory: Office[] = [
  { district: "Chennai", districtTamil: "சென்னை", ceoName: "CEO Chennai", ceoPhone: "044-25384949", ceoEmail: "ceochennai@tn.gov.in", deoName: "DEO Chennai", deoPhone: "044-25384950", address: "DPI Campus, College Road, Chennai - 600006" },
  { district: "Coimbatore", districtTamil: "கோயம்புத்தூர்", ceoName: "CEO Coimbatore", ceoPhone: "0422-2301010", ceoEmail: "ceocbe@tn.gov.in", deoName: "DEO Coimbatore", deoPhone: "0422-2301011", address: "Collectorate Campus, Coimbatore - 641018" },
  { district: "Madurai", districtTamil: "மதுரை", ceoName: "CEO Madurai", ceoPhone: "0452-2530252", ceoEmail: "ceomdu@tn.gov.in", deoName: "DEO Madurai", deoPhone: "0452-2530253", address: "Collectorate, Madurai - 625020" },
  { district: "Trichy", districtTamil: "திருச்சி", ceoName: "CEO Trichy", ceoPhone: "0431-2331091", ceoEmail: "ceotry@tn.gov.in", deoName: "DEO Trichy", deoPhone: "0431-2331092", address: "Collectorate Campus, Trichy - 620001" },
  { district: "Salem", districtTamil: "சேலம்", ceoName: "CEO Salem", ceoPhone: "0427-2311445", ceoEmail: "ceoslm@tn.gov.in", deoName: "DEO Salem", deoPhone: "0427-2311446", address: "Collectorate, Salem - 636007" },
  { district: "Tirunelveli", districtTamil: "திருநெல்வேலி", ceoName: "CEO Tirunelveli", ceoPhone: "0462-2501255", ceoEmail: "ceotvl@tn.gov.in", deoName: "DEO Tirunelveli", deoPhone: "0462-2501256", address: "Collectorate, Tirunelveli - 627001" },
  { district: "Vellore", districtTamil: "வேலூர்", ceoName: "CEO Vellore", ceoPhone: "0416-2220911", ceoEmail: "ceovlr@tn.gov.in", deoName: "DEO Vellore", deoPhone: "0416-2220912", address: "Collectorate, Vellore - 632001" },
  { district: "Erode", districtTamil: "ஈரோடு", ceoName: "CEO Erode", ceoPhone: "0424-2256311", ceoEmail: "ceoerd@tn.gov.in", deoName: "DEO Erode", deoPhone: "0424-2256312", address: "Collectorate, Erode - 638001" },
  { district: "Thanjavur", districtTamil: "தஞ்சாவூர்", ceoName: "CEO Thanjavur", ceoPhone: "04362-231491", ceoEmail: "ceotnj@tn.gov.in", deoName: "DEO Thanjavur", deoPhone: "04362-231492", address: "Collectorate, Thanjavur - 613001" },
  { district: "Kancheepuram", districtTamil: "காஞ்சிபுரம்", ceoName: "CEO Kancheepuram", ceoPhone: "044-27222550", ceoEmail: "ceokpm@tn.gov.in", deoName: "DEO Kancheepuram", deoPhone: "044-27222551", address: "Collectorate, Kancheepuram - 631501" },
  { district: "Cuddalore", districtTamil: "கடலூர்", ceoName: "CEO Cuddalore", ceoPhone: "04142-231751", ceoEmail: "ceocdl@tn.gov.in", deoName: "DEO Cuddalore", deoPhone: "04142-231752", address: "Collectorate, Cuddalore - 607001" },
  { district: "Villupuram", districtTamil: "விழுப்புரம்", ceoName: "CEO Villupuram", ceoPhone: "04146-222311", ceoEmail: "ceovpm@tn.gov.in", deoName: "DEO Villupuram", deoPhone: "04146-222312", address: "Collectorate, Villupuram - 605602" },
  { district: "Tiruvannamalai", districtTamil: "திருவண்ணாமலை", ceoName: "CEO Tiruvannamalai", ceoPhone: "04175-222501", ceoEmail: "ceotvm@tn.gov.in", deoName: "DEO Tiruvannamalai", deoPhone: "04175-222502", address: "Collectorate, Tiruvannamalai - 606601" },
  { district: "Dindigul", districtTamil: "திண்டுக்கல்", ceoName: "CEO Dindigul", ceoPhone: "0451-2420700", ceoEmail: "ceodgl@tn.gov.in", deoName: "DEO Dindigul", deoPhone: "0451-2420701", address: "Collectorate, Dindigul - 624001" },
  { district: "Theni", districtTamil: "தேனி", ceoName: "CEO Theni", ceoPhone: "04546-252301", ceoEmail: "ceothn@tn.gov.in", deoName: "DEO Theni", deoPhone: "04546-252302", address: "Collectorate, Theni - 625531" },
  { district: "Ramanathapuram", districtTamil: "ராமநாதபுரம்", ceoName: "CEO Ramanathapuram", ceoPhone: "04567-220301", ceoEmail: "ceormd@tn.gov.in", deoName: "DEO Ramanathapuram", deoPhone: "04567-220302", address: "Collectorate, Ramanathapuram - 623501" },
  { district: "Virudhunagar", districtTamil: "விருதுநகர்", ceoName: "CEO Virudhunagar", ceoPhone: "04562-252301", ceoEmail: "ceovnr@tn.gov.in", deoName: "DEO Virudhunagar", deoPhone: "04562-252302", address: "Collectorate, Virudhunagar - 626001" },
  { district: "Sivagangai", districtTamil: "சிவகங்கை", ceoName: "CEO Sivagangai", ceoPhone: "04575-241301", ceoEmail: "ceosvg@tn.gov.in", deoName: "DEO Sivagangai", deoPhone: "04575-241302", address: "Collectorate, Sivagangai - 630561" },
  { district: "Nagapattinam", districtTamil: "நாகப்பட்டினம்", ceoName: "CEO Nagapattinam", ceoPhone: "04365-252301", ceoEmail: "ceonpt@tn.gov.in", deoName: "DEO Nagapattinam", deoPhone: "04365-252302", address: "Collectorate, Nagapattinam - 611001" },
  { district: "Tiruvarur", districtTamil: "திருவாரூர்", ceoName: "CEO Tiruvarur", ceoPhone: "04366-242301", ceoEmail: "ceotvr@tn.gov.in", deoName: "DEO Tiruvarur", deoPhone: "04366-242302", address: "Collectorate, Tiruvarur - 610001" },
  { district: "Karur", districtTamil: "கரூர்", ceoName: "CEO Karur", ceoPhone: "04324-256301", ceoEmail: "ceokrr@tn.gov.in", deoName: "DEO Karur", deoPhone: "04324-256302", address: "Collectorate, Karur - 639001" },
  { district: "Namakkal", districtTamil: "நாமக்கல்", ceoName: "CEO Namakkal", ceoPhone: "04286-266301", ceoEmail: "ceonkl@tn.gov.in", deoName: "DEO Namakkal", deoPhone: "04286-266302", address: "Collectorate, Namakkal - 637001" },
  { district: "Dharmapuri", districtTamil: "தர்மபுரி", ceoName: "CEO Dharmapuri", ceoPhone: "04342-230301", ceoEmail: "ceodpi@tn.gov.in", deoName: "DEO Dharmapuri", deoPhone: "04342-230302", address: "Collectorate, Dharmapuri - 636701" },
  { district: "Krishnagiri", districtTamil: "கிருஷ்ணகிரி", ceoName: "CEO Krishnagiri", ceoPhone: "04343-230301", ceoEmail: "ceokgi@tn.gov.in", deoName: "DEO Krishnagiri", deoPhone: "04343-230302", address: "Collectorate, Krishnagiri - 635001" },
  { district: "Tiruppur", districtTamil: "திருப்பூர்", ceoName: "CEO Tiruppur", ceoPhone: "0421-2200301", ceoEmail: "ceotpr@tn.gov.in", deoName: "DEO Tiruppur", deoPhone: "0421-2200302", address: "Collectorate, Tiruppur - 641601" },
  { district: "Nilgiris", districtTamil: "நீலகிரி", ceoName: "CEO Nilgiris", ceoPhone: "0423-2442301", ceoEmail: "ceonlg@tn.gov.in", deoName: "DEO Nilgiris", deoPhone: "0423-2442302", address: "Collectorate, Udhagamandalam - 643001" },
  { district: "Kanniyakumari", districtTamil: "கன்னியாகுமரி", ceoName: "CEO Kanniyakumari", ceoPhone: "04652-232301", ceoEmail: "ceokk@tn.gov.in", deoName: "DEO Kanniyakumari", deoPhone: "04652-232302", address: "Collectorate, Nagercoil - 629001" },
  { district: "Thoothukudi", districtTamil: "தூத்துக்குடி", ceoName: "CEO Thoothukudi", ceoPhone: "0461-2320301", ceoEmail: "ceotut@tn.gov.in", deoName: "DEO Thoothukudi", deoPhone: "0461-2320302", address: "Collectorate, Thoothukudi - 628001" },
  { district: "Pudukkottai", districtTamil: "புதுக்கோட்டை", ceoName: "CEO Pudukkottai", ceoPhone: "04322-220301", ceoEmail: "ceopdk@tn.gov.in", deoName: "DEO Pudukkottai", deoPhone: "04322-220302", address: "Collectorate, Pudukkottai - 622001" },
  { district: "Ariyalur", districtTamil: "அரியலூர்", ceoName: "CEO Ariyalur", ceoPhone: "04329-222301", ceoEmail: "ceoalr@tn.gov.in", deoName: "DEO Ariyalur", deoPhone: "04329-222302", address: "Collectorate, Ariyalur - 621704" },
  { district: "Perambalur", districtTamil: "பெரம்பலூர்", ceoName: "CEO Perambalur", ceoPhone: "04328-277301", ceoEmail: "ceopbr@tn.gov.in", deoName: "DEO Perambalur", deoPhone: "04328-277302", address: "Collectorate, Perambalur - 621212" },
  { district: "Tiruppathur", districtTamil: "திருப்பத்தூர்", ceoName: "CEO Tiruppathur", ceoPhone: "04179-220301", ceoEmail: "ceotpt@tn.gov.in", deoName: "DEO Tiruppathur", deoPhone: "04179-220302", address: "Collectorate, Tiruppathur - 635601" },
  { district: "Ranipet", districtTamil: "ராணிப்பேட்டை", ceoName: "CEO Ranipet", ceoPhone: "04172-220301", ceoEmail: "ceorpt@tn.gov.in", deoName: "DEO Ranipet", deoPhone: "04172-220302", address: "Collectorate, Ranipet - 632401" },
  { district: "Chengalpattu", districtTamil: "செங்கல்பட்டு", ceoName: "CEO Chengalpattu", ceoPhone: "044-27422301", ceoEmail: "ceocgl@tn.gov.in", deoName: "DEO Chengalpattu", deoPhone: "044-27422302", address: "Collectorate, Chengalpattu - 603001" },
  { district: "Kallakurichi", districtTamil: "கள்ளக்குறிச்சி", ceoName: "CEO Kallakurichi", ceoPhone: "04151-220301", ceoEmail: "ceokki@tn.gov.in", deoName: "DEO Kallakurichi", deoPhone: "04151-220302", address: "Collectorate, Kallakurichi - 606202" },
  { district: "Tenkasi", districtTamil: "தென்காசி", ceoName: "CEO Tenkasi", ceoPhone: "04633-220301", ceoEmail: "ceotks@tn.gov.in", deoName: "DEO Tenkasi", deoPhone: "04633-220302", address: "Collectorate, Tenkasi - 627811" },
  { district: "Mayiladuthurai", districtTamil: "மயிலாடுதுறை", ceoName: "CEO Mayiladuthurai", ceoPhone: "04364-220301", ceoEmail: "ceomyl@tn.gov.in", deoName: "DEO Mayiladuthurai", deoPhone: "04364-220302", address: "Collectorate, Mayiladuthurai - 609001" },
];

// Important state-level contacts
const stateContacts = [
  { name: "Director of School Education", phone: "044-28278801", email: "dse@tn.gov.in", address: "DPI Campus, Chennai - 600006" },
  { name: "Director of Elementary Education", phone: "044-28278802", email: "dee@tn.gov.in", address: "DPI Campus, Chennai - 600006" },
  { name: "Director of Matriculation Schools", phone: "044-28278803", email: "dms@tn.gov.in", address: "DPI Campus, Chennai - 600006" },
  { name: "Director of Government Examinations", phone: "044-28278820", email: "dge@tn.gov.in", address: "DPI Campus, Chennai - 600006" },
  { name: "Teachers Recruitment Board", phone: "044-28278830", email: "trb@tn.gov.in", address: "DPI Campus, Chennai - 600006" },
  { name: "State Council of Educational Research and Training", phone: "044-28278850", email: "scert@tn.gov.in", address: "DPI Campus, Chennai - 600006" },
];

export default function ContactDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredOffices = officeDirectory.filter(
    (office) =>
      office.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      office.districtTamil.includes(searchTerm)
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/tools" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-tn-text flex items-center gap-2">
            <Building className="text-amber-600" size={28} />
            Contact Directory
          </h1>
          <p className="text-sm text-gray-500 tamil">தொடர்பு விவரங்கள்</p>
        </div>
      </div>

      {/* State Level Contacts */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white mb-6">
        <h2 className="font-bold text-lg mb-4">State Level Offices</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {stateContacts.map((contact, idx) => (
            <div key={idx} className="bg-white/20 rounded-lg p-3">
              <p className="font-medium">{contact.name}</p>
              <div className="flex items-center gap-2 text-sm mt-1 opacity-90">
                <Phone size={12} />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Mail size={12} />
                <span>{contact.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search district name..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Showing {filteredOffices.length} of {officeDirectory.length} districts
        </p>
      </div>

      {/* District Directory */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">District</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">CEO Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">DEO Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOffices.map((office, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-tn-text">{office.district}</p>
                    <p className="text-xs text-gray-500 tamil">{office.districtTamil}</p>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${office.ceoPhone}`}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <Phone size={12} />
                      {office.ceoPhone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${office.deoPhone}`}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <Phone size={12} />
                      {office.deoPhone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${office.ceoEmail}`}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <Mail size={12} />
                      {office.ceoEmail}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOffices.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <p className="text-gray-500">No districts found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          <Info size={18} />
          Important Notes
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>CEO:</strong> Chief Educational Officer - District level head for school education.</p>
          <p><strong>DEO:</strong> District Educational Officer - Handles secondary education matters.</p>
          <p><strong>BEO:</strong> Block Educational Officer - Contact CEO office for BEO details.</p>
          <p><strong>Office Hours:</strong> 10:00 AM to 5:45 PM (Monday to Friday)</p>
          <p className="text-xs mt-2">Contact details are indicative. Please verify from official sources.</p>
        </div>
      </div>
    </div>
  );
}
