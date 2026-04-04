/** Browser-oriented fake data helpers; call from client components only (uses crypto). */

export type StandardField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "company"
  | "jobTitle"
  | "street"
  | "city"
  | "state"
  | "zipCode"
  | "country";

const FIRST_NAMES = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
  "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph",
  "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Lisa",
  "Daniel", "Nancy", "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra",
  "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna",
  "Joshua", "Michelle", "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Melissa",
  "George", "Deborah", "Edward", "Stephanie", "Ronald", "Rebecca", "Timothy",
  "Laura", "Jason", "Helen", "Jeffrey", "Sharon", "Ryan", "Cynthia", "Jacob",
  "Kathleen", "Gary", "Amy", "Nicholas", "Shirley", "Eric", "Angela", "Jonathan",
  "Anna", "Stephen", "Brenda", "Larry", "Pamela", "Justin", "Nicole", "Scott",
  "Emma", "Brandon", "Samantha", "Benjamin", "Katherine", "Samuel", "Christine",
  "Frank", "Debra", "Gregory", "Rachel", "Raymond", "Catherine", "Alexander",
  "Carolyn", "Patrick", "Janet", "Jack", "Ruth", "Dennis", "Maria", "Jerry",
  "Heather",
] as const;

const LAST_NAMES = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
  "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
  "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
  "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
  "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
  "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
  "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner",
  "Diaz", "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris",
  "Morales", "Murphy", "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper",
  "Peterson", "Bailey", "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox",
  "Ward", "Richardson", "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett",
  "Gray", "Mendoza", "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders",
  "Patel", "Myers", "Long", "Ross", "Foster", "Jimenez", "Powell", "Jenkins",
] as const;

const EMAIL_DOMAINS = [
  "example.com", "mail.test", "demo.io", "sample.dev", "fixture.app",
  "lorem.net", "acme.test", "sandbox.local",
] as const;

const STREET_NAMES = [
  "Maple", "Oak", "Cedar", "Pine", "Elm", "Washington", "Lake", "Hill",
  "Park", "Main", "Broadway", "Sunset", "River", "Highland", "Forest", "Bay",
  "Market", "Church", "Union", "Franklin", "Lincoln", "Jefferson", "Madison",
  "Jackson", "Adams", "Monroe", "Harrison", "Taylor", "Grant", "Tyler",
] as const;

const STREET_SUFFIXES = [
  "St", "Ave", "Rd", "Blvd", "Dr", "Ln", "Way", "Ct", "Pl", "Ter",
] as const;

const CITIES = [
  "Austin", "Seattle", "Denver", "Portland", "Chicago", "Phoenix", "Dallas",
  "Atlanta", "Boston", "Miami", "Nashville", "Minneapolis", "Detroit",
  "Philadelphia", "San Diego", "San Jose", "Columbus", "Charlotte", "Indianapolis",
  "San Francisco", "Fort Worth", "Jacksonville", "Memphis", "Baltimore", "Milwaukee",
  "Albuquerque", "Tucson", "Fresno", "Sacramento", "Kansas City", "Mesa",
  "Omaha", "Raleigh", "Long Beach", "Virginia Beach", "Oakland", "Tampa",
] as const;

const STATES = [
  { abbr: "AL", name: "Alabama" }, { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" }, { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" }, { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" }, { abbr: "DE", name: "Delaware" },
  { abbr: "FL", name: "Florida" }, { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" }, { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" }, { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" }, { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" }, { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" }, { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" }, { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" }, { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" }, { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" }, { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" }, { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" }, { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" }, { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" }, { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" }, { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" }, { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" }, { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" }, { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" }, { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" }, { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" }, { abbr: "WY", name: "Wyoming" },
] as const;

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "Australia",
  "Japan", "India", "Brazil", "Mexico", "Netherlands", "Sweden", "Spain", "Italy",
] as const;

const COMPANIES = [
  "Northwind Labs", "Acme Robotics", "Blue Harbor Software", "Cedar Analytics",
  "Delta Stream Systems", "Evergreen Cloud", "Falcon Data Co.", "Granite Peak IT",
  "Harbor Light Media", "Ironwood Security", "Juniper Health Tech", "Kestrel AI",
  "Lumen Grid", "Maritime DevOps", "Nova Forge", "Obsidian Tools", "Prairie Stack",
  "Quartz Commerce", "Redwood SaaS", "Silverline APIs", "Tundra Networks",
  "Upland Studio", "Vertex Logistics", "Willow Payments", "Zephyr Games",
] as const;

const JOB_TITLES = [
  "Software Engineer", "Product Manager", "UX Designer", "Data Analyst",
  "DevOps Engineer", "QA Engineer", "Technical Writer", "Solutions Architect",
  "Engineering Manager", "Frontend Developer", "Backend Developer", "SRE",
  "Security Engineer", "ML Engineer", "Customer Success Manager",
] as const;

function pick<T>(arr: readonly T[], rng: () => number): T {
  const i = Math.floor(rng() * arr.length);
  return arr[Math.min(i, arr.length - 1)]!;
}

function digits(rng: () => number, n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += String(Math.floor(rng() * 10));
  return s;
}

function slugPart(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 12) || "user";
}

export function createBrowserRng(): () => number {
  return () => {
    const u = new Uint32Array(1);
    crypto.getRandomValues(u);
    return u[0]! / 2 ** 32;
  };
}

export function generateOneRow(
  fields: StandardField[],
  rng: () => number,
): Record<string, string> {
  const row: Record<string, string> = {};
  const needName =
    fields.includes("firstName") ||
    fields.includes("lastName") ||
    fields.includes("email");

  const fn = needName ? pick(FIRST_NAMES, rng) : "";
  const ln = needName ? pick(LAST_NAMES, rng) : "";

  for (const f of fields) {
    switch (f) {
      case "firstName":
        row.firstName = fn;
        break;
      case "lastName":
        row.lastName = ln;
        break;
      case "email": {
        const dom = pick(EMAIL_DOMAINS, rng);
        const n = digits(rng, 2);
        row.email = `${slugPart(fn)}.${slugPart(ln)}${n}@${dom}`;
        break;
      }
      case "phone":
        row.phone = `+1 (${digits(rng, 3)}) ${digits(rng, 3)}-${digits(rng, 4)}`;
        break;
      case "company":
        row.company = pick(COMPANIES, rng);
        break;
      case "jobTitle":
        row.jobTitle = pick(JOB_TITLES, rng);
        break;
      case "street": {
        const num = 100 + Math.floor(rng() * 9900);
        row.street = `${num} ${pick(STREET_NAMES, rng)} ${pick(STREET_SUFFIXES, rng)}`;
        break;
      }
      case "city":
        row.city = pick(CITIES, rng);
        break;
      case "state": {
        const st = pick(STATES, rng);
        row.state = st.abbr;
        break;
      }
      case "zipCode": {
        const base = digits(rng, 5);
        row.zipCode = rng() > 0.5 ? `${base}-${digits(rng, 4)}` : base;
        break;
      }
      case "country":
        row.country = pick(COUNTRIES, rng);
        break;
      default:
        break;
    }
  }
  return row;
}

/** Heuristic value for arbitrary column headers (fixtures, schema-driven tests). */
export function valueForCustomColumn(header: string, rng: () => number): string {
  const h = header.trim();
  if (!h) return `field_${digits(rng, 4)}`;

  if (/e\s*-?\s*mail|email|^mail$/i.test(h)) {
    const fn = pick(FIRST_NAMES, rng);
    const ln = pick(LAST_NAMES, rng);
    return `${slugPart(fn)}.${slugPart(ln)}${digits(rng, 2)}@${pick(EMAIL_DOMAINS, rng)}`;
  }
  if (/phone|mobile|tel|cell/i.test(h))
    return `+1 (${digits(rng, 3)}) ${digits(rng, 3)}-${digits(rng, 4)}`;
  if (/first\s*name|given|forename/i.test(h)) return pick(FIRST_NAMES, rng);
  if (/last\s*name|surname|family/i.test(h)) return pick(LAST_NAMES, rng);
  if (/full\s*name|name/i.test(h) && !/user|file/i.test(h))
    return `${pick(FIRST_NAMES, rng)} ${pick(LAST_NAMES, rng)}`;
  if (/street|address\s*1|addr1|line1/i.test(h)) {
    const num = 100 + Math.floor(rng() * 9900);
    return `${num} ${pick(STREET_NAMES, rng)} ${pick(STREET_SUFFIXES, rng)}`;
  }
  if (/city|town/i.test(h)) return pick(CITIES, rng);
  if (/state|province|region/i.test(h)) return pick(STATES, rng).abbr;
  if (/zip|postal/i.test(h))
    return rng() > 0.5 ? `${digits(rng, 5)}-${digits(rng, 4)}` : digits(rng, 5);
  if (/country|nation/i.test(h)) return pick(COUNTRIES, rng);
  if (/company|organization|employer|org/i.test(h)) return pick(COMPANIES, rng);
  if (/title|role|position|job/i.test(h)) return pick(JOB_TITLES, rng);
  if (/id|uuid|key/i.test(h)) {
    const hex = "0123456789abcdef";
    let s = "";
    for (let i = 0; i < 8; i++) s += hex[Math.floor(rng() * 16)]!;
    return `id_${s}`;
  }
  if (/url|uri|link|website/i.test(h))
    return `https://${slugPart(pick(STREET_NAMES, rng))}.example.test/path`;

  const words = ["alpha", "beta", "gamma", "delta", "omega", "sigma"];
  return `${pick(words, rng)}_${digits(rng, 3)}_${pick(words, rng)}`;
}

export function parseColumnNamesFromUpload(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  if (lines.length === 1) {
    return lines[0]!
      .split(",")
      .map((c) => c.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return lines.slice(0, 80);
}

export function generateCustomRow(
  columns: string[],
  rng: () => number,
): Record<string, string> {
  const row: Record<string, string> = {};
  for (const col of columns) {
    row[col] = valueForCustomColumn(col, rng);
  }
  return row;
}

export function mergeRows(
  standard: Record<string, string>,
  custom: Record<string, string>,
): Record<string, string> {
  return { ...standard, ...custom };
}

export function rowsToCsv(rows: Record<string, string>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]!);
  const esc = (v: string) => {
    if (/[",\r\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
    return v;
  };
  const lines = [
    headers.map(esc).join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h] ?? "")).join(",")),
  ];
  return lines.join("\n") + "\n";
}

export const STANDARD_FIELD_LABELS: Record<StandardField, string> = {
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  jobTitle: "Job title",
  street: "Street address",
  city: "City",
  state: "State (US abbr.)",
  zipCode: "ZIP / postal",
  country: "Country",
};

export const ALL_STANDARD_FIELDS: StandardField[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "company",
  "jobTitle",
  "street",
  "city",
  "state",
  "zipCode",
  "country",
];
