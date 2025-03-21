export default function RecommendCard({ imgPos, imgSrc, textSection }: { imgPos: boolean, imgSrc: string, textSection: string }) {
    return (
      <div className={`shadow-lg p-5 rounded-lg bg-gray-200 flex flex-row items-center ${imgPos ? '' : 'justify-end'}`}>
        
        {/* Image Section */}
        <div className={`w-1/4 mr-3 ${imgPos ? 'order-1' : 'order-2'}`}>
          <img
            src={imgSrc}
            alt="Recommended"
            className="w-full h-auto rounded-lg"
          />
        </div>
  
        {/* Text Section */}
        <div className={`p-4 ${imgPos ? 'order-2' : 'order-1'} max-w-max`}>
          <h2 className="text-xl font-bold text-blue-500">Hotel Recommendation</h2>
          <p className="text-gray-700 font-medium">
            {textSection}
          </p>
        </div>
        
      </div>
    );
  }
  