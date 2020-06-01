
export const YEAR_OF_BIRTH_OPTIONS = (() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  let startYear = currentYear - 120;
  while (startYear < currentYear) {
    startYear += 1;

    years.push({ value: startYear, label: startYear });
  }
  return years.reverse();
})();

export const EDUCATION_LEVELS = [
  '',
  'p',
  'm',
  'b',
  'a',
  'hs',
  'jhs',
  'el',
  'none',
  'o',
];

export const GENDER_OPTIONS = [
  '',
  'f',
  'm',
  'o',
];

export const COUNTRY_WITH_STATES = 'US';

export const TRANSIFEX_LANGUAGE_BASE_URL = 'https://www.transifex.com/open-edx/edx-platform/language/';

const COUNTRY_STATES_MAP = {
  CA: [
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NT', label: 'Northwest Territories' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Prince Edward Island' },
    { value: 'QC', label: 'Québec' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'YT', label: 'Yukon' },
  ],
  US: [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'AA', label: 'Armed Forces Americas' },
    { value: 'AE', label: 'Armed Forces Europe' },
    { value: 'AP', label: 'Armed Forces Pacific' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'DC', label: 'District Of Columbia' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' },
  ],
};

export function getStatesList(country) {
  return country && COUNTRY_STATES_MAP[country.toUpperCase()];
}

// TODO: Need the real values from Justin’s work
export const DEMOGRAPHICS_GENDER_OPTIONS = [
  '',
  'w',
  'm',
  'nb',
  'sd',
];

export const DEMOGRAPHICS_ETHNICITY_OPTIONS = [
  '',
  'american-indian-or-alaska-native',
  'asian',
  'black-or-african-american',
  'hispanic-latin-spanish',
  'middle-eastern-or-north-african',
  'native-hawaiian-or-pacific-islander',
  'white',
  'other',
];

export const DEMOGRAPHICS_INCOME_OPTIONS = [
  '',
  'less-than-10k',
  '10k-25k',
  '25k-50k',
  '50k-75k',
  'over-100k',
  'unsure',
]

export const DEMOGRAPHICS_MILITARY_HISTORY_OPTIONS = [
  '',
  'never-served',
  'training',
  'active',
  'previously-active',
]

export const DEMOGRAPHICS_EDUCATION_LEVEL_OPTIONS = [
  '',
  'no-high-school',
  'some-high-school',
  'high-school-ged-equivalent',
  'some-college',
  'associates',
  'bachelors',
  'masters',
  'professional',
  'doctorate',
]

export const DEMOGRAPHICS_WORK_STATUS_OPTIONS = [
  '',
  'full-time',
  'part-time',
  'not-employed-looking',
  'not-employed-not-looking',
  'unable',
  'retired',
  'other',
]

export const DEMOGRAPHICS_WORK_SECTOR_OPTIONS = [
  '',
  'accommodation-food',
  'administrative-support-waste-remediation',
  'agriculture-forestry-fishing-hunting',
  'arts-entertainment-recreation',
  'construction',
  'educational',
  'finance-insurance',
  'healthcare-social',
  'information',
  'management',
  'manufacturing',
  'mining-quarry-oil-gas',
  'professional-scientific-technical',
  'public-admin',
  'real-estate',
  'retail',
  'transport-warehousing',
  'utilities',
  'trade',
  'other',
]
