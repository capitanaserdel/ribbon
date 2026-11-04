const SARCData = [
  {
    state: 'Kano',
    sarcCenters: [
      {
        name: 'Waraka SARC, Murtala Muhammad Specialist Hospital',
        address: 'Murtala Muhammad Specialist Hospital, Kofar Nassarawa, Kano Municipal, Kano',
        phone: '08031234567, 08000-RIBBONS'
      },
      {
        name: 'Sir Sunusi SARC, Sir Muhammadu Sunusi Specialist Hospital',
        address: 'Sir Muhammadu Sunusi Specialist Hospital, Yan Kaba, Hadejia Road, Nassarawa, Kano',
        phone: '08039876543'
      },
      {
        name: 'Wudil General Hospital SARC',
        address: 'Wudil General Hospital, Maiduguri Road, Wudil LGA, Kano State',
        phone: '08021114455'
      }
    ]
  },
  {
    state: 'Kaduna',
    sarcCenters: [
      {
        name: 'Salama SARC, Barau Dikko Teaching Hospital',
        address: 'Barau Dikko Teaching Hospital, Lafia Road, Kaduna North, Kaduna',
        phone: '08029876543, 08037035544'
      },
      {
        name: 'Salama SARC, Yusuf Dantsoho Memorial Hospital',
        address: 'Yusuf Dantsoho Memorial Hospital, Tudun Wada, Kaduna South, Kaduna',
        phone: '08021112233'
      },
      {
        name: 'Salama SARC, Hajiya Gambo Sawaba Hospital',
        address: 'Hajiya Gambo Sawaba General Hospital, Kofan Gayan, Zaria, Kaduna',
        phone: '08036001234'
      },
      {
        name: 'Salama SARC, Sir Patrick Ibrahim Yakowa Hospital',
        address: 'Sir Patrick Ibrahim Yakowa Memorial Hospital, Kafanchan, Jema\'a LGA, Kaduna',
        phone: '08051239876'
      }
    ]
  },
  {
    state: 'Federal Capital Territory (Abuja)',
    sarcCenters: [
      {
        name: 'Bwari SARC, Bwari General Hospital',
        address: 'Bwari General Hospital, Bwari Town, FCT Abuja',
        phone: '08092222245, 08031122334'
      },
      {
        name: 'National Hospital Abuja Trauma SARC',
        address: 'Plot 132, Central Business District, Garki, Abuja FCT',
        phone: '08031230000, 112'
      },
      {
        name: 'Gwarinpa General Hospital Crisis Unit',
        address: '3rd Avenue, Gwarinpa Estate, Abuja FCT',
        phone: '08039870011'
      }
    ]
  },
  {
    state: 'Lagos',
    sarcCenters: [
      {
        name: 'Mirabel Centre SARC, LASUTH',
        address: 'Lagos State University Teaching Hospital (LASUTH), 1-5 Oba Akinjobi Way, Ikeja, Lagos',
        phone: '08187215396, 08155770000'
      },
      {
        name: 'Alimosho General Hospital SARC',
        address: 'Alimosho General Hospital, Lasu-Iba Expressway, Igando, Alimosho, Lagos',
        phone: '08033221100'
      },
      {
        name: 'Ikorodu General Hospital SARC',
        address: 'Ikorodu General Hospital, T.O.S Benson Road, Ikorodu, Lagos',
        phone: '08023456789'
      }
    ]
  },
  {
    state: 'Jigawa',
    sarcCenters: [
      {
        name: 'Dutse General Hospital SARC',
        address: 'Dutse General Hospital, Kiyawa Road, Dutse, Jigawa State',
        phone: '08065554433'
      },
      {
        name: 'Hadejia SARC',
        address: 'Hadejia General Hospital, Hadejia LGA, Jigawa State',
        phone: '08034441122'
      }
    ]
  },
  {
    state: 'Katsina',
    sarcCenters: [
      {
        name: 'Katsina General Hospital SARC',
        address: 'General Hospital Katsina, IBB Way, Katsina Town, Katsina State',
        phone: '08034445566'
      },
      {
        name: 'Daura General Hospital SARC',
        address: 'General Hospital Daura, Daura LGA, Katsina State',
        phone: '08027778899'
      }
    ]
  },
  {
    state: 'Sokoto',
    sarcCenters: [
      {
        name: 'Asiya Umar SARC, Specialist Hospital Sokoto',
        address: 'Specialist Hospital Sokoto, Sultan Abubakar Road, Sokoto',
        phone: '08036667788'
      }
    ]
  },
  {
    state: 'Borno',
    sarcCenters: [
      {
        name: 'Ummu Kulthum SARC, State Specialist Hospital',
        address: 'State Specialist Hospital, Shehu Laminu Way, Maiduguri, Borno State',
        phone: '08023334455'
      }
    ]
  },
  {
    state: 'Adamawa',
    sarcCenters: [
      {
        name: 'Hope Center SARC, Specialist Hospital Yola',
        address: 'Specialist Hospital Yola, Lamido Zubairu Way, Jimeta-Yola, Adamawa',
        phone: '08137926904, 08028889900'
      }
    ]
  },
  {
    state: 'Plateau',
    sarcCenters: [
      {
        name: 'JUTH SARC, Jos University Teaching Hospital',
        address: 'Jos University Teaching Hospital (JUTH), Lamingo, Jos, Plateau State',
        phone: '08035559911'
      }
    ]
  },
  {
    state: 'Oyo',
    sarcCenters: [
      {
        name: 'Ayodele SARC, Adeoyo Maternity Teaching Hospital',
        address: 'Adeoyo Maternity Teaching Hospital, Yemetu, Ibadan, Oyo State',
        phone: '08038882233'
      }
    ]
  },
  {
    state: 'Edo',
    sarcCenters: [
      {
        name: 'Vivian Centre SARC, Central Hospital Benin',
        address: 'Central Hospital Benin, Sapele Road, Benin City, Edo State',
        phone: '08025553344'
      }
    ]
  },
  {
    state: 'Rivers',
    sarcCenters: [
      {
        name: 'RSUTH SARC, Rivers State University Teaching Hospital',
        address: 'Rivers State University Teaching Hospital, Harley Street, Old GRA, Port Harcourt',
        phone: '08032228899'
      }
    ]
  },
  {
    state: 'Enugu',
    sarcCenters: [
      {
        name: 'Tamar SARC, ESUT Teaching Hospital Parklane',
        address: 'Enugu State University Teaching Hospital (ESUT), Parklane, GRA, Enugu',
        phone: '08037776655'
      }
    ]
  }
];

export default SARCData;
