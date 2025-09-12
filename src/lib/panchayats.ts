
export type Panchayat = {
  id: string;
  name: string;
};

export const panchayats: Panchayat[] = [
  // Bagalkot
  { id: 'badami', name: 'Badami (Bagalkot)' },
  { id: 'jamkhandi', name: 'Jamkhandi (Bagalkot)' },
  { id: 'mudhol', name: 'Mudhol (Bagalkot)' },
  // Bangalore Rural
  { id: 'doddaballapur', name: 'Doddaballapur (Bangalore Rural)' },
  { id: 'nelamangala', name: 'Nelamangala (Bangalore Rural)' },
  { id: 'hoskote', name: 'Hoskote (Bangalore Rural)' },
  // Bangalore Urban
  { id: 'anekal', name: 'Anekal (Bangalore Urban)' },
  { id: 'yelahanka', name: 'Yelahanka (Bangalore Urban)' },
  { id: 'suggatta', name: 'Suggatta (Bangalore Urban)' },
  { id: 'adakamaranahalli', name: 'Adakamaranahalli (Bangalore Urban)'},
  // Belagavi
  { id: 'athani', name: 'Athani (Belagavi)' },
  { id: 'bailhongal', name: 'Bailhongal (Belagavi)' },
  { id: 'gokak', name: 'Gokak (Belagavi)' },
  { id: 'kakati', name: 'Kakati (Belagavi)' },
  { id: 'sankeshwar', name: 'Sankeshwar (Belagavi)' },
  // Bellary
  { id: 'hospet', name: 'Hospet (Bellary)' },
  { id: 'sandur', name: 'Sandur (Bellary)' },
  { id: 'siruguppa', name: 'Siruguppa (Bellary)' },
  // Bidar
  { id: 'basavakalyan', name: 'Basavakalyan (Bidar)' },
  { id: 'bhalki', name: 'Bhalki (Bidar)' },
  { id: 'aurad', name: 'Aurad (Bidar)' },
  // Vijayapura
  { id: 'indi', name: 'Indi (Vijayapura)' },
  { id: 'muddebihal', name: 'Muddebihal (Vijayapura)' },
  { id: 'sindagi', name: 'Sindagi (Vijayapura)' },
  // Chamarajanagar
  { id: 'kollegal', name: 'Kollegal (Chamarajanagar)' },
  { id: 'gundlupet', name: 'Gundlupet (Chamarajanagar)' },
  { id: 'yelandur', name: 'Yelandur (Chamarajanagar)' },
  // Chikballapur
  { id: 'bagepalli', name: 'Bagepalli (Chikballapur)' },
  { id: 'chintamani', name: 'Chintamani (Chikballapur)' },
  { id: 'gudibanda', name: 'Gudibanda (Chikballapur)' },
  // Chikmagalur
  { id: 'kadur', name: 'Kadur (Chikmagalur)' },
  { id: 'mudigere', name: 'Mudigere (Chikmagalur)' },
  { id: 'sringeri', name: 'Sringeri (Chikmagalur)' },
  // Chitradurga
  { id: 'challakere', name: 'Challakere (Chitradurga)' },
  { id: 'hiriyur', name: 'Hiriyur (Chitradurga)' },
  { id: 'molakalmuru', name: 'Molakalmuru (Chitradurga)' },
  // Dakshina Kannada
  { id: 'bantwal', name: 'Bantwal (Dakshina Kannada)' },
  { id: 'beltangady', name: 'Beltangady (Dakshina Kannada)' },
  { id: 'puttur', name: 'Puttur (Dakshina Kannada)' },
  { id: 'munnur', name: 'Munnur (Dakshina Kannada)' },
  // Davanagere
  { id: 'harihar', name: 'Harihar (Davanagere)' },
  { id: 'jagalur', name: 'Jagalur (Davanagere)' },
  { id: 'honnali', name: 'Honnali (Davanagere)' },
  // Dharwad
  { id: 'hubli', name: 'Hubli (Dharwad)' },
  { id: 'kalghatgi', name: 'Kalghatgi (Dharwad)' },
  { id: 'kundgol', name: 'Kundgol (Dharwad)' },
  // Gadag
  { id: 'nargund', name: 'Nargund (Gadag)' },
  { id: 'ron', name: 'Ron (Gadag)' },
  { id: 'shirahatti', name: 'Shirahatti (Gadag)' },
  // Hassan
  { id: 'arsikere', name: 'Arsikere (Hassan)' },
  { id: 'belur', name: 'Belur (Hassan)' },
  { id: 'holenarasipur', name: 'Holenarasipur (Hassan)' },
  // Haveri
  { id: 'byadgi', name: 'Byadgi (Haveri)' },
  { id: 'hangal', name: 'Hangal (Haveri)' },
  { id: 'savnur', name: 'Savnur (Haveri)' },
  // Kalaburagi (Gulbarga)
  { id: 'afzalpur', name: 'Afzalpur (Kalaburagi)' },
  { id: 'aland', name: 'Aland (Kalaburagi)' },
  { id: 'chittapur', name: 'Chittapur (Kalaburagi)' },
  // Kodagu
  { id: 'madikeri', name: 'Madikeri (Kodagu)' },
  { id: 'somwarpet', name: 'Somwarpet (Kodagu)' },
  { id: 'virajpet', name: 'Virajpet (Kodagu)' },
  // Kolar
  { id: 'bangarapet', name: 'Bangarapet (Kolar)' },
  { id: 'malur', name: 'Malur (Kolar)' },
  { id: 'mulbagal', name: 'Mulbagal (Kolar)' },
  // Koppal
  { id: 'gangavathi', name: 'Gangavathi (Koppal)' },
  { id: 'kushtagi', name: 'Kushtagi (Koppal)' },
  { id: 'yelbarga', name: 'Yelbarga (Koppal)' },
  // Mandya
  { id: 'maddur', name: 'Maddur (Mandya)' },
  { id: 'malavalli', name: 'Malavalli (Mandya)' },
  { id: 'pandavapura', name: 'Pandavapura (Mandya)' },
  // Mysore
  { id: 'hunsur', name: 'Hunsur (Mysore)' },
  { id: 'krishnarajanagara', name: 'Krishnarajanagara (Mysore)' },
  { id: 'nanjangud', name: 'Nanjangud (Mysore)' },
  { id: 'yelwal', name: 'Yelwal (Mysore)' },
  { id: 'hampapura', name: 'Hampapura (Mysore)' },
  // Raichur
  { id: 'devadurga', name: 'Devadurga (Raichur)' },
  { id: 'manvi', name: 'Manvi (Raichur)' },
  { id: 'sindhanur', name: 'Sindhanur (Raichur)' },
  // Ramanagara
  { id: 'chanapatna', name: 'Chanapatna (Ramanagara)' },
  { id: 'kanakapura', name: 'Kanakapura (Ramanagara)' },
  { id: 'magadi', name: 'Magadi (Ramanagara)' },
  // Shivamogga
  { id: 'bhadravati', name: 'Bhadravati (Shivamogga)' },
  { id: 'sagar', name: 'Sagar (Shivamogga)' },
  { id: 'sorab', name: 'Sorab (Shivamogga)' },
  { id: 'ayanur', name: 'Ayanur (Shivamogga)' },
  // Tumakuru
  { id: 'chiknayakanhalli', name: 'Chiknayakanhalli (Tumakuru)' },
  { id: 'gubbi', name: 'Gubbi (Tumakuru)' },
  { id: 'kunigal', name: 'Kunigal (Tumakuru)' },
  { id: 'oorukere', name: 'Oorukere (Tumakuru)' },
  // Udupi
  { id: 'karkala', name: 'Karkala (Udupi)' },
  { id: 'kundapura', name: 'Kundapura (Udupi)' },
  { id: 'padubidri', name: 'Padubidri (Udupi)' },
  // Uttara Kannada
  { id: 'bhatkal', name: 'Bhatkal (Uttara Kannada)' },
  { id: 'karwar', name: 'Karwar (Uttara Kannada)' },
  { id: 'sirsi', name: 'Sirsi (Uttara Kannada)' },
  // Yadgir
  { id: 'shahapur', name: 'Shahapur (Yadgir)' },
  { id: 'shorapur', name: 'Shorapur (Yadgir)' },
  { id: 'yadgir', name: 'Yadgir (Yadgir)' },
];
