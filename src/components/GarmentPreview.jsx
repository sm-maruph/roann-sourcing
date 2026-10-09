import { useId } from 'react';

// Original flat-lay garment illustrations keep sample styles distinct until catalog photography is supplied.
export default function GarmentPreview({ product }) {
  const id = useId().replaceAll(':', '');
  const boxer = product.category === 'boxers';
  const pants = product.category === 'trousers' || (product.category === 'denim' && ['Jeans', 'Denim Shorts'].includes(product.type));
  const short = product.type === 'Denim Shorts' || boxer;
  const long = product.category === 'sweaters' || product.type === 'Long Sleeve' || ['Denim Jacket', 'Denim Shirt'].includes(product.type);
  const shirtPath = long ? 'M85 51 115 39Q150 55 185 39L215 51 263 186 233 200 203 127 207 248Q150 256 93 248L97 127 67 200 37 186Z' : 'M85 57 119 43Q150 55 181 43L215 57 251 115 220 135 202 111 205 248Q150 257 95 248L98 111 80 135 49 115Z';
  const pantsPath = short ? 'M84 72Q150 65 216 72L230 226 164 230 150 145 136 230 70 226Z' : 'M93 34Q150 28 207 34L219 269 163 272 151 111 137 272 81 269Z';
  const path = pants || boxer ? pantsPath : shirtPath;
  return <svg className="garment-preview" viewBox="0 0 300 310" role="img" aria-label={`${product.name} design illustration`}>
    <defs><linearGradient id={`${id}shade`}><stop stopColor="#000" stopOpacity=".22"/><stop offset=".28" stopColor="#fff" stopOpacity=".12"/><stop offset=".53" stopColor="#000" stopOpacity=".05"/><stop offset=".77" stopColor="#fff" stopOpacity=".08"/><stop offset="1" stopColor="#000" stopOpacity=".2"/></linearGradient><pattern id={`${id}texture`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0H4M0 2H4" stroke="#fff" strokeOpacity=".08" strokeWidth=".5"/></pattern><pattern id={`${id}pattern`} width="20" height="20" patternUnits="userSpaceOnUse">{product.pattern === 'stripes' ? <path d="M0 5H20M0 9H20" stroke="#222" strokeWidth="2"/> : product.pattern === 'check' ? <path d="M0 0H20V20M10 0V20M0 10H20" stroke="#fff" strokeOpacity=".35" fill="none"/> : <><circle cx="5" cy="5" r="2" fill="#dbd2b4"/><path d="m13 12 3 5h-6z" fill="#a77570"/></>}</pattern></defs>
    <ellipse cx="150" cy="284" rx="84" ry="7" fill="#000" opacity=".065"/>
    <path d={path} fill={product.color} stroke="#000" strokeOpacity=".25" strokeWidth="1"/>
    <path d={path} fill={`url(#${id}shade)`}/><path d={path} fill={`url(#${id}texture)`}/>
    {product.pattern !== 'plain' && <path d={path} fill={`url(#${id}pattern)`} opacity=".75"/>}
    {pants || boxer ? <g fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="1.2"><path d={short ? 'M86 88Q150 81 215 88M150 87V143M94 93Q96 121 78 134M205 93Q204 121 222 134M77 213 135 216M165 216 224 213' : 'M94 47Q150 41 207 47M149 46V109M106 51Q110 81 91 88M194 51Q190 81 210 88M88 257 137 259M164 259 215 257'}/>{product.type === 'Cargo' && <path d="M89 133H126V178H87M174 133H212L214 178H174Z"/>}{product.type === 'Jogger' && <path d="M89 249H137M164 249H215M145 44 137 70M151 44 158 72"/>}</g> : <g fill="none" stroke="#000" strokeOpacity=".25" strokeWidth="1.3"><path d="M99 116 102 238Q150 244 198 238L201 116"/>{product.type === 'V-Neck' ? <path d="M119 43 150 81 181 43" strokeWidth="4"/> : product.type === 'Turtleneck' ? <path d="M122 48V27Q150 22 178 27V48" fill={product.color} strokeWidth="2"/> : <path d="M120 45Q150 87 180 45" strokeWidth="5"/>}{['Polo Shirt', 'Denim Shirt', 'Denim Jacket'].includes(product.type) && <path d="M117 43 130 78 150 62 170 78 183 43M150 62V246"/>}{['Cardigan', 'Half Zip'].includes(product.type) && <path d={product.type === 'Cardigan' ? 'M120 45 150 111 180 45M150 111V247' : 'M150 60V124'} strokeWidth="3"/>}{product.name === 'Graphic T-Shirt' && <text x="150" y="145" fill="#ddd" stroke="none" textAnchor="middle" fontSize="17" fontFamily="sans-serif" letterSpacing="4">ROANN</text>}{product.name.includes('Cable') && [112,130,150,170,188].map(x => <path key={x} d={`M${x} 90q-8 15 0 30t0 30t0 30t0 30t0 30`} stroke="#fff" strokeOpacity=".3" strokeWidth="3"/>)}</g>}
    {boxer && <><path d="M84 72Q150 65 216 72L218 92Q150 85 82 92Z" fill="#202328"/><text x="150" y="84" textAnchor="middle" fontSize="9" fill="#d5d5d5" letterSpacing="4" fontFamily="sans-serif">ROANN</text><path d="M135 93Q126 147 145 175M165 93Q174 147 155 175" stroke="#000" strokeOpacity=".2" fill="none"/></>}
  </svg>;
}
