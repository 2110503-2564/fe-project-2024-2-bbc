import RecommendCard from "./RecommendCard";

export default function RecommendList(){
    return(
        <div className="mx-[10%] space-y-10">
            <RecommendCard 
            imgPos={true} 
            imgSrc="/img/recommend1.jpg" 
            textSection="Discover a luxurious stay with our recommended hotel. Enjoy modern amenities, convenient
            locations, and unmatched comfort during your visit."/>

            <RecommendCard 
            imgPos={false} 
            imgSrc="/img/recommend1.jpg" 
            textSection="Discover a luxurious stay with our recommended hotel. Enjoy modern amenities, convenient
            locations, and unmatched comfort during your visit."/>

            <RecommendCard 
            imgPos={true} 
            imgSrc="/img/recommend1.jpg" 
            textSection="Discover a luxurious stay with our recommended hotel. Enjoy modern amenities, convenient
            locations, and unmatched comfort during your visit."/>
        </div>
       
    );
}