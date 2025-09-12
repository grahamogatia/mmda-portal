export type Location = {
  id: number;
  name: string;
  address: string;
  code: string; // Added code attribute
};

export const locations: Location[] = [
  {
    id: 1,
    name: "Buendia NB",
    address: "EDSA, AH26 Makati City, North Bound",
    code: "BUENDIA_NB",
  },
  {
    id: 2,
    name: "Buendia SB",
    address: "EDSA, AH26 Makati City, South Bound",
    code: "BUENDIA_SB",
  },
  {
    id: 3,
    name: "Hiway 54",
    address: "EDSA Near Megamall, Mandaluyong City North Bound",
    code: "HIWAY_54",
  },
  {
    id: 4,
    name: "Guadix",
    address: "EDSA, Near Megamall, Mandaluyong City South Bound",
    code: "GUADIX",
  },
  {
    id: 5,
    name: "Quezon Ave North Bound",
    address: "EDSA, Quezon Ave, Quezon City North Bound",
    code: "QUEZON_AVE_NB",
  },
  {
    id: 6,
    name: "Quezon Ave South Bound",
    address: "EDSA, Quezon Ave, Quezon City South Bound",
    code: "QUEZON_AVE_SB",
  },
  {
    id: 7,
    name: "Main Ave North Bound",
    address: "EDSA, Main Ave, Quezon City North Bound",
    code: "MAIN_AVE_NB",
  },
  {
    id: 8,
    name: "Main Ave South Bound",
    address: "EDSA, Main Ave. Quezon City South Bound",
    code: "MAIN_AVE_SB",
  },
  {
    id: 9,
    name: "Muñoz",
    address: "EDSA, Muñoz, Quezon City",
    code: "MUNOZ",
  },
];
