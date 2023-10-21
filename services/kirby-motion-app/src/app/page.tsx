import { Index } from '@kirby-motion/ui';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <Index />
      </div>
    </main>
  );
}
