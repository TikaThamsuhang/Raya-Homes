const propertiesData = [
  {
    id: "prop-1",
    price: "$8,500,000",
    address: "125 Park Avenue, Manhattan, NY 10022",
    beds: 8,
    baths: 10,
    sqft: "12,000",
    type: "Condo",
    status: "For Sale",
    image: "imgs/Properties/prop-1.png",
    images: [
      "imgs/Properties/prop-1.png",
      "imgs/Properties/prop-2.png",
      "imgs/Properties/prop-3.png",
    ],
  },
  {
    id: "prop-2",
    price: "$1,450,000",
    address: "892 Willow Creek, Manhattan, NY 10001",
    beds: 5,
    baths: 4,
    sqft: "4,200",
    type: "Co-op",
    status: "For Sale",
    image: "imgs/Properties/prop-3.png",
    images: [
      "imgs/Properties/prop-3.png",
      "imgs/Properties/prop-1.png",
      "imgs/Properties/prop-2.png",
    ],
  },
  {
    id: "prop-3",
    price: "$120,000",
    address: "722 Denburn Place, Raleigh, NC 27603",
    beds: 4,
    baths: 3,
    sqft: "2,350",
    type: "Single Family",
    status: "For Sale",
    image: "imgs/Properties/prop-2.png",
    images: [
      "imgs/Properties/prop-2.png",
      "imgs/Properties/prop-3.png",
      "imgs/Properties/prop-1.png",
    ],
  },
  {
    id: "prop-4",
    price: "$3,250,000",
    address: "450 Alton Road, Miami Beach, FL 33139",
    beds: 3,
    baths: 3.5,
    sqft: "2,800",
    type: "Penthouse",
    status: "Coming Soon",
    image: "imgs/Properties/prop-4.jpg",
    images: [
      "imgs/Properties/prop-4.jpg",
      "imgs/Properties/prop-5.jpg",
      "imgs/Properties/prop-6.webp",
    ],
  },
];

// Attach to window for global access in this static setup
window.propertiesData = propertiesData;
