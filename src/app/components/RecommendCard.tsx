import styles from "./recommendcard.module.css";

export default function RecommendCard({ imgPos, imgSrc, textSection, hotelName, Tel, address , delay }: { imgPos: boolean, imgSrc: string, textSection: string, hotelName: string, Tel: string, address: any , delay: number }) {
    return (
      <div
      className={`${styles.bannerImg} ${imgPos ? "" : "justify-end"} ${styles.cardAnimation}`}
      style={{
        animationDelay: `${delay}s`, // Use the delay here for animation
      }}
      >
        
        {/* Image Section */}
        <div className={`w-1/4 mr-3  ${imgPos ? 'order-1' : 'order-2'}`}>
          <img
            src={imgSrc}
            alt="Recommended"
            className={styles.Img}
          />
        </div>
        <div>
        <img
            src={imgSrc}
            alt="Recommended"
            className={styles.Img}
            style={{right:"50px", filter:"blur(20px)"}}
          />
        </div>
        <div className={styles.bannerFade}></div>
        <div className={styles.bannerLinearGradient}></div>
            <div className={styles.innerBorder}></div>

        {/* Text Section */}
        <div className={`p-4 ${imgPos ? 'order-2' : 'order-1'} z-20`} style={{position:"absolute", left:"0", right:"30%"}}>
          <h1 className={`text-4xl font-bold ${styles.TextHead}` }>{hotelName}</h1>
          <p className={` font-medium ${styles.Text}`}>Tel: {Tel}</p>
          <p className={` font-medium ${styles.Text}`}>
          City : {address.city} <br/>
          Street: {address.treet_name} <br/>
          Address: {address.street_addres} <br/>
          Zipcode: {address.zipcode}     
          </p>
        </div>
        <div style={{left:"20%", top:"70px", position:"absolute", right:"20px", zIndex:"20"}}>
        <p className={` font-medium ${styles.Text}`}>
          {textSection}
        </p>
        </div>
        
      </div>
    );
  }
  