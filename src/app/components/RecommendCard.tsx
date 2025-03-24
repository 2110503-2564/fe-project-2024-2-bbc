import styles from "./recommendcard.module.css";

export default function RecommendCard({ imgPos, imgSrc, textSection }: { imgPos: boolean, imgSrc: string, textSection: string }) {
    return (
      <div className={`${styles.bannerImg} ${imgPos ? '' : 'justify-end'}`}>
        
        {/* Image Section */}
        <div className={`w-1/4 mr-3  ${imgPos ? 'order-1' : 'order-2'}`}>
          <img
            src={imgSrc}
            alt="Recommended"
            className={styles.Img}
          />
        </div>
        <div className={styles.bannerFade}></div>
        <div className={styles.bannerLinearGradient}></div>
            <div className={styles.innerBorder}></div>
        {/* Text Section */}
        <div className={`p-4 ${imgPos ? 'order-2' : 'order-1'} z-40`} style={{position:"absolute", left:"0", right:"0"}}>
          <h1 className={`text-xl font-bold ${styles.TextHead}` }>Hotel Recommendation</h1>
          <p className={` font-medium ${styles.Text}`}>
            {textSection}
          </p>
        </div>
        
      </div>
    );
  }
  