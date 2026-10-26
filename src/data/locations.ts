export type LocalArea = {
  id: number;
  name: string;
};

export type StateLocation = {
  id: number;
  name: string;
  code: string;
  localAreas: LocalArea[];
};

export type CountryLocation = {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  subdivisionType: string;
  localAreaType: string;
  states: StateLocation[];
};

export const locations: CountryLocation[] = [
  {
    id: 1,
    name: "Nigeria",
    iso2: "NG",
    iso3: "NGA",
    subdivisionType: "State",
    localAreaType: "LGA",
    states: [
      {
        id: 1,
        name: "Lagos",
        code: "LA",
        localAreas: [
          { id: 1, name: "Agege" },
          { id: 2, name: "Alimosho" },
          { id: 3, name: "Ikeja" },
          { id: 4, name: "Mushin" },
          { id: 5, name: "Surulere" },
        ],
      },
    ],
  },
];
