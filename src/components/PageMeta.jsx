import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const META_MAP = {
  '/': {
    title: 'Skandha Groups | Premium Corporate Real Estate & Plotted Developments Hyderabad',
    description: 'Skandha Groups is a premier real estate and infrastructure development company in Hyderabad, developing legally clear, vasthu-compliant gated residential communities.'
  },
  '/about': {
    title: 'About Us | Skandha Groups - Building Trust. Creating Lasting Value.',
    description: 'Learn about Skandha Groups, our corporate foundation in Hastinapuram, Hyderabad, our development philosophy, and executive leadership.'
  },
  '/projects': {
    title: 'Projects | Residential Developments - Skandha Groups',
    description: 'Discover Skandha Groups residential ventures featuring our flagship gated community layout Alekya in Kadthal.'
  },
  '/projects/alekya': {
    title: "Alekya | DTCP & TS RERA Approved Plotted Community Kadthal - Skandha Groups",
    description: "Explore Alekya (Alekya's Brundavan) in Kadthal, Srisailam Highway. DTCP Approved TLP 87/2024/H, TS RERA PO2400009081, 60ft, 40ft & 33ft BT roads."
  },
  '/gallery': {
    title: 'Media Gallery | Architectural Elevations & Community Landscapes - Skandha Groups',
    description: 'View high-definition architectural imagery, luxury villa concepts, community parks, avenue boulevards, and modern infrastructure by Skandha Groups.'
  },
  '/contact': {
    title: 'Contact Us | Skandha Groups Corporate Office Hastinapuram Hyderabad',
    description: 'Connect with Skandha Groups corporate headquarters at Bata Building, Hastinapuram, Hyderabad. Schedule consultations or inquiries.'
  }
};

export default function PageMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = META_MAP[pathname] || {
      title: 'Skandha Groups | Real Estate & Infrastructure Developers',
      description: 'Skandha Groups premier corporate real estate developments in Hyderabad.'
    };

    document.title = meta.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', meta.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = meta.description;
      document.head.appendChild(metaDesc);
    }
  }, [pathname]);

  return null;
}
