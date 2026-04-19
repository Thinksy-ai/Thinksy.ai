import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function MathBlock({ math }: any) {
  return <BlockMath math={math} />;
}
