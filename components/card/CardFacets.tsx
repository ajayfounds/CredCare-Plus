import { BACK, FRONT, MINI, type Facet } from './facets';

const FIELDS: Record<'mini' | 'front' | 'back', readonly Facet[]> = { mini: MINI, front: FRONT, back: BACK };

/** The low-poly facet field: white fills at 0–7 % with 7–14 % hairline edges. Decorative. */
export function CardFacets({ field }: { field: 'mini' | 'front' | 'back' }) {
  const f = FIELDS[field];
  return (
    <svg className="fkt" viewBox="0 0 1586 1000" preserveAspectRatio="none" aria-hidden="true">
      {f.map(([d, fill], i) => <path key={'f' + i} className="fk" fillOpacity={fill} d={d} />)}
      {f.map(([d, , edge], i) => <path key={'e' + i} className="fke" strokeOpacity={edge} d={d} />)}
    </svg>
  );
}
