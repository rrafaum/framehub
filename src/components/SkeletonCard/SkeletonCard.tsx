import styles from "./SkeletonCard.module.css";

export default function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={styles.imagePlaceholder} />
    </div>
  );
}