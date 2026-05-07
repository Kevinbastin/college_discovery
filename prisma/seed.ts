import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const useSsl = !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1');
  const pool = new pg.Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

const prisma = createPrismaClient();

// Compact college data: [name, shortName, city, state, type, estYear, students, naac, fees, placePct, avgPkg, highPkg, rating, reviewCount, recruiters, courses, cutoffs]
const colleges: any[][] = [
// IITs (8)
["Indian Institute of Technology Bombay","IIT Bombay","Mumbai","Maharashtra","GOVERNMENT",1958,12000,"A++",250000,95,16.5,80.0,4.8,2100,["Google","Microsoft","Amazon","Goldman Sachs"],["B.Tech","M.Tech","PhD"],{JEE_ADVANCED:1000}],
["Indian Institute of Technology Delhi","IIT Delhi","New Delhi","Delhi","GOVERNMENT",1961,11500,"A++",240000,94,15.8,75.0,4.7,1950,["Google","Apple","Microsoft","McKinsey"],["B.Tech","M.Tech","MBA","PhD"],{JEE_ADVANCED:1200}],
["Indian Institute of Technology Madras","IIT Madras","Chennai","Tamil Nadu","GOVERNMENT",1959,11000,"A++",230000,93,14.5,70.0,4.7,1800,["Microsoft","Intel","Samsung","TCS"],["B.Tech","M.Tech","MS","PhD"],{JEE_ADVANCED:1500}],
["Indian Institute of Technology Kanpur","IIT Kanpur","Kanpur","Uttar Pradesh","GOVERNMENT",1959,10000,"A++",225000,91,13.2,65.0,4.6,1700,["Google","Qualcomm","Samsung","Adobe"],["B.Tech","M.Tech","PhD"],{JEE_ADVANCED:2000}],
["Indian Institute of Technology Kharagpur","IIT Kharagpur","Kharagpur","West Bengal","GOVERNMENT",1951,12500,"A++",220000,90,12.8,60.0,4.5,1650,["TCS","Infosys","Microsoft","Amazon"],["B.Tech","M.Tech","MBA","PhD"],{JEE_ADVANCED:2500}],
["Indian Institute of Technology Roorkee","IIT Roorkee","Roorkee","Uttarakhand","GOVERNMENT",1847,10500,"A++",215000,89,12.0,55.0,4.4,1500,["Google","Microsoft","Uber","Flipkart"],["B.Tech","M.Tech","PhD"],{JEE_ADVANCED:3000}],
["Indian Institute of Technology Guwahati","IIT Guwahati","Guwahati","Assam","GOVERNMENT",1994,7500,"A+",210000,88,11.5,50.0,4.3,1200,["Amazon","TCS","Flipkart","Oracle"],["B.Tech","M.Tech","PhD"],{JEE_ADVANCED:4000}],
["Indian Institute of Technology Hyderabad","IIT Hyderabad","Hyderabad","Telangana","GOVERNMENT",2008,4500,"A++",220000,87,11.0,48.0,4.3,900,["Google","Microsoft","Amazon","Qualcomm"],["B.Tech","M.Tech","PhD"],{JEE_ADVANCED:4500}],
// NITs (6)
["National Institute of Technology Tiruchirappalli","NIT Trichy","Tiruchirappalli","Tamil Nadu","GOVERNMENT",1964,8000,"A+",175000,88,9.5,42.0,4.3,1400,["TCS","Infosys","Cognizant","Wipro"],["B.Tech","M.Tech","PhD"],{JEE_MAIN:5000}],
["National Institute of Technology Karnataka","NIT Surathkal","Surathkal","Karnataka","GOVERNMENT",1960,7000,"A+",170000,86,9.0,38.0,4.2,1300,["Infosys","TCS","Intel","Samsung"],["B.Tech","M.Tech"],{JEE_MAIN:6000}],
["National Institute of Technology Warangal","NIT Warangal","Warangal","Telangana","GOVERNMENT",1959,7500,"A+",165000,85,8.8,36.0,4.2,1200,["TCS","Wipro","HCL","Amazon"],["B.Tech","M.Tech","PhD"],{JEE_MAIN:7000}],
["National Institute of Technology Calicut","NIT Calicut","Kozhikode","Kerala","GOVERNMENT",1961,6500,"A",160000,83,8.2,32.0,4.1,1100,["TCS","Infosys","UST Global","Oracle"],["B.Tech","M.Tech"],{JEE_MAIN:9000}],
["Motilal Nehru National Institute of Technology","MNNIT Allahabad","Prayagraj","Uttar Pradesh","GOVERNMENT",1961,6000,"A",155000,82,7.8,30.0,4.0,1000,["TCS","Infosys","Cognizant","Wipro"],["B.Tech","M.Tech"],{JEE_MAIN:11000}],
["Malaviya National Institute of Technology","MNIT Jaipur","Jaipur","Rajasthan","GOVERNMENT",1963,6500,"A",158000,81,7.5,28.0,4.0,950,["Infosys","TCS","HCL","L&T"],["B.Tech","M.Tech"],{JEE_MAIN:12000}],
// IIMs (4)
["Indian Institute of Management Ahmedabad","IIM Ahmedabad","Ahmedabad","Gujarat","GOVERNMENT",1961,1200,"A++",2300000,99,28.0,120.0,4.9,800,["McKinsey","BCG","Bain","Goldman Sachs"],["MBA","PhD"],{CAT:99}],
["Indian Institute of Management Bangalore","IIM Bangalore","Bangalore","Karnataka","GOVERNMENT",1973,1400,"A++",2350000,98,27.5,110.0,4.8,750,["Amazon","Google","McKinsey","Deloitte"],["MBA","PhD"],{CAT:98}],
["Indian Institute of Management Calcutta","IIM Calcutta","Kolkata","West Bengal","GOVERNMENT",1961,1100,"A++",2200000,97,26.0,100.0,4.8,700,["BCG","JP Morgan","Goldman Sachs","Accenture"],["MBA","PhD"],{CAT:97}],
["Indian Institute of Management Lucknow","IIM Lucknow","Lucknow","Uttar Pradesh","GOVERNMENT",1984,900,"A+",1950000,96,24.0,90.0,4.6,650,["Deloitte","EY","KPMG","Amazon"],["MBA","PhD"],{CAT:95}],
// Private Engineering (6)
["Vellore Institute of Technology","VIT Vellore","Vellore","Tamil Nadu","PRIVATE",1984,35000,"A++",195000,80,7.0,42.0,4.2,3500,["TCS","Cognizant","Wipro","Amazon"],["B.Tech","M.Tech","MBA"],{JEE_MAIN:25000}],
["SRM Institute of Science and Technology","SRM Chennai","Chennai","Tamil Nadu","PRIVATE",1985,30000,"A++",250000,78,6.5,35.0,4.1,3200,["Cognizant","TCS","Infosys","Wipro"],["B.Tech","M.Tech","MBA","MBBS"],{JEE_MAIN:30000}],
["Manipal Institute of Technology","MIT Manipal","Manipal","Karnataka","PRIVATE",1957,12000,"A++",400000,82,7.5,38.0,4.2,2800,["Goldman Sachs","JP Morgan","Amazon","TCS"],["B.Tech","M.Tech"],{JEE_MAIN:20000}],
["BITS Pilani","BITS Pilani","Pilani","Rajasthan","PRIVATE",1964,5000,"A",380000,90,11.0,55.0,4.5,2000,["Google","Microsoft","Goldman Sachs","Uber"],["B.E","M.E","PhD"],{JEE_MAIN:15000}],
["Amity University","Amity Noida","Noida","Uttar Pradesh","PRIVATE",2005,25000,"A+",300000,65,5.0,20.0,3.6,2500,["TCS","Wipro","Infosys","HCL"],["B.Tech","MBA","BBA","LLB"],{JEE_MAIN:50000}],
["Lovely Professional University","LPU Jalandhar","Jalandhar","Punjab","PRIVATE",2005,40000,"A+",180000,60,4.5,18.0,3.5,4000,["TCS","Infosys","Wipro","Cognizant"],["B.Tech","MBA","BBA","B.Sc"],{JEE_MAIN:60000}],
// Private Management (4)
["Indian School of Business","ISB Hyderabad","Hyderabad","Telangana","PRIVATE",2001,900,"A++",3500000,98,28.0,100.0,4.7,600,["McKinsey","BCG","Amazon","Google"],["MBA"],{CAT:97}],
["XLRI Jamshedpur","XLRI","Jamshedpur","Jharkhand","PRIVATE",1949,800,"A+",2500000,95,24.0,80.0,4.5,550,["Deloitte","EY","KPMG","Accenture"],["MBA"],{CAT:96}],
["Management Development Institute","MDI Gurgaon","Gurgaon","Haryana","PRIVATE",1973,700,"A",2000000,92,20.0,60.0,4.3,500,["Deloitte","Cognizant","Wipro","Amazon"],["MBA"],{CAT:93}],
["MICA Ahmedabad","MICA","Ahmedabad","Gujarat","PRIVATE",1991,500,"A",1800000,90,18.0,50.0,4.2,400,["Ogilvy","JWT","Google","Amazon"],["MBA"],{CAT:90}],
// State Universities (6)
["Anna University","Anna Univ","Chennai","Tamil Nadu","GOVERNMENT",1978,8000,"A+",50000,75,5.5,25.0,4.0,2000,["TCS","Infosys","Cognizant","Wipro"],["B.Tech","M.Tech","MBA","PhD"],{JEE_MAIN:40000}],
["University of Mumbai","Mumbai Univ","Mumbai","Maharashtra","GOVERNMENT",1857,5000,"A+",35000,70,5.0,22.0,3.9,1800,["TCS","Reliance","L&T","Infosys"],["B.Sc","M.Sc","MBA","LLB"],{}],
["University of Delhi","DU","New Delhi","Delhi","GOVERNMENT",1922,6000,"A+",25000,72,5.2,20.0,4.1,2500,["Deloitte","EY","KPMG","HUL"],["B.A","B.Com","B.Sc","MBA","LLB"],{}],
["Savitribai Phule Pune University","SPPU","Pune","Maharashtra","GOVERNMENT",1949,5500,"A+",40000,68,4.8,18.0,3.8,1500,["TCS","Infosys","Wipro","Persistent"],["B.Tech","B.Sc","MBA","LLB"],{JEE_MAIN:45000}],
["Jadavpur University","JU Kolkata","Kolkata","West Bengal","GOVERNMENT",1955,7000,"A","30000",78,6.5,28.0,4.2,1200,["TCS","Cognizant","Wipro","Amazon"],["B.Tech","M.Tech","B.Sc","PhD"],{JEE_MAIN:35000}],
["Osmania University","OU","Hyderabad","Telangana","GOVERNMENT",1918,4500,"A",28000,65,4.5,15.0,3.7,1100,["TCS","Infosys","Wipro","Tech Mahindra"],["B.Tech","B.Sc","MBA","LLB"],{JEE_MAIN:50000}],
// Private Deemed (8)
["Birla Institute of Technology Mesra","BIT Mesra","Ranchi","Jharkhand","PRIVATE",1955,6000,"A",250000,80,7.0,30.0,4.0,900,["TCS","Infosys","Wipro","Amazon"],["B.Tech","M.Tech","MBA"],{JEE_MAIN:28000}],
["Thapar Institute of Engineering","Thapar","Patiala","Punjab","PRIVATE",1956,7000,"A",320000,82,7.5,32.0,4.1,1100,["Microsoft","Amazon","TCS","Flipkart"],["B.Tech","M.Tech","MBA"],{JEE_MAIN:22000}],
["PSG College of Technology","PSG Tech","Coimbatore","Tamil Nadu","PRIVATE",1951,5000,"A+",120000,85,6.8,28.0,4.2,1000,["Zoho","TCS","Infosys","Cognizant"],["B.Tech","M.Tech"],{JEE_MAIN:18000}],
["Symbiosis International University","SIU Pune","Pune","Maharashtra","PRIVATE",2002,8000,"A+",350000,78,8.5,35.0,4.0,1400,["Deloitte","KPMG","EY","Amazon"],["BBA","MBA","LLB","B.Sc"],{CAT:85}],
["KIIT University","KIIT","Bhubaneswar","Odisha","PRIVATE",1997,27000,"A++",250000,75,6.0,25.0,3.9,2200,["TCS","Infosys","Wipro","Cognizant"],["B.Tech","MBA","BBA","LLB"],{JEE_MAIN:35000}],
["Shiv Nadar University","SNU","Greater Noida","Uttar Pradesh","PRIVATE",2011,4000,"A",450000,80,8.0,35.0,4.0,600,["Google","Microsoft","Goldman Sachs","Amazon"],["B.Tech","B.Sc","MBA"],{JEE_MAIN:20000}],
["Chandigarh University","CU","Mohali","Punjab","PRIVATE",2012,30000,"A+",200000,72,5.5,22.0,3.8,2800,["TCS","Infosys","Wipro","HCL"],["B.Tech","MBA","BBA","B.Sc"],{JEE_MAIN:40000}],
["Kalinga Institute of Industrial Technology","KIIT DU","Bhubaneswar","Odisha","PRIVATE",1992,10000,"A",220000,74,5.8,24.0,3.8,1500,["TCS","Infosys","Cognizant","Wipro"],["B.Tech","M.Tech","MBA"],{JEE_MAIN:38000}],
// Medical (6)
["All India Institute of Medical Sciences","AIIMS Delhi","New Delhi","Delhi","GOVERNMENT",1956,3000,"A++",8000,98,12.0,25.0,4.9,1500,["AIIMS","Apollo","Fortis","Max Healthcare"],["MBBS","MD","MS","PhD"],{NEET:100}],
["Christian Medical College","CMC Vellore","Vellore","Tamil Nadu","GOVERNMENT",1900,2500,"A++",30000,96,10.0,20.0,4.7,1200,["CMC Hospital","Apollo","Fortis"],["MBBS","MD","MS"],{NEET:500}],
["Armed Forces Medical College","AFMC Pune","Pune","Maharashtra","GOVERNMENT",1948,1500,"A+",50000,95,10.0,20.0,4.6,800,["Military Hospitals","AIIMS","Apollo"],["MBBS","MD"],{NEET:800}],
["Kasturba Medical College","KMC Manipal","Manipal","Karnataka","PRIVATE",1953,3000,"A+",900000,90,8.0,18.0,4.3,1000,["Manipal Hospitals","Apollo","Fortis"],["MBBS","MD","MS"],{NEET:5000}],
["Maulana Azad Medical College","MAMC Delhi","New Delhi","Delhi","GOVERNMENT",1958,2000,"A+",15000,94,10.0,20.0,4.5,900,["AIIMS","Safdarjung","RML Hospital"],["MBBS","MD","MS"],{NEET:200}],
["St Johns Medical College","SJMC Bangalore","Bangalore","Karnataka","PRIVATE",1963,1800,"A",650000,88,7.5,15.0,4.2,700,["St Johns Hospital","Apollo","Manipal"],["MBBS","MD"],{NEET:3000}],
// Law/Arts/Commerce (6)
["National Law School of India University","NLSIU","Bangalore","Karnataka","GOVERNMENT",1987,800,"A++",250000,95,15.0,45.0,4.7,500,["AZB","Trilegal","Cyril Amarchand","Khaitan"],["LLB","LLM"],{}],
["Symbiosis Law School","SLS Pune","Pune","Maharashtra","PRIVATE",1977,2000,"A+",350000,82,8.0,25.0,4.1,800,["AZB","Trilegal","Shardul","EY"],["LLB","LLM"],{}],
["Shri Ram College of Commerce","SRCC Delhi","New Delhi","Delhi","GOVERNMENT",1926,3000,"A++",20000,88,10.0,35.0,4.6,1500,["Deloitte","EY","KPMG","Goldman Sachs"],["B.Com","M.Com"],{}],
["Loyola College","Loyola Chennai","Chennai","Tamil Nadu","PRIVATE",1925,6000,"A++",35000,75,5.0,18.0,4.3,1200,["TCS","Infosys","Deloitte","HDFC"],["B.A","B.Sc","B.Com","MBA"],{}],
["St Xaviers College","St Xaviers","Mumbai","Maharashtra","PRIVATE",1869,4000,"A++",30000,78,5.5,20.0,4.4,1100,["JP Morgan","Deloitte","EY","HDFC"],["B.A","B.Sc","B.Com","MBA"],{}],
["Fergusson College","Fergusson","Pune","Maharashtra","GOVERNMENT",1885,5000,"A",15000,65,4.0,12.0,3.9,800,["TCS","Infosys","Wipro","Persistent"],["B.A","B.Sc","M.Sc"],{}],
// Newer Private (6)
["Bennett University","Bennett","Greater Noida","Uttar Pradesh","PRIVATE",2016,3000,"B++",350000,70,5.5,20.0,3.6,400,["Times Group","TCS","Wipro","Cognizant"],["B.Tech","BBA","MBA"],{JEE_MAIN:55000}],
["Ashoka University","Ashoka","Sonipat","Haryana","PRIVATE",2014,2500,"A",500000,75,7.0,25.0,4.0,350,["McKinsey","BCG","Goldman Sachs","Google"],["B.A","B.Sc","M.A","PhD"],{}],
["Plaksha University","Plaksha","Mohali","Punjab","PRIVATE",2021,500,"B+",600000,72,8.0,30.0,3.5,100,["Google","Microsoft","Amazon","Flipkart"],["B.Tech"],{JEE_MAIN:45000}],
["Flame University","FLAME","Pune","Maharashtra","PRIVATE",2015,2000,"A",400000,68,5.0,18.0,3.4,300,["Deloitte","EY","KPMG","Wipro"],["BBA","MBA","B.A"],{CAT:75}],
["Woxsen University","Woxsen","Hyderabad","Telangana","PRIVATE",2014,3000,"A",450000,70,6.0,22.0,3.6,350,["Deloitte","Amazon","EY","Accenture"],["BBA","MBA","B.Tech"],{CAT:78}],
["Sai University","Sai Univ","Chennai","Tamil Nadu","PRIVATE",2020,800,"B++",300000,60,4.5,15.0,3.2,100,["TCS","Infosys","Zoho","Wipro"],["B.Tech","B.Sc"],{JEE_MAIN:65000}],
];

function buildCollege(d: any[]) {
  const [name, shortName, city, state, type, est, students, naac, fees, placePct, avgPkg, highPkg, rating, count, recruiters, courses, cutoffs] = d;
  
  const about = `${name} (${shortName}), established in ${est}, is located in ${city}, ${state}. A prestigious ${type.toLowerCase()} institution known for academic excellence and research contributions. With over ${students.toLocaleString()} students, it offers a vibrant campus life and top-tier infrastructure. The institution has consistently maintained a high NAAC grade of ${naac}, reflecting its commitment to quality education.`;

  const description = `${shortName} is one of India's top ${type === 'GOVERNMENT' ? 'public' : 'private'} institutions. It is renowned for its ${courses.slice(0, 2).join(' and ')} programs. In ${est}, it started its journey and has since become a hub for innovation. The campus in ${city} provides excellent industry exposure, leading to an impressive ${placePct}% placement rate with average packages around ${avgPkg} LPA and reaching up to ${highPkg} LPA. Top recruiters include ${recruiters.slice(0, 3).join(', ')}, and many more global leaders.`;

  return {
    name, shortName, city, state, type, establishedYear: est, totalStudents: students,
    naacGrade: naac, annualFees: typeof fees === 'string' ? parseInt(fees) : fees,
    placementPct: placePct, avgPackage: avgPkg,
    highestPackage: highPkg, rating, reviewCount: count, topRecruiters: recruiters,
    courses, cutoffRanks: cutoffs, about, description, website: `https://www.${shortName.toLowerCase().replace(/\s/g, '')}.edu.in`,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`, email: `admissions@${shortName.toLowerCase().replace(/\s/g, '')}.ac.in`
  };
}

async function main() {
  console.log('Seeding database with 60 colleges...');
  for (const c of colleges) {
    await prisma.college.create({ data: buildCollege(c) });
  }
  console.log(`Seeded ${colleges.length} colleges successfully!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
