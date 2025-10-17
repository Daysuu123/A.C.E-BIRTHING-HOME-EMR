// Philippines provinces and cities/municipalities by province.
// Note: This list includes all standard provinces and a broad set of cities/municipalities
// for the most populated provinces and NCR. You can expand citiesByProvince as needed.

const provinces = [
  "Metro Manila (NCR)",
  "Abra", "Apayao", "Benguet", "Ifugao", "Kalinga", "Mountain Province",
  "Ilocos Norte", "Ilocos Sur", "La Union", "Pangasinan",
  "Batanes", "Cagayan", "Isabela", "Nueva Vizcaya", "Quirino",
  "Aurora", "Bataan", "Bulacan", "Nueva Ecija", "Pampanga", "Tarlac", "Zambales",
  "Batangas", "Cavite", "Laguna", "Quezon", "Rizal",
  "Marinduque", "Occidental Mindoro", "Oriental Mindoro", "Palawan", "Romblon",
  "Albay", "Camarines Norte", "Camarines Sur", "Catanduanes", "Masbate", "Sorsogon",
  "Aklan", "Antique", "Capiz", "Guimaras", "Iloilo", "Negros Occidental",
  "Bohol", "Cebu", "Negros Oriental", "Siquijor",
  "Biliran", "Eastern Samar", "Leyte", "Northern Samar", "Samar", "Southern Leyte",
  "Zamboanga del Norte", "Zamboanga del Sur", "Zamboanga Sibugay",
  "Bukidnon", "Camiguin", "Lanao del Norte", "Misamis Occidental", "Misamis Oriental",
  "Davao de Oro", "Davao del Norte", "Davao del Sur", "Davao Occidental", "Davao Oriental",
  "Cotabato", "Sarangani", "South Cotabato", "Sultan Kudarat",
  "Agusan del Norte", "Agusan del Sur", "Dinagat Islands", "Surigao del Norte", "Surigao del Sur",
  "Basilan", "Lanao del Sur", "Maguindanao del Norte", "Maguindanao del Sur", "Sulu", "Tawi-Tawi",
  "Apayao", // ensure uniqueness okay
];

const citiesByProvince = {
  "Metro Manila (NCR)": [
    "Caloocan City", "Las Piñas City", "Makati City", "Malabon City", "Mandaluyong City",
    "Manila", "Marikina City", "Muntinlupa City", "Navotas City", "Parañaque City",
    "Pasay City", "Pasig City", "Quezon City", "San Juan City", "Taguig City",
    "Valenzuela City", "Pateros"
  ],
  "Bulacan": [
    "Angat", "Balagtas", "Baliuag", "Bocaue", "Bulakan", "Bustos", "Calumpit", "Doña Remedios Trinidad",
    "Guiguinto", "Hagonoy", "Malolos City", "Marilao", "Meycauayan City", "Norzagaray", "Obando",
    "Pandi", "Paombong", "Plaridel", "Pulilan", "San Ildefonso", "San Jose del Monte City",
    "San Miguel", "San Rafael", "Santa Maria"
  ],
  "Nueva Ecija": [
    "Aliaga", "Bongabon", "Cabanatuan City", "Cabiao", "Carranglan", "Cuyapo", "Gabaldon",
    "Gapan City", "General Mamerto Natividad", "General Tinio", "Guimba", "Jaen", "Laur",
    "Licab", "Llanera", "Lupao", "Muñoz City", "Nampicuan", "Palayan City", "Pantabangan",
    "Peñaranda", "Quezon", "Rizal", "San Antonio", "San Isidro", "San Jose City",
    "San Leonardo", "Santa Rosa", "Santo Domingo", "Talavera", "Talugtog", "Zaragoza"
  ],
  "Pampanga": [
    "Angeles City", "Apalit", "Arayat", "Bacolor", "Candaba", "City of San Fernando", "Floridablanca",
    "Guagua", "Lubao", "Mabalacat City", "Macabebe", "Magalang", "Masantol", "Mexico",
    "Minalin", "Porac", "San Luis", "San Simon", "Santa Ana", "Santo Tomas", "Sasmuan"
  ],
  "Cavite": [
    "Alfonso", "Amadeo", "Bacoor City", "Carmona", "Cavite City", "Dasmariñas City", "General Emilio Aguinaldo",
    "General Mariano Alvarez", "General Trias City", "Imus City", "Indang", "Kawit", "Magallanes",
    "Maragondon", "Mendez", "Naic", "Noveleta", "Rosario", "Silang", "Tagaytay City", "Tanza",
    "Ternate", "Trece Martires City"
  ],
  "Laguna": [
    "Alaminos", "Bay", "Biñan City", "Cabuyao City", "Calamba City", "Calauan", "Cavinti",
    "Famy", "Kalayaan", "Liliw", "Los Baños", "Luisiana", "Lumban", "Mabitac",
    "Magdalena", "Majayjay", "Nagcarlan", "Paete", "Pagsanjan", "Pakil", "Pangil", "Pila",
    "Rizal", "San Pablo City", "San Pedro City", "Santa Cruz", "Santa Maria", "Santa Rosa City",
    "Siniloan", "Victoria"
  ],
  "Batangas": [
    "Agoncillo", "Alitagtag", "Balayan", "Balete", "Batangas City", "Bauan", "Calaca", "Calatagan",
    "Cuenca", "Ibaan", "Laurel", "Lemery", "Lian", "Lipa City", "Lobo", "Mabini", "Malvar",
    "Mataasnakahoy", "Nasugbu", "Padre Garcia", "Rosario", "San Jose", "San Juan", "San Luis",
    "San Nicolas", "San Pascual", "Santa Teresita", "Santo Tomas City", "Taal", "Talisay",
    "Tanauan City", "Taysan", "Tingloy", "Tuy"
  ],
  "Quezon": [
    "Agdangan", "Alabat", "Atimonan", "Buenavista", "Burdeos", "Calauag", "Candelaria", "Catanauan",
    "Dolores", "General Luna", "General Nakar", "Guinayangan", "Gumaca", "Infanta", "Jomalig",
    "Lopez", "Lucban", "Lucena City", "Macalelon", "Mauban", "Mulanay", "Padre Burgos",
    "Pagbilao", "Panukulan", "Patnanungan", "Perez", "Pitogo", "Plaridel", "Polillo",
    "Quezon", "Real", "Sampaloc", "San Andres", "San Antonio", "San Francisco",
    "San Narciso", "Sariaya", "Tagkawayan", "Tayabas City", "Tiaong", "Unisan"
  ],
  "Rizal": [
    "Angono", "Antipolo City", "Baras", "Binangonan", "Cainta", "Cardona", "Jala-Jala", "Morong",
    "Pililla", "Rodriguez", "San Mateo", "Tanay", "Taytay", "Teresa"
  ],
  "Cebu": [
    "Alcantara", "Alcoy", "Alegria", "Aloguinsan", "Argao", "Asturias", "Badian", "Balamban",
    "Bantayan", "Barili", "Bogo City", "Boljoon", "Borbon", "Carcar City", "Carmen", "Catmon",
    "Cebu City", "Compostela", "Consolacion", "Cordova", "Daanbantayan", "Dalaguete", "Danao City",
    "Ginatilan", "Lapu-Lapu City", "Liloan", "Madaue City", "Malabuyoc", "Medellin", "Minglanilla",
    "Moalboal", "Naga City", "Oslob", "Pilar", "Pinamungajan", "Poro", "Ronda", "Samboan",
    "San Fernando", "San Francisco", "San Remigio", "Santa Fe", "Santander", "Sibonga", "Sogod",
    "Tabogon", "Tabuelan", "Toledo City", "Talisay City", "Tuburan"
  ],
  "Davao del Sur": [
    "Bansalan", "Davao City", "Digos City", "Hagonoy", "Kiblawan", "Magsaysay", "Malalag",
    "Matanao", "Padada", "Santa Cruz", "Sulop"
  ],
  "Iloilo": [
    "Ajuy", "Alimodian", "Anilao", "Badiangan", "Balasan", "Banate", "Barotac Nuevo", "Barotac Viejo",
    "Batad", "Bingawan", "Cabatuan", "Calinog", "Carles", "Concepcion", "Dingle", "Dueñas",
    "Dumangas", "Estancia", "Guimbal", "Igbaras", "Iloilo City", "Janiuay", "Lambunao",
    "Leganes", "Lemery", "Leon", "Maasin", "Miagao", "Mina", "New Lucena", "Oton", "Passi City",
    "Pavia", "Pototan", "San Dionisio", "San Enrique", "San Joaquin", "San Miguel",
    "San Rafael", "Santa Barbara", "Sara", "Tigbauan", "Tubungan", "Zarraga"
  ]
};

export default { provinces, citiesByProvince };


